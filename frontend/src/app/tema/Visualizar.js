import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import api from "../axiosConfig";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import AprovarReprovarBotoes from "./Componentes/AprovarReprovarBotoes";

class TemaVisualizar extends Component {
  state = {
    usuarioLogado: null,
    tema: null,
    loading: true,
    error: null,
    pkTema: "",
    temaPropostoPor: "",
    linhaPesquisaOptions: [],
    orientadoresOptions: [],
    localRealizacaoOptions: [],
    areaConhecimentoOptions: [],
    linhaPesquisa: null,
    orientadorProposto: null,
    localRealizacao: null,
    areaConhecimento: null,

    isCoordenador: false,
    isCoordenadorDaTurmaDoEstudante: null,
    fkTurmaEstudanteMatriculado: null,
    turmaEstudanteMatriculado: null,
    estudanteProposto: null,
    estudantePropostoNome: null,

    estudantesPropostoOptions: [],
    turmasDoCoordenador: [],
    selectedTurma: null,

    orientadorValido: false,
    alterarOrientador: false,
    novoOrientador: null,

    temaHistoricoAprovacao: [],
    toast: null,
  };

  async componentDidMount() {
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

      const localRealizacaoResponse = await api.get("localRealizacao/findAll");
      const localRealizacaoOptions = localRealizacaoResponse.data.map((l) => ({
        label: l.designacao,
        value: l.pkLocalRealizacao,
      }));

      const areaConhecimentoResponse = await api.get(
        "areaConhecimento/findAll"
      );
      const areaConhecimentoOptions = areaConhecimentoResponse.data.map(
        (a) => ({ label: a.designacao, value: a.pkAreaConhecimento })
      );

      const { id } = this.props.match.params;
      const temaResponse = await api.get(`tema/${id}`);

      const response = await api.get(
        `conta/findByEmail/${temaResponse.data.fkOrientadorPropostoEmail}`
      );
      if (response.data) {
        this.setState({
          orientadorProposto: {
            label: response.data.fkUtilizador.nome,
            value: response.data.fkUtilizador.pkUtilizador,
          },
          orientadorValido: true,
        });
      } else {
        const response = await api.get(
          `orientadorProposto/findByEmail/${temaResponse.data.fkOrientadorPropostoEmail}`
        );
        this.setState({
          orientadorProposto: { label: response.data.nome, value: -1 },
          orientadorValido: false,
        });
      }

      const temaHistoricoAprovacaoResponse = await api.get(
        `temaHistoricoAprovacao/findByPkTema/${temaResponse.data.pkTema}`
      );

      if (temaResponse.data.fkEstudanteProposto !== null) {
        const fkTurmaEstudanteMatriculadoResponse = await api.get(
          `turma/findTurmaByEstudante/${temaResponse.data.fkEstudanteProposto.pkUtilizador}`
        );

        this.setState({
          fkTurmaEstudanteMatriculado: fkTurmaEstudanteMatriculadoResponse.data
            ? fkTurmaEstudanteMatriculadoResponse.data.pkTurma
            : null,
          turmaEstudanteMatriculado: fkTurmaEstudanteMatriculadoResponse.data
            ? fkTurmaEstudanteMatriculadoResponse.data
            : null,
        });
      }

      this.setState({
        tema: temaResponse.data,
        temaPropostoPor: temaResponse.data.fkTemaPropostoPor.pkUtilizador,
        pkTema: temaResponse.data.pkTema,
        linhaPesquisaOptions,
        orientadoresOptions,
        localRealizacaoOptions,
        areaConhecimentoOptions,
        linhaPesquisa: temaResponse.data.fkLinhaPesquisa.pkLinhaPesquisa,
        areaConhecimento: temaResponse.data.fkAreaConhecimento
          ? temaResponse.data.fkAreaConhecimento.pkAreaConhecimento
          : "",
        localRealizacao: temaResponse.data.fkLocalRealizacao
          ? temaResponse.data.fkLocalRealizacao.pkLocalRealizacao
          : "",
        estudantePropostoNome: temaResponse.data.fkEstudanteProposto
          ? temaResponse.data.fkEstudanteProposto?.nome
          : null,
        estudanteProposto: temaResponse.data.fkEstudanteProposto
          ? temaResponse.data.fkEstudanteProposto?.pkUtilizador
          : null,
        estadoTema: temaResponse.data.estado,
        temaHistoricoAprovacao: temaHistoricoAprovacaoResponse.data,
      });
    } catch (error) {
      this.setState({ error, loading: false });
    }

