import React, { Component } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Link, withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import api from "../axiosConfig";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

class TemaPropor extends Component {
  state = {
    usuarioLogado: null,
    titulo: "",
    descricao: "",
    diferencial: "",
    justificativa: "",
    observacoes: "",
    linhaPesquisaOptions: [],
    orientadoresOptions: [],
    localRealizacaoOptions: [],
    areaConhecimentoOptions: [],
    linhaPesquisa: null,
    orientadorProposto: null,
    localRealizacao: null,
    areaConhecimento: null,

    displayDialogOrientadorPropor: false,
    nome: "",
    email: "",
    telefone: "",
    sexo: null,
    sexoOptions: [],
    grauAcademicoOrientador: null,
    grauAcademicoOrientadorOptions: [
      { label: "Professor Auxiliar", value: "Professor Auxiliar" },
      { label: "Mestre", value: "Mestre" },
      { label: "Licenciado", value: "Licenciado" },
      { label: "Assistente", value: "Assistente" },
    ],
    universidade: null,
    universidadeOptions: [],

    displayDialogUniversidade: false,
    novaUniversidadeDesignacao: "",
    novaUniversidadeDescricao: "",
    novaUniversidadeSigla: "",

    estudanteProposto: null,
    estudantesOptions: [],

    curriculumFile: null,

    toast: null,
  };

