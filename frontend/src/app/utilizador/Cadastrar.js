import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { withRouter } from "react-router-dom";
import api from "../axiosConfig";
import { Toast } from "primereact/toast";

class UtilizadorCadastrar extends Component {
  state = {
    usuarioLogado: null,
    startDate: new Date(),
    error: null,
    nome: "",
    email: "",
    telefone: "",
    sexo: null,
    tipoConta: null,
    numMatriculaEstudante: "",
    sexoOptions: [],
    tipoContaOptions: [],
    turmasOptions: [],
    turmaSelecionada: null,
    existsByNumMatriculaEstudante: null,
    grauAcademicoOrientador: null,
    grauAcademicoOrientadorOptions: [
      { label: "Professor Auxiliar", value: "Professor Auxiliar" },
      { label: "Mestre", value: "Mestre" },
      { label: "Licenciado", value: "Licenciado" },
      { label: "Assistente", value: "Assistente" },
    ],
    universidade: 1, // Por default Universidade Catolica de angola
    universidadeOptions: [],

    curriculumFile: null,
    fileName: "",
  };

  async componentDidMount() {
    try {
      const sexoResponse = await api.get("sexo/findAll");
      const sexoOptions = sexoResponse.data.map((s) => ({
        label: s.designacao,
        value: s.pkSexo,
      }));

      const tipoContaResponse = await api.get("tipoConta/findAll");
      const tipoContaOptions = tipoContaResponse.data
        .filter((tc) => tc.designacao !== "Coordenador")
        .map((tc) => ({ label: tc.designacao, value: tc.pkTipoConta }));

      const turmasResponse = await api.get("turma/findByAllDeletedAtISNull");
      const turmasOptions = turmasResponse.data.map((t) => ({
        label: `${t.fkSemestre.designacao} - ${t.fkDisciplina.designacao}  - ${
          t.fkDisciplina.fkCurso.designacao
        } - ${t.fkAnoLectivo.designacao} ${
          t.turmaCorrente ? " (Turma Corrente)" : ""
        }`,
        value: t.pkTurma,
      }));

      const universidadeResponse = await api.get("universidade/findAll");
      const universidadeOptions = universidadeResponse.data.map((u) => ({
        label: u.designacao,
        value: u.pkUniversidade,
      }));

      this.setState({
        sexoOptions,
        tipoContaOptions,
        turmasOptions,
        universidadeOptions,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleTipoContaChange = (e) => {
    this.setState({ tipoConta: e.value });
  };

  handleSexoChange = (e) => {
    this.setState({ sexo: e.value });
  };

  handleTurmaChange = (e) => {
    this.setState({ turmaSelecionada: e.value });
  };

  handleGrauAcademicoOrientadorChange = (e) => {
    this.setState({ grauAcademicoOrientador: e.value });
  };

  handleUniversidadeChange = (e) => {
    this.setState({ universidade: e.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const {
      nome,
      email,
      telefone,
      sexo,
      tipoConta,
      numMatriculaEstudante,
      turmaSelecionada,
      grauAcademicoOrientador,
      universidade,
      usuarioLogado,
      curriculumFile,
    } = this.state;

    if (tipoConta === 3 && !curriculumFile) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, faça o upload do Curriculum Vitae do Orientador.",
        life: 3000,
      });
      return;
    }

    try {
      const existsByEmailResponse = await api.get(
        `conta/existsByEmail/${email}`
      );
      if (existsByEmailResponse.data) {
        this.setState({ error: "O email já está cadastrado." });
        this.toast.show({
          severity: "error",
          summary: "Erro",
          detail: "O email já está cadastrado.",
          life: 3000,
        });
        return;
      }

      if (tipoConta === 2) {
        const existsByNumMatriculaEstudanteResponse = await api.get(
          `utilizador/existsByNumMatriculaEstudante/${numMatriculaEstudante}`
        );
        if (existsByNumMatriculaEstudanteResponse.data) {
          this.setState({ error: "O número de matrícula já está cadastrado." });
          this.toast.show({
            severity: "error",
            summary: "Erro",
            detail: "O número de matrícula já está cadastrado.",
            life: 3000,
          });
          return;
        }
      }

      const utilizadorData = {
        nome,
        email,
        telefone,
        numMatriculaEstudante: tipoConta === 2 ? numMatriculaEstudante : null,
        sexo,
        tipoConta,
        grauAcademicoOrientador:
          tipoConta === 3 ? grauAcademicoOrientador : null,
        universidade: tipoConta === 3 ? universidade : null,
        cadastradoPor: usuarioLogado.fkUtilizador.pkUtilizador,
      };

      const formData = new FormData();
      formData.append(
        "utilizador",
        new Blob([JSON.stringify(utilizadorData)], {
          type: "application/json",
        })
      );

      if (tipoConta === 3 && curriculumFile) {
        formData.append("curriculumUrl", curriculumFile);
      }

      const utilizadorResponse = await api.post("utilizador/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const utilizadorId = utilizadorResponse.data.pkUtilizador;
      console.log(utilizadorId);

      if (tipoConta === 2 && turmaSelecionada) {
        await api.post("turmaEstudante/save", {
          fkTurma: turmaSelecionada,
          fkEstudante: utilizadorId,
          estado: "activo",
        });
      }

      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Utilizador e conta cadastrados com sucesso.",
        life: 3000,
      });
      if (
        usuarioLogado.fkUtilizador.fkTipoConta.designacao ===
        "Conselho Científico"
      ) {
        setTimeout(() => {
          this.props.history.push("/utilizador-orientador-index");
        }, 1000);
      } else {
        setTimeout(() => {
          this.props.history.push("/utilizador-index");
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao salvar utilizador e conta", error);
      alert("Erro ao salvar utilizador e conta.");
    }
  };

  render() {
    const {
      usuarioLogado,
      sexoOptions,
      tipoContaOptions,
      grauAcademicoOrientadorOptions,
      universidadeOptions,
      turmasOptions,
    } = this.state;

    const isConselhoCientifico =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao ===
        "Conselho Científico";

    return (
      <div>
        {usuarioLogado ? (
          <form className="p-7" onSubmit={this.handleSubmit}>
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/utilizador-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Utilizadores
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Formulário de Cadastro
                  </span>
                </li>
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                  <div className="flex align-items-center text-700 flex-wrap"></div>
                </div>
                <div className="mt-3 lg:mt-0">
                  <Button
                    type="submit"
                    label="Salvar Alterações"
                    className="p-button-outlined mr-2"
                  />
                </div>
              </div>
            </div>

            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                <div>
                  <div class="field">
                    <label for="nome">Nome Completo</label>
                    <InputText
                      required
                      id="nome"
                      type="text"
                      name="nome"
                      onChange={this.handleChange}
                      class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                  </div>

                  <div class="formgrid grid">
                    <div class="field col">
                      <label for="email">Email</label>
                      <InputText
                        required
                        id="email"
                        type="email"
                        name="email"
                        onChange={this.handleChange}
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      />
                    </div>
                    <div class="field col">
                      <label for="telefone">Telefone</label>
                      <InputText
                        required
                        id="telefone"
                        type="text"
                        name="telefone"
                        onChange={this.handleChange}
                        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>
                  <div class="formgrid grid">
                    <div class="field col">
                      <label for="tipoConta">Tipo Conta</label>
                      <Dropdown
                        required
                        id="tipoConta"
                        options={
                          isConselhoCientifico
                            ? tipoContaOptions.filter(
                                (option) => option.value === 3
                              )
                            : tipoContaOptions
                        }
                        value={this.state.tipoConta}
                        onChange={this.handleTipoContaChange}
                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      />
                    </div>
                    <div class="field col">
                      <label for="sexo">Genero</label>
                      <Dropdown
                        required
                        id="sexo"
                        value={this.state.sexo}
                        options={sexoOptions}
                        onChange={this.handleSexoChange}
                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      />
                    </div>
                  </div>
                  {this.state.tipoConta === 2 && (
                    <div>
                      <div class="field">
                        <label for="numMatriculaEstudante">
                          Número de Matrícula do Estudante
                        </label>
                        <InputText
                          required
                          id="numMatriculaEstudante"
                          type="text"
                          name="numMatriculaEstudante"
                          onChange={this.handleChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div class="field">
                        <label for="turma">Turma</label>
                        <Dropdown
                          id="turma"
                          value={this.state.turmaSelecionada}
                          options={turmasOptions}
                          onChange={this.handleTurmaChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                    </div>
                  )}
                  {this.state.tipoConta === 3 && (
                    <div>
                      <div class="field">
                        <label for="grauAcademicoOrientador">
                          Grau Academico do Orientador
                        </label>
                        <Dropdown
                          required
                          id="grauAcademicoOrientador"
                          value={this.state.grauAcademicoOrientador}
                          options={grauAcademicoOrientadorOptions}
                          onChange={this.handleGrauAcademicoOrientadorChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                      {isConselhoCientifico ? (
                        <div class="field">
                          <label for="universidade">
                            Universidade Onde Leciona
                          </label>
                          <Dropdown
                            required
                            id="universidade"
                            value={this.state.universidade}
                            options={universidadeOptions}
                            onChange={this.handleUniversidadeChange}
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          />
                        </div>
                      ) : null}

                      <div class="field">
                        <label for="universidade">
                          Faça o upload do Curriculum Vitae do Orientador
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            this.setState({
                              curriculumFile: e.target.files[0],
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    );
  }
}

export default withRouter(UtilizadorCadastrar);