    const usuario = localStorage.getItem("usuario");

    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });

      if (
        this.state.usuarioLogado.fkUtilizador.fkTipoConta.designacao ===
          "Estudante" &&
        this.state.tema?.fkEstudanteProposto.pkUtilizador !==
          this.state.usuarioLogado.fkUtilizador.pkUtilizador
      ) {
        this.props.history.push("/unauthorized");
      }

      try {
        const response = await api.get(
          `utilizador/isCoordenador/${
            JSON.parse(usuario).fkUtilizador.pkUtilizador
          }`
        );
        this.setState({ isCoordenador: response.data });

        if (
          this.state.isCoordenador &&
          this.state.fkTurmaEstudanteMatriculado
        ) {
          const response = await api.get(
            `turma/isCoordenadorDaTurma/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }/${this.state.fkTurmaEstudanteMatriculado}`
          );
          this.setState({ isCoordenadorDaTurmaDoEstudante: response.data });

          const estudantesPropostoResponse = await api.get(
            `utilizador/findAllEstudantesMatriculadosNumaTurma/${this.state.fkTurmaEstudanteMatriculado}`
          );
          const estudantesPropostoOptions = estudantesPropostoResponse.data.map(
            (e) => ({ label: e.nome, value: e.pkUtilizador })
          );

          this.setState({
            estudantesPropostoOptions,
          });
        } else if (this.state.isCoordenador) {
          const turmasDoCoordenadorResponse = await api.get(
            `turma/findTurmasDoCoordenador/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }`
          );
          const turmasDoCoordenador = turmasDoCoordenadorResponse.data.map(
            (turma) => ({
              label: turma.codigo,
              value: turma.pkTurma,
            })
          );
          this.setState({
            turmasDoCoordenador,
          });
        } else {
          const estudantesPropostoResponse = await api.get(
            `utilizador/findAllEstudanteMatriculadoSemTema`
          );
          const estudantesPropostoOptions = estudantesPropostoResponse.data.map(
            (e) => ({ label: e.nome, value: e.pkUtilizador })
          );

          this.setState({
            estudantesPropostoOptions,
          });
        }
      } catch (error) {
        //console.error("Erro ao verificar se é coordenador:", error);
        return false;
      }
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleLinhaPesquisaChange = (e) => {
    this.setState({ linhaPesquisa: e.value });
  };

  handlelocalRealizacaoChange = (e) => {
    this.setState({ localRealizacao: e.value });
  };

  handleAreaConhecimentoChange = (e) => {
    this.setState({ areaConhecimento: e.value });
  };

  handleTurmaChange = async (event) => {
    const selectedTurma = event.target.value;
    this.setState({ selectedTurma });

    const estudantesPropostoResponse = await api.get(
      `utilizador/findEstudantesMatriculadosSemTemaNaTurma/${selectedTurma}`
    );
    const estudantesPropostoOptions = estudantesPropostoResponse.data.map(
      (e) => ({ label: e.nome, value: e.pkUtilizador })
    );
    this.setState({ estudantesPropostoOptions });
  };

  handleEstudanteChange = (event) => {
    this.setState({ estudanteProposto: event.value });
  };

  toggleEditMode = () => {
    this.setState({ alterarOrientador: !this.state.alterarOrientador });
  };

  handleDropdownChange = (e) => {
    const orientadorSelecionado = this.state.orientadoresOptions.find(
      (o) => o.value === e.value
    );
    this.setState({ novoOrientador: orientadorSelecionado }, () => {});
  };

  confirmarAlterarOrientador = async () => {
    if (this.state.novoOrientador) {
      console.log(this.state.novoOrientador);

      try {
        const response = await api.get(
          `conta/findByFkUtilizador/${this.state.novoOrientador.value}`
        );

        await api.put("tema/alterar/orientador", {
          orientadorPropostoEmail: response.data.email,
          pkTema: this.state.tema.pkTema,
        });

        this.setState(
          {
            orientadorProposto: this.state.novoOrientador,
            alterarOrientador: false,
            novoOrientador: null,
          },

          () => {}
        );

        this.toast.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Orientador alterado com sucesso!",
          life: 5000,
        });
      } catch (error) {
        this.toast.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao alterar orientador:",
          life: 5000,
        });
      }
    }
  };

  aprovar = async () => {
    const {
      orientadorProposto,
      usuarioLogado,
      isCoordenador,
      pkTema,
      linhaPesquisa,
      localRealizacao,
      estadoTema,
      areaConhecimento,
      orientadorValido,
    } = this.state;
    const isOrientador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador";
    const isFuncionarioDei =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Funcionario DEI";

    if (!this.state.estudanteProposto) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail:
          "Erro! Não pode aprovar esse tema porque não tem um estudante proposto selecionado.",
        life: 5000,
      });
      this.setState({
        error:
          "Erro! Não pode aprovar esse tema porque não tem um estudante proposto selecionado.",
      });
      return;
    }

    if (orientadorValido) {
      const response = await api.get(
        `conta/findByFkUtilizador/${this.state.orientadorProposto.value}`
      );

      if (isOrientador && !isCoordenador) {
        if (this.state.estadoTema === "aguardando aprovacao") {
          if (
            orientadorProposto.value ===
              usuarioLogado.fkUtilizador.pkUtilizador &&
            this.state.temaPropostoPor !==
              usuarioLogado.fkUtilizador.pkUtilizador
          ) {
            await api.put("tema/update", {
              pkTema,
              estado: "aprovado pelo orientador",
              linhaPesquisa,
              orientadorPropostoEmail: response.data.email,
              areaConhecimento,
              localRealizacao,
            });

            await api.post("temaHistoricoAprovacao/save", {
              fkTema: pkTema,
              estadoAnterior: this.state.tema.estado,
              estadoActual: "aprovado pelo orientador",
              fkAprovadoPor: usuarioLogado.fkUtilizador.pkUtilizador,
            });
          }
        }
        this.props.history.push("/tema-index");
      } else if (
        isFuncionarioDei &&
        estadoTema === "aprovado pelo coordenador"
      ) {
        await api.put("tema/update", {
          pkTema,
          estado: "aprovado",
          linhaPesquisa,
          orientadorPropostoEmail: response.data.email,
          areaConhecimento,
          localRealizacao,
        });

        await api.post("temaHistoricoAprovacao/save", {
          fkTema: pkTema,
          estadoAnterior: this.state.tema.estado,
          estadoActual: "aprovado",
          fkAprovadoPor: usuarioLogado.fkUtilizador.pkUtilizador,
        });

        await api.post("projecto/save", {
          fkTema: pkTema,
          fkEstudante: this.state.estudanteProposto,
          fkOrientador: this.state.orientadorProposto.value,
        });
        this.props.history.push("/projecto-index");
      } else if (isCoordenador) {
        let podeAprovar = false;
        if (
          estadoTema === "aguardando aprovacao" ||
          estadoTema === "aprovado pelo orientador"
        ) {
          if (
            orientadorProposto.value ===
              usuarioLogado.fkUtilizador.pkUtilizador &&
            this.state.temaPropostoPor !==
              usuarioLogado.fkUtilizador.pkUtilizador
          ) {
            podeAprovar = true;
          } else if (this.state.isCoordenadorDaTurmaDoEstudante) {
            podeAprovar = true;
          }
        }
        if (podeAprovar) {
          await api.put("tema/update", {
            pkTema,
            estado: "aprovado pelo coordenador",
            linhaPesquisa,
            orientadorPropostoEmail: response.data.email,
            areaConhecimento,
            localRealizacao,
          });

          await api.post("temaHistoricoAprovacao/save", {
            fkTema: pkTema,
            estadoAnterior: this.state.tema.estado,
            estadoActual: "aprovado pelo coordenador",
            fkAprovadoPor: usuarioLogado.fkUtilizador.pkUtilizador,
          });
        }
        this.props.history.push("/tema-index");
      }
    } else {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail:
          "Erro! Não pode aprovar esse tema porque o orientador proposto não foi aprovado ainda.",
        life: 5000,
      });
      return;
    }
  };

  reprovar = async () => {
    const {
      orientadorProposto,
      usuarioLogado,
      isCoordenador,
      pkTema,
      linhaPesquisa,
      localRealizacao,
      estadoTema,
      areaConhecimento,
      orientadorValido,
    } = this.state;
    const isOrientador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador";
    const isFuncionarioDei =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Funcionario DEI";
    const response = await api.get(
      `conta/findByFkUtilizador/${this.state.orientadorProposto.value}`
    );

    let emailOrientador = null;
    if (orientadorValido) {
      emailOrientador = response.data.email;
    } else {
      const response = await api.get(
        `orientadorProposto/findByEmail/${this.state.tema.fkOrientadorPropostoEmail}`
      );
      emailOrientador = response.data.email;
    }
    if (isOrientador && !isCoordenador) {
      if (this.state.estadoTema === "aguardando aprovacao") {
        if (
          orientadorProposto.value ===
            usuarioLogado.fkUtilizador.pkUtilizador &&
          this.state.temaPropostoPor !== usuarioLogado.fkUtilizador.pkUtilizador
        ) {
          await api.put("tema/update", {
            pkTema,
            estado: "reprovado",
            linhaPesquisa,
            orientadorPropostoEmail: emailOrientador,
            areaConhecimento,
            localRealizacao,
          });

          await api.post("temaHistoricoAprovacao/save", {
            fkTema: pkTema,
            estadoAnterior: this.state.tema.estado,
            estadoActual: "reprovado",
            fkAprovadoPor: usuarioLogado.fkUtilizador.pkUtilizador,
          });
        }
      }
    } else if (isFuncionarioDei && estadoTema === "aprovado pelo coordenador") {
      await api.put("tema/update", {
        pkTema,
        estado: "reprovado",
        linhaPesquisa,
        orientadorPropostoEmail: emailOrientador,
        areaConhecimento,
        localRealizacao,
      });

      await api.post("temaHistoricoAprovacao/save", {
        fkTema: pkTema,
        estadoAnterior: this.state.tema.estado,
        estadoActual: "reprovado",
        fkAprovadoPor: usuarioLogado.fkUtilizador.pkUtilizador,
      });
    } else if (isCoordenador) {
      if (
        estadoTema === "aguardando aprovacao" ||
        estadoTema === "aprovado pelo orientador"
      ) {
        await api.put("tema/update", {
          pkTema,
          estado: "reprovado",
          linhaPesquisa,
          orientadorPropostoEmail: emailOrientador,
          areaConhecimento,
          localRealizacao,
        });

        await api.post("temaHistoricoAprovacao/save", {
          fkTema: pkTema,
          estadoAnterior: this.state.tema.estado,
          estadoActual: "reprovado",
          fkAprovadoPor: usuarioLogado.fkUtilizador.pkUtilizador,
        });
      }
    }
    this.props.history.push("/tema-index");
  };

  render() {
    const {
      usuarioLogado,
      error,
      isCoordenador,
      tema,
      linhaPesquisaOptions,
      linhaPesquisa,
      orientadorProposto,
      localRealizacaoOptions,
      areaConhecimentoOptions,
      localRealizacao,
      areaConhecimento,
    } = this.state;

    const isOrientador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador";
    const isEstudante =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Estudante";
    const isFuncionarioDei =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Funcionario DEI";

    return (
      <div>
        {usuarioLogado ? (
          <div className="p-7">
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/tema-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Temas
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">Mais Detalhes</span>
                </li>
                {tema.fkTemaPropostoPor.pkUtilizador ===
                  usuarioLogado.fkUtilizador.pkUtilizador &&
                this.state.estadoTema === "aguardando aprovacao" ? (
                  <li className="ml-auto">
                    <a
                      href={`/tema-editar/${this.state.pkTema}`}
                      onClick={(e) => this.onEditClick(e)}
                      style={{
                        marginTop: "0.5rem",
                        textDecoration: "none",
                        color: "#123456",
                      }}
                    >
                      Editar
                    </a>

                    <a
                      href={`/tema-editar/${this.state.pkTema}`}
                      //onClick={(e) => this.onEditClick(e)}
                      style={{
                        marginLeft: "1rem",
                        marginTop: "0.5rem",
                        textDecoration: "none",
                        color: "#ff0000",
                      }}
                    >
                      Eliminar
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                <div className="surface-section">
                  {error && (
                    <div className="alert alert-danger">
                      <Message
                        style={{
                          border: "solid #832226",
                          borderWidth: "0 0 0 6px",
                          color: "#832226",
                        }}
                        c
                        className="border-danger w-full justify-content-start"
                        severity="error"
                        content={error}
                      />
                    </div>
                  )}
                  <br />
                  <div className="grid">
                    <div className="col-10">
                      <div className="font-medium text-3xl text-900 mb-3">
                        {tema.titulo}
                      </div>
                    </div>

                    <div className="col-2">
                      <div className="text-right">
                        <Badge
                          value={
                            tema.estado.charAt(0).toUpperCase() +
                            tema.estado.slice(1)
                          }
                          style={{ background: "#95a5a6" }}
                        ></Badge>
                      </div>
                    </div>
                  </div>

                  <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Descrição
                      </div>
                      <div
                        className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"
                        style={{ textAlign: "justify" }}
                      >
                        {tema.descricao}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Justificativa
                      </div>
                      <div
                        className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"
                        style={{ textAlign: "justify" }}
                      >
                        {tema.justificativa}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div
                        className="text-500 w-6 md:w-2 font-medium"
                        style={{ textAlign: "justify" }}
                      >
                        Diferencial
                      </div>
                      <div
                        className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"
                        style={{ textAlign: "justify" }}
                      >
                        {tema.diferencial}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div
                        className="text-500 w-6 md:w-2 font-medium"
                        style={{ textAlign: "justify" }}
                      >
                        Observações
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tema.observacoes}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Proposto Por
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tema.fkTemaPropostoPor.nome}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Data Tema Proposto
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tema.dataTemaProposto}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Proposta de estudante para realizar o projecto
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {this.state.estudantePropostoNome !== null ? (
                          <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {this.state.estudantePropostoNome}
                          </div>
                        ) : (
                          <div>
                            {isCoordenador ? (
                              <div>
                                <Dropdown
                                  value={this.state.selectedTurma}
                                  options={this.state.turmasDoCoordenador}
                                  onChange={this.handleTurmaChange}
                                  className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                />
                                <br />
                                {this.state.selectedTurma && (
                                  <div>
                                    <Dropdown
                                      value={this.state.estudanteProposto}
                                      options={
                                        this.state.estudantesPropostoOptions
                                      }
                                      onChange={this.handleEstudanteChange}
                                      placeholder="Selecione um estudante"
                                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                    />
                                  </div>
                                )}
                              </div>
                            ) : null}
                            {isOrientador && !isCoordenador ? (
                              <Dropdown
                                disabled={isEstudante}
                                id="estudanteProposto"
                                value={this.state.estudanteProposto}
                                options={this.state.estudantesPropostoOptions}
                                onChange={(e) =>
                                  this.setState({
                                    estudanteProposto: e.target.value,
                                  })
                                }
                                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Orientador Proposto
                      </div>
                      <div className="grid text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <div className="col-10">
                          {this.state.alterarOrientador ? (
                            <Dropdown
                              value={
                                this.state.novoOrientador
                                  ? this.state.novoOrientador.value
                                  : null
                              }
                              options={this.state.orientadoresOptions}
                              onChange={this.handleDropdownChange}
                              placeholder="Selecione um novo orientador"
                              className="w-full"
                            />
                          ) : (
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                              {this.state.orientadorProposto
                                ? this.state.orientadorProposto.label
                                : "Nenhum orientador selecionado"}
                            </div>
                          )}
                        </div>
                        <div
                          className="col-2"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {this.state.alterarOrientador ? (
                            <Button
                              label="Salvar"
                              className="p-button-outlined"
                              onClick={this.confirmarAlterarOrientador}
                            />
                          ) : (
                            <Button
                              label="Alterar"
                              disabled={!isCoordenador}
                              className="p-button-outlined"
                              onClick={this.toggleEditMode}
                            />
                          )}
                        </div>
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Linha de Pesquisa
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <Dropdown
                          disabled={isEstudante || isFuncionarioDei}
                          id="linhaPesquisa"
                          value={linhaPesquisa}
                          options={linhaPesquisaOptions}
                          onChange={this.handleLinhaPesquisaChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Local de Realizacao
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <Dropdown
                          disabled={isEstudante || isFuncionarioDei}
                          id="localRealizacao"
                          value={localRealizacao}
                          options={localRealizacaoOptions}
                          onChange={this.handlelocalRealizacaoChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Area de Conhecimento
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <Dropdown
                          disabled={isEstudante || isFuncionarioDei}
                          id="areaConhecimento"
                          value={areaConhecimento}
                          options={areaConhecimentoOptions}
                          onChange={this.handleAreaConhecimentoChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                    </li>
                    {this.state.temaHistoricoAprovacao &&
                    Array.isArray(this.state.temaHistoricoAprovacao) &&
                    this.state.temaHistoricoAprovacao.length > 0 ? (
                      <div>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                          <div className="text-500 w-6 md:w-2 font-medium">
                            Histórico de Aprovacções
                          </div>
                          <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {this.state.temaHistoricoAprovacao.map(
                              (temaHistorico, index) => (
                                <div>
                                  <div
                                    key={index}
                                    className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"
                                  >
                                    <b>
                                      {temaHistorico.estadoActual ===
                                      "reprovado"
                                        ? "Reprovado"
                                        : "Aprovado"}{" "}
                                      Por:
                                    </b>{" "}
                                    {temaHistorico.fkAprovadoPor.nome} <br />{" "}
                                    <b>Data</b> {temaHistorico.dataAprovacao}
                                  </div>
                                  <br />
                                </div>
                              )
                            )}
                          </div>
                        </li>
                      </div>
                    ) : null}

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap"></li>
                  </ul>
                  {this.state.estadoTema === "aguardando aprovacao" ? (
                    <div>
                      {isCoordenador ? (
                        <div>
                          {this.state.isCoordenadorDaTurmaDoEstudante ||
                          this.state.estudantePropostoNome === null ? (
                            <div>
                              <AprovarReprovarBotoes
                                onAprovar={this.aprovar}
                                onReprovar={this.reprovar}
                              />
                            </div>
                          ) : (
                            <div>
                              {orientadorProposto.value ===
                              usuarioLogado.fkUtilizador.pkUtilizador ? (
                                <div>
                                  <AprovarReprovarBotoes
                                    onAprovar={this.aprovar}
                                    onReprovar={this.reprovar}
                                  />
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {isOrientador ? (
                            <div>
                              {orientadorProposto.value ===
                                usuarioLogado.fkUtilizador.pkUtilizador &&
                              tema.fkTemaPropostoPor.pkUtilizador !==
                                usuarioLogado.fkUtilizador.pkUtilizador ? (
                                <div>
                                  <AprovarReprovarBotoes
                                    onAprovar={this.aprovar}
                                    onReprovar={this.reprovar}
                                  />
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {this.state.estadoTema === "aprovado pelo orientador" ? (
                        <div>
                          {isCoordenador ? (
                            <div>
                              {this.state.isCoordenadorDaTurmaDoEstudante ||
                              this.state.estudantePropostoNome === null ? (
                                <div>
                                  <AprovarReprovarBotoes
                                    onAprovar={this.aprovar}
                                    onReprovar={this.reprovar}
                                  />
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div>
                          {this.state.estadoTema ===
                          "aprovado pelo coordenador" ? (
                            <div>
                              {isFuncionarioDei ? (
                                <div>
                                  <AprovarReprovarBotoes
                                    onAprovar={this.aprovar}
                                    onReprovar={this.reprovar}
                                  />
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <br />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default withRouter(TemaVisualizar);
