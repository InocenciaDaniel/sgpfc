import React, { Component } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Link, withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import api from "../axiosConfig";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

class TemaEditar extends Component {
  state = {
    usuarioLogado: null,
    pkTema: "",
    tema: null,
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

      this.setState({});

      const { id } = this.props.match.params;
      const temaResponse = await api.get(`tema/${id}`);

      this.setState({
        tema: temaResponse.data,
        pkTema: temaResponse.data.pkTema,
        titulo: temaResponse.data.titulo,
        descricao: temaResponse.data.descricao,
        diferencial: temaResponse.data.diferencial,
        justificativa: temaResponse.data.justificativa,
        observacoes: temaResponse.data.observacoes,
        temaPropostoPor: temaResponse.data.fkTemaPropostoPor?.pkUtilizador,
        temaPropostoPorNome: temaResponse.data.fkTemaPropostoPor.nome,
        dataTemaProposto: temaResponse.data.dataTemaProposto,
        estadoTema: temaResponse.data.estado,
        linhaPesquisa: temaResponse.data.fkLinhaPesquisa.pkLinhaPesquisa,
        areaConhecimento: temaResponse.data.fkAreaConhecimento
          ? temaResponse.data.fkAreaConhecimento.pkAreaConhecimento
          : "",
        localRealizacao: temaResponse.data.fkLocalRealizacao
          ? temaResponse.data.fkLocalRealizacao.pkLocalRealizacao
          : "",
        linhaPesquisaOptions,
        orientadoresOptions,
        localRealizacaoOptions,
        areaConhecimentoOptions,
        universidadeOptions,
        sexoOptions,
        estudantesOptions,
        estudantePropostoNome: temaResponse.data.fkEstudanteProposto
          ? temaResponse.data.fkEstudanteProposto.nome
          : null,
        fkTurmaEstudanteMatriculado: temaResponse.data.fkEstudanteProposto
          ? temaResponse.data.fkEstudanteProposto?.fkTurmaEstudanteMatriculado
              ?.pkTurma
          : null,
      });
      if (temaResponse.data.fkOrientadorPropostoEmail) {
        const response = await api.get(
          `conta/findByEmail/${temaResponse.data.fkOrientadorPropostoEmail}`
        );
        if (response.data) {
          this.setState({
            orientadorProposto: response.data.fkUtilizador.pkUtilizador,
          });
        }
      }
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
      pkTema,
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

      await api.put("tema/update/tema", {
        pkTema,
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
    } = this.state;

    if (
      !nome ||
      !email ||
      !telefone ||
      !sexo ||
      !grauAcademicoOrientador ||
      !universidade
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
      const utilizadorResponse = await api.post(
        "orientadorProposto/save",
        novo
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
                  <span className="text-900 line-height-3">Editar Tema</span>
                </li>
                <li className="ml-auto">
                  <Button
                    type="submit"
                    label="Salvar Alterações"
                    className="p-button-outlined mr-2"
                  />
                </li>
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                  <div className="flex align-items-center text-700 flex-wrap">
                    <div className="mr-5 flex align-items-center mt-3"></div>
                  </div>
                </div>
                <div className="mt-3 lg:mt-0"></div>
              </div>
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
                    value={this.state.titulo}
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
                      value={this.state.descricao}
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
                      value={this.state.justificativa}
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
                      value={this.state.diferencial}
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
                      value={this.state.observacoes}
                      type="text"
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
                    <label htmlFor="orientadorProposto">
                      Orientador Proposto
                    </label>
                    <Dropdown
                      required
                      id="orientadorProposto"
                      value={orientadorProposto}
                      options={orientadoresOptions}
                      onChange={this.handleOrientadorPropostoChange}
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
                        backgroundColor: "#f0f0f0",
                        padding: "1rem",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div class="grid">
                        <div class="col-4">
                          <div class="field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="nome">Nome Completo</label>
                            <InputText
                              id="nome"
                              name="nome"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({ nome: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="email">Email</label>
                            <InputText
                              id="email"
                              name="email"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({ email: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="telefone">Telefone</label>
                            <InputText
                              id="telefone"
                              name="telefone"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({ telefone: e.target.value })
                              }
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
                              <div
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  padding: "1rem",
                                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                                  borderRadius: "0.5rem",
                                }}
                              >
                                <div class="grid">
                                  <div class="col-6">
                                    <div
                                      class="field"
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      <label htmlFor="novaUniversidadeSigla">
                                        Sigla
                                      </label>
                                      <InputText
                                        id="novaUniversidadeSigla"
                                        type="text"
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          borderRadius: "0.25rem",
                                          border:
                                            "1px solid var(--border-color)",
                                        }}
                                        onChange={(e) =>
                                          this.setState({
                                            novaUniversidadeSigla:
                                              e.target.value,
                                          })
                                        }
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
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          borderRadius: "0.25rem",
                                          border:
                                            "1px solid var(--border-color)",
                                        }}
                                        onChange={(e) =>
                                          this.setState({
                                            novaUniversidadeDesignacao:
                                              e.target.value,
                                          })
                                        }
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
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          borderRadius: "0.25rem",
                                          border:
                                            "1px solid var(--border-color)",
                                        }}
                                        onChange={(e) =>
                                          this.setState({
                                            novaUniversidadeDescricao:
                                              e.target.value,
                                          })
                                        }
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
export default withRouter(TemaEditar);
