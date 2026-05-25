import React, { Component } from "react";
import api from "../../axiosConfig";

export class OrientadorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      usuarioLogado: null,
      utlizadoresCadastrados: "",

      projectosEmExecucao: "",
      projectosDoOrientador: [],
      temaEstudante: [],
      projectoEstudante: [],
      temasAguardandoAprovacao: [],
      temasAprovadosPeloCoordenador: [],
      justificativaProjecto: [],
      irregularidadeVerificada: [],

      //Admin
      turmas: [],
      search: "", //campo de pesquisa

      //Coordenador
      isCoordenador: false,
      turmasDoCoordenador: [],
      turmaSelecionada: null,
      temas: [],

      //Orientador
      projectosEmAndamento: [],
      temasAguardandoAprovacaoDoOrientador: [],

      //Conselho Cientifico
      orientadoresOutrasUniversidadesCadastrados: [],

      //Dashboard
      temasReprovados: "",
      temasPropostos: "",

      tarefasNovasMap: {},
    };
  }

  async componentDidMount() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });

      try {
        const projectosDoOrientadorResponse = await api.get(
          `projecto/findAllProjectosDoOrientadorEmAndamento/${
            JSON.parse(usuario).fkUtilizador.pkUtilizador
          }`
        );

        //Se o utilizador logado for coordenador
        const response = await api.get(
          `utilizador/isCoordenador/${
            JSON.parse(usuario).fkUtilizador.pkUtilizador
          }`
        );

        const turmasDoCoordenadorResponse = await api.get(
          `turma/findTurmasDoCoordenador/${
            JSON.parse(usuario).fkUtilizador.pkUtilizador
          }`
        );

        if (
          turmasDoCoordenadorResponse.data &&
          turmasDoCoordenadorResponse.data.length > 0
        ) {
          const temasAguardandoAprovacaoDoCoordenadorResponse = await api.get(
            `tema/findTemaAguardandoAprovacaoByTurma/${turmasDoCoordenadorResponse.data[0].pkTurma}`
          );

          this.setState({
            temas: temasAguardandoAprovacaoDoCoordenadorResponse?.data,
          });
        }

        this.setState({
          isCoordenador: response.data,
          turmasDoCoordenador: turmasDoCoordenadorResponse?.data,
          projectosEmAndamento: projectosDoOrientadorResponse.data,
        });
      } catch (error) {
        console.error("Erro ao verificar:", error);
        return false;
      }
    }
    try {
      const temasAguardandoAprovacaoDoOrientadorResponse = await api.get(
        `tema/findTemaAguardandoAprovacaoDoOrientador/${
          JSON.parse(usuario).email
        }`
      );

      if (temasAguardandoAprovacaoDoOrientadorResponse.data) {
        this.setState({
          temasAguardandoAprovacaoDoOrientador:
            temasAguardandoAprovacaoDoOrientadorResponse.data,
        });
      }

      const tarefasNovasMap = {};
      for (const projecto of this.state.projectosEmAndamento) {
        const tarefasResponse = await api.get(
          `tarefasEntregasEstudante/tarefas/novas/${projecto.pkProjecto}`
        );
        tarefasNovasMap[projecto.pkProjecto] = tarefasResponse.data; // true ou false
      }
      this.setState({
        tarefasNovasMap,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  handleTurmaChange = (event) => {
    const turmaCodigo = event.target.value;
    this.setState({ turmaSelecionada: turmaCodigo });

    // Carregar temas para a turma selecionada
    api
      .get(`tema/findTemaAguardandoAprovacaoByTurma/${turmaCodigo}`)
      .then((response) => {
        this.setState({ temas: response.data });
      })
      .catch((error) => {
        console.error("Erro ao carregar temas:", error);
      });

    console.log("Turma selecionada:", this.state.temas);
  };

  updateGridContent = (turma) => {
    // Suponha que `temas` seja um array de objetos com temas por turma
    const temasFiltrados = this.state.temas.filter(
      (tema) => tema.turmaCodigo === turma
    );
    this.setState({ temas: temasFiltrados });
  };

  handleSubmitAndRedirect = async (index) => {
    const selectedIrregularidadeProjecto =
      this.state.irregularidadeVerificada[index];
    if (selectedIrregularidadeProjecto) {
      try {
        await api.put("irregularidadeProjecto/update", {
          pkIrregularidadeProjecto:
            selectedIrregularidadeProjecto.pkIrregularidadeProjecto,
        });

        // Redireciona para a página do projecto
        this.props.history.push(
          `/projecto-visualizar/${selectedIrregularidadeProjecto.fkProjecto.pkProjecto}`
        );
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
      }
    } else {
      console.error("Erro: O projecto não está definido.");
    }
  };

  render() {
    const { isCoordenador } = this.state;

    return (
      <div>
        {this.state.projectosEmAndamento &&
        Array.isArray(this.state.projectosEmAndamento) &&
        this.state.projectosEmAndamento.length > 0 ? (
          <div>
            <div className="grid">
              <div className="col-12 xl:col-12">
                <div className="surface-card shadow-2 border-round p-4">
                  <div className="flex justify-content-between align-items-center">
                    <div className="text-xl text-900 font-medium">
                      Projectos Em Andamento
                    </div>
                  </div>
                  <div>
                    <div
                      className="py-3 border-bottom-1 surface-border "
                      style={{
                        padding: "15px",
                      }}
                    ></div>
                    {this.state.projectosEmAndamento.map((projecto, index) => (
                      <div className="col-12 p-1" key={index}>
                        <div
                          className="py-3 border-bottom-1 surface-border flex flex-column md:flex-row align-items-center p-3 w-full hover:shadow-2 border-round surface-card transition-all"
                          style={{
                            padding: "15px",
                            cursor: "pointer",
                          }}
                        >
                          <div className="flex-grow-1">
                            <a
                              id="projecto-link"
                              href={`/projecto-visualizar/${projecto.pkProjecto}`}
                              className="text-decoration-none"
                              style={{
                                color: "#333",
                                textDecoration: "none",
                              }}
                            >
                              <div className=" text-xl mb-2">
                                {projecto.fkTema?.titulo}
                                {this.state.tarefasNovasMap[projecto.pkProjecto] && (
              <span style={{ color: "blue", marginLeft: "10px", fontSize: "0.9rem" }}>
                • Nova Entrega
              </span>
            )}
                              </div>
                              <div className="text-secondary mb-2">
                                <span className="mr-2">
                                  <strong>Orientador: </strong>
                                  {projecto.fkOrientador?.nome}
                                </span>
                                <span className="mr-2">
                                  <strong>Estudante: </strong>
                                  {projecto.fkEstudante?.nome}
                                </span>
                                <span className="mr-2">
                                  <strong>Estado: </strong>
                                  {projecto.estado}
                                </span>
                              </div>
                            </a>
                          </div>
                          <div className="ml-3">
                            <button
                              className="p-button p-component p-button-text p-button-rounded"
                              style={{
                                backgroundColor: "transparent",
                                color: "#007bff",
                              }}
                              onClick={() =>
                                (window.location.href = `/projecto-visualizar/${projecto.pkProjecto}`)
                              }
                            >
                              <i
                                className="pi pi-eye"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid">
          <div className="col-12 xl:col-12">
            <div className="surface-card shadow-2 border-round p-5">
              <div className="flex justify-content-between align-items-center mt-4">
                <div className="text-xl text-900 font-medium">
                  Temas Aguardando Aprovação do Orientador
                </div>
              </div>
              {this.state.temasAguardandoAprovacaoDoOrientador &&
              Array.isArray(this.state.temasAguardandoAprovacaoDoOrientador) &&
              this.state.temasAguardandoAprovacaoDoOrientador.length > 0 ? (
                <div>
                  <div
                    className="py-3 border-bottom-1 surface-border "
                    style={{
                      padding: "15px",
                    }}
                  ></div>
                  {this.state.temasAguardandoAprovacaoDoOrientador.map(
                    (tema, index) => (
                      <div className="col-12 p-1" key={index}>
                        <div
                          className="py-3 border-bottom-1 surface-border flex flex-column md:flex-row align-items-center p-3 w-full hover:shadow-2 border-round surface-card transition-all"
                          style={{
                            padding: "15px",
                            cursor: "pointer",
                          }}
                        >
                          <div className="flex-grow-1">
                            <a
                              id="tema-link"
                              href={`/tema-visualizar/${tema.pkTema}`}
                              className="text-decoration-none"
                              style={{
                                color: "#333",
                                textDecoration: "none",
                              }}
                            >
                              <div className=" text-xl mb-2">
                                {tema?.titulo}
                              </div>
                              <div className="text-secondary mb-2">
                                <span className="mr-2">
                                  <strong>Orientador Proposto: </strong>
                                  {tema?.fkOrientadorPropostoEmail}
                                </span>
                                <span className="mr-2">
                                  <strong>Estudante Proposto: </strong>
                                  {tema?.fkEstudanteProposto?.nome}
                                </span>
                                <span className="mr-2">
                                  <strong>Tema Proposto Por: </strong>
                                  {tema?.fkTemaPropostoPor?.nome}
                                </span>
                                <span className="mr-2">
                                  <strong>Estado: </strong>
                                  {tema?.estado}
                                </span>
                              </div>
                            </a>
                          </div>
                          <div className="ml-3">
                            <button
                              className="p-button p-component p-button-text p-button-rounded"
                              style={{
                                backgroundColor: "transparent",
                                color: "#007bff",
                              }}
                              onClick={() =>
                                (window.location.href = `/tema-visualizar/${tema.pkTema}`)
                              }
                            >
                              <i
                                className="pi pi-eye"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div>
                  <br />
                  Não existe temas aguardando aprovação do orientado
                </div>
              )}
            </div>
          </div>
          {isCoordenador ? (
            <div className="col-12 xl:col-12">
              <div className="surface-card shadow-2 border-round p-5">
                <div className="flex justify-content-between align-items-center">
                  <div className="text-xl text-900 font-medium">
                    Temas Aguardando Aprovação do Coordenador
                  </div>
                  {this.state.turmasDoCoordenador &&
                  Array.isArray(this.state.turmasDoCoordenador) &&
                  this.state.turmasDoCoordenador.length > 0 ? (
                    <div className="field col-12 md:col-3">
                      <select
                        id=""
                        className="w-full text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round outline-none focus:border-primary"
                        onChange={this.handleTurmaChange}
                      >
                        {this.state.turmasDoCoordenador.map((turma, index) => (
                          <option key={index} value={turma.pkTurma}>
                            {turma.codigo} - {turma.fkSemestre.designacao} -{" "}
                            {turma.fkAnoLectivo.designacao}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>
                {this.state.temas &&
                Array.isArray(this.state.temas) &&
                this.state.temas.length > 0 ? (
                  <div>
                    <div
                      className="py-3 border-bottom-1 surface-border "
                      style={{
                        padding: "15px",
                      }}
                    ></div>
                    {this.state.temas.map((tema, index) => (
                      <div className="col-12 p-1" key={index}>
                        <div
                          className="py-3 border-bottom-1 surface-border flex flex-column md:flex-row align-items-center p-3 w-full hover:shadow-2 border-round surface-card transition-all"
                          style={{
                            padding: "15px",
                            cursor: "pointer",
                          }}
                        >
                          <div className="flex-grow-1">
                            <a
                              id="tema-link"
                              href={`/tema-visualizar/${tema.pkTema}`}
                              className="text-decoration-none"
                              style={{
                                color: "#333",
                                textDecoration: "none",
                              }}
                            >
                              <div className=" text-xl mb-2">
                                {tema?.titulo}
                              </div>
                              <div className="text-secondary mb-2">
                                <span className="mr-2">
                                  <strong>Orientador Proposto: </strong>
                                  {tema?.fkOrientadorPropostoEmail}
                                </span>
                                <span className="mr-2">
                                  <strong>Estudante Proposto: </strong>
                                  {tema?.fkEstudanteProposto?.nome}
                                </span>
                                <span className="mr-2">
                                  <strong>Tema Proposto Por: </strong>
                                  {tema?.fkTemaPropostoPor?.nome}
                                </span>
                                <span className="mr-2">
                                  <strong>Estado: </strong>
                                  {tema?.estado}
                                </span>
                              </div>
                            </a>
                          </div>
                          <div className="ml-3">
                            <button
                              className="p-button p-component p-button-text p-button-rounded"
                              style={{
                                backgroundColor: "transparent",
                                color: "#007bff",
                              }}
                              onClick={() =>
                                (window.location.href = `/tema-visualizar/${tema.pkTema}`)
                              }
                            >
                              <i
                                className="pi pi-eye"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>Não existem temas aguardando aprovação nessa turma</div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default OrientadorDashboard;