  async componentDidMount() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }

    try {
      const linhaPesquisaResponse = await api.get("linhaPesquisa/findAll");
      const linhaPesquisaOptions = linhaPesquisaResponse.data.map((l) => ({
        label: l.designacao,
        value: l.pkLinhaPesquisa,
      }));

      const orientadoresResponse = await api.get(
        "utilizador/findAllOrientador"
      );
      const orientadoresOptions = orientadoresResponse.data.map((o) => ({
        label: o.nome,
        value: o.pkUtilizador,
      }));

      const estudanteResponse = await api.get(
        "utilizador/findAllEstudanteMatriculado"
      );
      const estudantesOptions = estudanteResponse.data.map((o) => ({
        label: o.nome,
        value: o.pkUtilizador,
      }));

      const localRelaizacaoResponse = await api.get("localRealizacao/findAll");
      const localRealizacaoOptions = localRelaizacaoResponse.data.map((l) => ({
        label: `${l.designacao} ( ${l.convenioCientifico} )`,
        value: l.pkLocalRealizacao,
      }));

      const areaConhecimentoResponse = await api.get(
        "areaConhecimento/findAll"
      );
      const areaConhecimentoOptions = areaConhecimentoResponse.data.map(
        (a) => ({ label: a.designacao, value: a.pkAreaConhecimento })
      );

      const sexoResponse = await api.get("sexo/findAll");
      const sexoOptions = sexoResponse.data.map((s) => ({
        label: s.designacao,
        value: s.pkSexo,
      }));

      const universidadeResponse = await api.get(
        "universidade/findAllUniversidadeMenosUcan"
      );
      const universidadeOptions = universidadeResponse.data.map((u) => ({
        label: u.designacao,
        value: u.pkUniversidade,
      }));

      this.setState({
        linhaPesquisaOptions,
        orientadoresOptions,
        localRealizacaoOptions,
        areaConhecimentoOptions,
        sexoOptions,
        estudantesOptions,
        universidadeOptions,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleLinhaPesquisaChange = (e) => {
    this.setState({ linhaPesquisa: e.value });
  };

  handleOrientadorPropostoChange = (e) => {
    this.setState({ orientadorProposto: e.value });
  };

  handleLocalRealizacaoChange = (e) => {
    this.setState({ localRealizacao: e.value });
  };

  handleAreaConhecimentoChange = (e) => {
    this.setState({ areaConhecimento: e.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      titulo,
      descricao,
      diferencial,
      justificativa,
      observacoes,
      linhaPesquisa,
      orientadorProposto,
      localRealizacao,
      areaConhecimento,
      usuarioLogado,
    } = this.state;
    let orientadorPropostoEmail = null;

    try {
      if (typeof orientadorProposto === "number") {
        const response = await api.get(
          `conta/findByFkUtilizador/${orientadorProposto}`
        );
        orientadorPropostoEmail = response.data.email;
      } else {
        orientadorPropostoEmail = orientadorProposto;
      }

      await api.post("tema/save", {
        titulo,
        descricao,
        diferencial,
        justificativa,
        observacoes,
        linhaPesquisa,
        orientadorPropostoEmail,
        localRealizacao,
        areaConhecimento,
        estudanteProposto:
          usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Estudante"
            ? usuarioLogado.fkUtilizador.pkUtilizador
            : this.state.estudanteProposto,
        temaPropostoPor: usuarioLogado.fkUtilizador.pkUtilizador,
      });
      this.props.history.push("/dashboard");
    } catch (error) {
      console.error("Erro ao propor tema", error);
      alert("Erro ao propor tema.");
    }
  };

  adicionarOrientador = async (e) => {
    e.preventDefault();
    const {
      nome,
      email,
      telefone,
      sexo,
      grauAcademicoOrientador,
      universidade,
      usuarioLogado,
      curriculumFile,
    } = this.state;

    if (
      !nome ||
      !email ||
      !telefone ||
      !sexo ||
      !grauAcademicoOrientador ||
      !universidade ||
      !curriculumFile
    ) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, preencha todos os campos.",
        life: 5000,
      });

      return;
    }

    const existsByEmailResponse = await api.get(`conta/existsByEmail/${email}`);
    if (existsByEmailResponse.data) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "O email já está cadastrado.",
        life: 5000,
      });
      this.setState({ error: "O email já está cadastrado." });
      return;
    }

    const novo = {
      nome,
      email,
      telefone,
      sexo,
      grauAcademicoOrientador,
      universidade,
      cadastradoPor: usuarioLogado.fkUtilizador.pkUtilizador,
    };

    try {
      const formData = new FormData();
      formData.append(
        "utilizador",
        new Blob([JSON.stringify(novo)], {
          type: "application/json",
        })
      );

      formData.append("curriculumUrl", curriculumFile);

      const utilizadorResponse = await api.post(
        "orientadorProposto/save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const utilizadorAdicionado = utilizadorResponse.data;

      this.setState((prevState) => ({
        orientadoresOptions: [
          ...prevState.orientadoresOptions,
          { label: utilizadorAdicionado.nome, value: email },
        ],
        displayDialogOrientadorPropor: false,
        nome: "",
        email: "",
        telefone: "",
      }));

      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Orientador proposto com sucesso.",
        life: 5000,
      });

      return;
    } catch (error) {
      console.error(
        "Erro ao adicionar utilizador:",
        error.response ? error.response.data : error.message
      );
    }
  };

  adicionarUniversidade = async () => {
    const {
      novaUniversidadeSigla,
      novaUniversidadeDesignacao,
      novaUniversidadeDescricao,
    } = this.state;

    if (
      !novaUniversidadeSigla ||
      !novaUniversidadeDesignacao ||
      !novaUniversidadeDescricao
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novo = {
      designacao: novaUniversidadeSigla,
      descricao: novaUniversidadeDescricao,
      sigla: novaUniversidadeSigla,
    };

    try {
      const response = await api.post("universidade/save", novo);

      const universidadeAdicionado = response.data;
      this.setState((prevState) => ({
        universidadeOptions: [
          ...prevState.universidadeOptions,
          {
            label: universidadeAdicionado.designacao,
            value: universidadeAdicionado.pkUniversidade,
          },
        ],
        displayDialogUniversidade: false,
        novaUniversidadeDescricao: "",
        novaUniversidadeDesignacao: "",
        novaUniversidadeSigla: "",
      }));
    } catch (error) {
      console.error("Erro ao adicionar universidade:", error);
      alert("Erro ao salvar universidade. Tente novamente.");
    }
  };

  render() {
    const {
      usuarioLogado,
      linhaPesquisaOptions,
      linhaPesquisa,
      orientadoresOptions,
      orientadorProposto,
      localRealizacaoOptions,
      localRealizacao,
      areaConhecimentoOptions,
      areaConhecimento,
    } = this.state;
    //const isEstudante = usuarioLogado && usuarioLogado.fkUtilizador.fkTipoConta.designacao === 'Estudante';
    const isOrientador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador";

    return (
      <div>
        {usuarioLogado ? (
          <form className="p-7" onSubmit={this.handleSubmit}>
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/dashboard"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Temas
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Formulário para propor um novo tema
                  </span>
                </li>
                <li className="ml-auto">
                  <Button
                    type="submit"
                    label="Salvar Alterações"
                    className="p-button-outlined mr-2"
                  />
                </li>
              </ul>
            </div>
            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                <div className="field">
                  <label htmlFor="nome">Titulo</label>
                  <InputText
                    required
                    id="titulo"
                    name="titulo"
                    type="text"
                    placeholder="Titulo do Tema"
                    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    onChange={this.handleChange}
                  />
                </div>
                <div class="formgrid grid">
                  <div className="field col">
                    <label htmlFor="descricao">Descrição</label>
                    <InputTextarea
                      required
                      id="descricao"
                      name="descricao"
                      type="text"
                      placeholder="Descrição do Tema"
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="field col">
                    <label htmlFor="descricao">Justificativa</label>
                    <InputTextarea
                      required
                      id="justificativa"
                      name="justificativa"
                      type="text"
                      placeholder="Justificativa do Tema"
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div class="formgrid grid">
                  <div className="field col">
                    <label htmlFor="descricao">Diferencial</label>
                    <InputTextarea
                      required
                      id="diferencial"
                      name="diferencial"
                      type="text"
                      placeholder="Diferencial do Tema"
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="field col">
                    <label htmlFor="descricao">Observações</label>
                    <InputTextarea
                      id="observacoes"
                      name="observacoes"
                      type="text"
                      placeholder="Outras Observações Sobre o Tema"
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div class="formgrid grid">
                  <div class="field col">
                    <label htmlFor="sexo">Linha de Pesquisa</label>
                    <Dropdown
                      required
                      id="local_realizacao"
                      value={linhaPesquisa}
                      options={linhaPesquisaOptions}
                      onChange={this.handleLinhaPesquisaChange}
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                  </div>
                  <div class="field col">
                    <label htmlFor="localRealizacao">Local de Realizacao</label>
                    <Dropdown
                      id="localRealizacao"
                      value={localRealizacao}
                      options={localRealizacaoOptions}
                      onChange={this.handleLocalRealizacaoChange}
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                  </div>
                  <div class="field col">
                    <label htmlFor="areaConhecimento">
                      Area de Conhecimento
                    </label>
                    <Dropdown
                      id="areaConhecimento"
                      value={areaConhecimento}
                      options={areaConhecimentoOptions}
                      onChange={this.handleAreaConhecimentoChange}
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1, marginRight: 5 }}>
                    <label htmlFor="orientador_proposto">
                      Orientador Proposto
                    </label>
                    <Dropdown
                      required
                      id="orientador_proposto"
                      value={orientadorProposto}
                      options={orientadoresOptions}
                      onChange={this.handleOrientadorPropostoChange}
                      placeholder="Selecciona o Orientador Proposto"
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary"
                    />
                  </div>
                  <Link to="#">
                    <Button
                      label=""
                      icon="pi pi-plus"
                      className="p-button-label"
                      onClick={() =>
                        this.setState({ displayDialogOrientadorPropor: true })
                      }
                      style={{
                        marginTop: 10,
                        height: "3.5rem",
                        width: "3.5rem",
                      }}
                    />
                  </Link>
                  <Dialog
                    header="Propor Orientador de Outras Universidades"
                    visible={this.state.displayDialogOrientadorPropor}
                    style={{ width: "50vw" }}
                    onHide={() =>
                      this.setState({ displayDialogOrientadorPropor: false })
                    }
                  >
                    <div
                      style={{
                        padding: "1rem",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div class="grid">
                        <div class="col-12">
                          <div class="field">
                            <label htmlFor="nome">Nome Completo</label>
                            <InputText
                              id="nome"
                              name="nome"
                              type="text"
                              onChange={(e) =>
                                this.setState({ nome: e.target.value })
                              }
                              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                              id="email"
                              name="email"
                              type="text"
                              onChange={(e) =>
                                this.setState({ email: e.target.value })
                              }
                              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="field">
                            <label htmlFor="telefone">Telefone</label>
                            <InputText
                              id="telefone"
                              name="telefone"
                              type="text"
                              onChange={(e) =>
                                this.setState({ telefone: e.target.value })
                              }
                              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            />
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="sexo">Sexo</label>
                            <Dropdown
                              required
                              id="sexo"
                              value={this.state.sexo}
                              options={this.state.sexoOptions}
                              onChange={(e) => this.setState({ sexo: e.value })}
                              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            />
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="novaDisciplinaDescricao">
                              Grau Academico do Orientador
                            </label>
                            <Dropdown
                              required
                              id="grauAcademicoOrientador"
                              value={this.state.grauAcademicoOrientador}
                              options={
                                this.state.grauAcademicoOrientadorOptions
                              }
                              onChange={(e) =>
                                this.setState({
                                  grauAcademicoOrientador: e.value,
                                })
                              }
                              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            />
                          </div>
                        </div>
                        <div class="col-12">
                          <div
                            style={{
                              marginBottom: "2rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ flex: 1, marginRight: 20 }}>
                              <label for="universidade">
                                Universidade Onde Lecciona
                              </label>
                              <Dropdown
                                required
                                id="universidade"
                                value={this.state.universidade}
                                options={this.state.universidadeOptions}
                                onChange={(e) =>
                                  this.setState({ universidade: e.value })
                                }
                                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                              />
                            </div>

                            <Link to="#">
                              <Button
                                label=""
                                icon="pi pi-plus"
                                className="p-button-label"
                                style={{ marginTop: 10 }}
                                onClick={() =>
                                  this.setState({
                                    displayDialogUniversidade: true,
                                  })
                                }
                              />
                            </Link>
                            <Dialog
                              header="Adicionar Universidade"
                              visible={this.state.displayDialogUniversidade}
                              style={{ width: "40vw" }}
                              onHide={() =>
                                this.setState({
                                  displayDialogUniversidade: false,
                                })
                              }
                            >
                              <div>
                                <div class="grid">
                                  <div class="col-6">
                                    <div class="field">
                                      <label htmlFor="novaUniversidadeSigla">
                                        Sigla
                                      </label>
                                      <InputText
                                        id="novaUniversidadeSigla"
                                        type="text"
                                        onChange={(e) =>
                                          this.setState({
                                            novaUniversidadeSigla:
                                              e.target.value,
                                          })
                                        }
                                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                      />
                                    </div>
                                  </div>
                                  <div class="col-6">
                                    <div
                                      class="field"
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      <label htmlFor="novaUniversidadeDesignacao">
                                        Designação
                                      </label>
                                      <InputText
                                        id="novaUniversidadeDesignacao"
                                        type="text"
                                        onChange={(e) =>
                                          this.setState({
                                            novaUniversidadeDesignacao:
                                              e.target.value,
                                          })
                                        }
                                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                      />
                                    </div>
                                  </div>
                                  <div class="col-12">
                                    <div
                                      class="field"
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      <label htmlFor="novaUniversidadeDescricao">
                                        Descrição
                                      </label>
                                      <InputTextarea
                                        id="novaUniversidadeDescricao"
                                        type="text"
                                        onChange={(e) =>
                                          this.setState({
                                            novaUniversidadeDescricao:
                                              e.target.value,
                                          })
                                        }
                                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: "grid", gap: "1rem" }}>
                                  <Button
                                    label="Adicionar"
                                    onClick={this.adicionarUniversidade}
                                  />
                                </div>
                              </div>
                            </Dialog>
                          </div>
                        </div>

                        <div class="col-12">
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
                      </div>
                      <div style={{ display: "grid", gap: "1rem" }}>
                        <Button
                          label="Adicionar"
                          onClick={this.adicionarOrientador}
                        />
                      </div>
                    </div>
                  </Dialog>
                </div>
                {isOrientador ? (
                  <div className="field">
                    <label htmlFor="estudanteProposto">
                      Estudante Proposto
                    </label>
                    <Dropdown
                      id="estudanteProposto"
                      value={this.state.estudanteProposto}
                      options={this.state.estudantesOptions}
                      onChange={(e) =>
                        this.setState({ estudanteProposto: e.value })
                      }
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </form>
        ) : (
          <div className="row"></div>
        )}
      </div>
    );
  }
}
export default withRouter(TemaPropor);
