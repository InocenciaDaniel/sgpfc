import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { withRouter } from "react-router-dom";
import { Toast } from "primereact/toast";
import api from "../axiosConfig";

class UtilizadorEditar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      id: null,
      pkUtilizador: "",
      conta: "",
      nome: "",
      email: "",
      telefone: "",
      sexo: null,
      tipoConta: null,
      universidade: null,
      grauAcademicoOrientador: null,
      turmaEstudante: null,
      estado: "",
      numMatriculaEstudante: "",
      sexoOptions: [],
      tipoContaOptions: [],
      universidadeOptions: [],
      grauAcademicoOrientadorOptions: [
        { label: "Professor Auxiliar", value: "Professor Auxiliar" },
        { label: "Mestre", value: "Mestre" },
        { label: "Licenciado", value: "Licenciado" },
        { label: "Assistente", value: "Assistente" },
      ],
      curriculumFile: null,

      toast: null,
    };
  }

  async componentDidMount() {
    try {
      const sexoResponse = await api.get("sexo/findAll");
      let sexoOptions = sexoResponse.data.map((s) => ({
        label: s.designacao,
        value: s.pkSexo,
      }));

      const tipoContaResponse = await api.get("tipoConta/findAll");
      const tipoContaOptions = tipoContaResponse.data.map((tc) => ({
        label: tc.designacao,
        value: tc.pkTipoConta,
      }));

      const { id } = this.props.match.params;
      const utilizadorResponse = await api.get(
        `conta/findByFkUtilizador/${id}`
      );
      this.setState({
        id,
        pkUtilizador: utilizadorResponse.data.fkUtilizador.pkUtilizador,
        conta: utilizadorResponse.data.pkConta,
        nome: utilizadorResponse.data.fkUtilizador.nome,
        email: utilizadorResponse.data.email,
        telefone: utilizadorResponse.data.fkUtilizador.telefone,
        sexo: utilizadorResponse.data.fkUtilizador.fkSexo.pkSexo,
        estado: utilizadorResponse.data.fkUtilizador.estado,
        tipoConta: utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta,
        numMatriculaEstudante:
          utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta === 2
            ? utilizadorResponse.data.fkUtilizador.numMatriculaEstudante
            : "",
        sexoOptions,
        tipoContaOptions,
        curriculumFile: utilizadorResponse.data.fkUtilizador.curriculumUrl,
      });

      if (utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta === 2) {
        const turmaEstudanteResponse = await api.get(
          `turmaEstudante/findByEstudante/${this.state.pkUtilizador}`
        );
        if (turmaEstudanteResponse.data) {
          this.setState({
            turmaEstudante: turmaEstudanteResponse.data.fkTurma,
          });
        }
      }

      if (utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta === 3) {
        const universidadeResponse = await api.get("universidade/findAll");
        const universidadeOptions = universidadeResponse.data.map((u) => ({
          label: u.designacao,
          value: u.pkUniversidade,
        }));

        this.setState({
          universidadeOptions,
          universidade:
            utilizadorResponse.data.fkUtilizador.fkUniversidadeOrientador
              .pkUniversidade,
          grauAcademicoOrientador:
            utilizadorResponse.data.fkUtilizador.grauAcademicoOrientador,
        });
      }

      console.log(this.state.turmaEstudante);
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

  handleSexoChange = (e) => {
    this.setState({ sexo: e.value });
  };

  handleGrauAcademicoOrientadorChange = (e) => {
    this.setState({ grauAcademicoOrientador: e.value });
  };

  handleUniversidadeChange = (e) => {
    this.setState({ universidade: e.value });
  };

  handleTipoContaChange = (e) => {
    const { value } = e;
    this.setState({
      tipoConta: value,
      numMatriculaEstudante:
        value === 2 ? "" : this.state.numMatriculaEstudante,
      grauAcademicoOrientador:
        value === 3 ? "" : this.state.grauAcademicoOrientador,
      universidade: value === 3 ? "" : this.state.universidade,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        usuarioLogado,
        pkUtilizador,
        conta,
        nome,
        email,
        telefone,
        sexo,
        tipoConta,
        numMatriculaEstudante,
        universidade,
        grauAcademicoOrientador,
        curriculumFile,
      } = this.state;

      const utilizadorData = {
        pkUtilizador,
        conta,
        nome,
        email,
        telefone,
        numMatriculaEstudante: tipoConta === 2 ? numMatriculaEstudante : null,
        sexo,
        tipoConta,
        grauAcademicoOrientador:
          tipoConta === 3 ? grauAcademicoOrientador : null,
        universidade: tipoConta === 3 ? universidade : null,
      };

      const formData = new FormData();
      formData.append(
        "utilizador",
        new Blob([JSON.stringify(utilizadorData)], {
          type: "application/json",
        })
      );

      if (tipoConta === 3) {
        formData.append("curriculumUrl", curriculumFile);
      }

      await api.put(`utilizador/update/${pkUtilizador}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (
        usuarioLogado.fkUtilizador.fkTipoConta.designacao ===
        "Conselho Científico"
      ) {
        this.props.history.push("/utilizador-orientador-index");
      } else if (
        usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Estudante"
      ) {
        this.toast.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Informações actualizadas com sucesso!",
          life: 3000,
        });

        this.props.history.push(
          `/utilizador-editar/${usuarioLogado.fkUtilizador.pkUtilizador}`
        );
      } else {
        this.props.history.push("/utilizador-index");
      }
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  render() {
    const {
      usuarioLogado,
      sexoOptions,
      tipoContaOptions,
      tipoConta,
      sexo,
      numMatriculaEstudante,
      turmaEstudante,
      grauAcademicoOrientadorOptions,
      grauAcademicoOrientador,
      universidadeOptions,
      universidade,
    } = this.state;

    const isConselhoCientifico =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao ===
        "Conselho Científico";

    return (
      <div>
        <style>
          {`
              .p-dropdown-label, .p-inputtext{
                  width: 100%;
              }
            `}
        </style>
        {usuarioLogado ? (
          <div>
            <Toast ref={(el) => (this.toast = el)} />
            <form className="p-7" onSubmit={this.handleSubmit}>
              <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
                <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                  <li>
                    <a
                      href={
                        isConselhoCientifico
                          ? "/utilizador-orientador-index"
                          : "/utilizador-index"
                      }
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
                      Editar Informações do Utilizador
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
                    <div className="field">
                      <label for="nome">Nome Completo</label>
                      <InputText
                        required
                        id="nome"
                        type="text"
                        name="nome"
                        value={this.state.nome}
                        onChange={this.handleChange}
                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      />
                    </div>

                    <div className="formgrid grid">
                      <div className="field col">
                        <label for="email">Email</label>
                        <InputText
                          required
                          id="email"
                          type="email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div className="field col">
                        <label for="telefone">Telefone</label>
                        <InputText
                          required
                          id="telefone"
                          type="text"
                          name="telefone"
                          value={this.state.telefone}
                          onChange={this.handleChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                    </div>
                    <div className="formgrid grid">
                      <div className="field col">
                        <label for="tipoConta">Tipo Conta</label>
                        <Dropdown
                          required
                          id="tipoConta"
                          value={tipoConta}
                          options={tipoContaOptions}
                          onChange={this.handleTipoContaChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div className="field col">
                        <label for="sexo">Genero</label>
                        <Dropdown
                          required
                          id="sexo"
                          value={sexo}
                          options={sexoOptions}
                          onChange={this.handleSexoChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                    </div>
                    {this.state.tipoConta === 2 && (
                      <div>
                        <div className="field">
                          <label for="numMatriculaEstudante">
                            Número de Matrícula do Estudante
                          </label>
                          <InputText
                            required
                            id="numMatriculaEstudante"
                            type="text"
                            name="numMatriculaEstudante"
                            value={numMatriculaEstudante}
                            onChange={this.handleChange}
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          />
                        </div>
                        {turmaEstudante ? (
                          <div className="field">
                            <label for="turma">Turma</label>
                            <InputText
                              id="turma"
                              value={`${turmaEstudante.codigo} `}
                              className="w-full text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round outline-none focus:border-primary"
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    )}
                    {this.state.tipoConta === 3 && (
                      <div>
                        <div className="field">
                          <label for="grauAcademicoOrientador">
                            Grau Academico do Orientador
                          </label>
                          <Dropdown
                            required
                            id="grauAcademicoOrientador"
                            value={grauAcademicoOrientador}
                            options={grauAcademicoOrientadorOptions}
                            onChange={this.handleGrauAcademicoOrientadorChange}
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          />
                        </div>
                        <div className="field">
                          <label for="universidade">
                            Universidade Onde Leciona
                          </label>
                          <Dropdown
                            required
                            id="universidade"
                            value={universidade}
                            options={universidadeOptions}
                            onChange={this.handleUniversidadeChange}
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          />
                        </div>
                        {/* Como passar o curriculumUrl que já esta no cadastrado*/}
                        <div className="field">
                          <label for="curriculumUrl">
                            Curriculum Vitae do Orientador
                          </label>
                          <InputText
                            id="curriculumUrl"
                            value={this.state.curriculumFile}
                            disabled
                            className="w-full text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round outline-none focus:border-primary"
                          />
                        </div>

                        <div className="field">
                          <label for="curriculumFile">
                            Atualizar o Curriculum Vitae do Orientador
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
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default withRouter(UtilizadorEditar);
