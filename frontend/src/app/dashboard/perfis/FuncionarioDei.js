import React, { Component } from "react";
import api from "../../axiosConfig";
import { Paginator } from "primereact/paginator";

export class FuncionarioDeiDashboard extends Component {
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
      temas: [],

      //Orientador
      projectosEmAndamento: [],
      temasAguardandoAprovacaoDoOrientador: [],

      //Funcionario DEI
      projectosReprovados: [],
      projectosConcluidos: [],

      //Conselho Cientifico
      orientadoresOutrasUniversidadesCadastrados: [],

      //Dashboard
      temasReprovados: "",
      temasPropostos: "",

      isEstudanteMatriculado: false,
      utilizadorPodeProporTema: false,

      firstTemasAguardandoAprovacao: 0,
      rowsTemasAguardandoAprovacao: 3,

      firstProjectosReprovados: 0,
      rowsProjectosReprovados: 3,
    };
  }

  onPageChangeTemasAprovadosPeloCoordenador = (event) => {
    this.setState({
      firstTemasAguardandoAprovacao: event.first,
    });
  };

  onPageChangeProjectosReprovados = (event) => {
    this.setState({
      firstProjectosReprovados: event.first,
    });
  };

  async componentDidMount() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });

      try {
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
        });
      } catch (error) {
        console.error("Erro ao verificar:", error);
        return false;
      }
    }
    try {
      const temasAprovadosPeloCoordenadorResponse = await api.get(
        "tema/findTemaAprovadoPeloCoordenador/"
      );
      if (temasAprovadosPeloCoordenadorResponse.data) {
        this.setState({
          temasAprovadosPeloCoordenador:
            temasAprovadosPeloCoordenadorResponse.data,
        });
      }

      const projectosDoOrientadorResponse = await api.get(
        `projecto/findAllProjectosDoOrientadorEmAndamento/${
          JSON.parse(usuario).fkUtilizador.pkUtilizador
        }`
      );

      const projectoConcluidosSemValidadoFuncionaliroDeiResponse =
        await api.get(
          `projecto/findAllProjectoConcluidosSemValidadoFuncionaliroDei/6`
        );

      const projectoReprovadosSemValidadoFuncionarioDeiResponse = await api.get(
        `projecto/findAllProjectoReprovadosSemValidadoFuncionarioDei`
      );

      const turmasResponse = await api.get(`turma/findAll/`);
      this.setState({
        turmas: turmasResponse.data,
        projectosEmAndamento: projectosDoOrientadorResponse.data,
        projectosConcluidos:
          projectoConcluidosSemValidadoFuncionaliroDeiResponse.data,
        projectosReprovados:
          projectoReprovadosSemValidadoFuncionarioDeiResponse.data,
      });

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

      const orientadoresOutrasUniversidadesCadastradosResponse = await api.get(
        `orientadorProposto/findAll/`
      );
      if (orientadoresOutrasUniversidadesCadastradosResponse.data) {
        this.setState({
          orientadoresOutrasUniversidadesCadastrados:
            orientadoresOutrasUniversidadesCadastradosResponse.data,
        });
      }

      //Estatisticas Dashboard
      const utlizadoresCadastradosResponse = await api.get(
        `utilizador/numeroUtilizadoresCadastrados`
      );
      if (utlizadoresCadastradosResponse.data) {
        this.setState({
          utlizadoresCadastrados: utlizadoresCadastradosResponse.data,
        });
      }

      const temasPropostosResponse = await api.get(`tema/numeroTemasPropostos`);
      if (temasPropostosResponse.data) {
        this.setState({ temasPropostos: temasPropostosResponse.data });
      }

      const temasReprovadosResponse = await api.get(
        `tema/numeroTemasReprovados`
      );
      if (temasReprovadosResponse.data) {
        this.setState({ temasReprovados: temasReprovadosResponse.data });
      }

      const projectosEmExecucaoResponse = await api.get(
        `projecto/numeroProjectosEmExecucao`
      );
      if (projectosEmExecucaoResponse.data) {
        this.setState({
          projectosEmExecucao: projectosEmExecucaoResponse.data,
        });
      }

      const justificativaProjectoResponse = await api.get(
        `justificativaProjecto/findAll/`
      );
      if (justificativaProjectoResponse.data) {
        this.setState({
          justificativaProjecto: justificativaProjectoResponse.data,
        });
      }

      const irregularidadeProjectoResponse = await api.get(
        `irregularidadeProjecto/findByEstado/comunicado`
      );
      if (irregularidadeProjectoResponse.data) {
        this.setState({
          irregularidadeVerificada: irregularidadeProjectoResponse.data,
        });
      }

      const temasAguardandoAprovacaoResponse = await api.get(
        "tema/findTemaAguardandoAprovacao/"
      );
      if (temasAguardandoAprovacaoResponse.data) {
        this.setState({
          temasAguardandoAprovacao: temasAguardandoAprovacaoResponse.data,
        });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

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
    const filteredTemasAprovadosPeloCoordenador =
      this.state.temasAprovadosPeloCoordenador.filter((tema) => {
        const search = this.state.search.toLowerCase();
        return (
          tema.titulo.toLowerCase().includes(search) ||
          tema.estado.toLowerCase().includes(search) ||
          tema.dataTemaProposto.toLowerCase().includes(search) ||
          tema.fkEstudanteProposto.nome.toLowerCase().includes(search) ||
          tema.fkOrientadorPropostoEmail.toLowerCase().includes(search)
        );
      });
    /**Fim Filtros */

    const {
      firstTemasAguardandoAprovacao,
      rowsTemasAguardandoAprovacao,
      firstProjectosReprovados,
      rowsProjectosReprovados,
    } = this.state;
    const temasAguardandoAprovacaoToShow =
      this.state.temasAprovadosPeloCoordenador.slice(
        firstTemasAguardandoAprovacao,
        firstTemasAguardandoAprovacao + rowsTemasAguardandoAprovacao
      );

    const projectosReprovadosToShow = this.state.projectosReprovados.slice(
      firstProjectosReprovados,
      firstProjectosReprovados + rowsProjectosReprovados
    );

    return (
      <div>
        <div className="grid">
          <div className="col-12 xl:col-12">
            <div className="surface-card shadow-2 border-round p-5">
              <div className="flex justify-content-between align-items-center">
                <div className="text-xl text-900 font-medium">
                  Temas Aguardando Aprovação{" "}
                </div>
              </div>
              {temasAguardandoAprovacaoToShow &&
              Array.isArray(temasAguardandoAprovacaoToShow) &&
              temasAguardandoAprovacaoToShow.length > 0 ? (
                <div>
                  {temasAguardandoAprovacaoToShow &&
                  temasAguardandoAprovacaoToShow.length > 0 ? (
                    <div>
                      <div
                        className="py-3 border-bottom-1 surface-border "
                        style={{
                          padding: "15px",
                        }}
                      ></div>
                      {temasAguardandoAprovacaoToShow.map((tema, index) => (
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
                    <div>Nenhuma turma encontrada</div>
                  )}
                </div>
              ) : (
                <div>
                  <br />
                  Não existe temas aguardando aprovação
                </div>
              )}
            </div>

            <Paginator
              first={firstTemasAguardandoAprovacao}
              rows={rowsTemasAguardandoAprovacao}
              totalRecords={this.state.temasAprovadosPeloCoordenador.length}
              onPageChange={this.onPageChangeTemasAprovadosPeloCoordenador}
              className="p-mt-4"
            />
          </div>
        </div>

        <div className="grid">
          <div className="col-12 xl:col-12">
            <div className="surface-card shadow-2 border-round p-5">
              <div className="flex justify-content-between align-items-center">
                <div className="text-xl text-900 font-medium">
                  Projectos Reprovados
                </div>
              </div>
              {this.state.projectosReprovados &&
              Array.isArray(this.state.projectosReprovados) &&
              this.state.projectosReprovados.length > 0 ? (
                <div>
                  {this.state.projectosReprovados &&
                  this.state.projectosReprovados.length > 0 ? (
                    <div>
                      <div
                        className="py-3 border-bottom-1 surface-border "
                        style={{
                          padding: "15px",
                        }}
                      ></div>
                      {projectosReprovadosToShow.map((projecto, index) => (
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
                                href={`/projecto-visualizar/${projecto.pkProjecto}`}
                                className="text-decoration-none"
                                style={{
                                  color: "#333",
                                  textDecoration: "none",
                                }}
                              >
                                <div className=" text-xl mb-2">
                                  {projecto.fkTema?.titulo}
                                </div>
                                <div className="text-secondary mb-2">
                                  <span className="mr-2">
                                    <strong>Orientador Proposto: </strong>
                                    {projecto.fkTema?.fkOrientadorPropostoEmail}
                                  </span>
                                  <span className="mr-2">
                                    <strong>Estudante Proposto: </strong>
                                    {projecto.fkTema?.fkEstudanteProposto?.nome}
                                  </span>
                                  <span className="mr-2">
                                    <strong>Tema Proposto Por: </strong>
                                    {projecto.fkTema?.fkTemaPropostoPor?.nome}
                                  </span>
                                  <span className="mr-2">
                                    <strong>Estado: </strong>
                                    {projecto.fkTema?.estado}
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
                  ) : (
                    <div>Nenhuma turma encontrada</div>
                  )}
                </div>
              ) : (
                <div>
                  <br />
                  Não existe temas aguardando aprovação
                </div>
              )}
            </div>

            <Paginator
              first={firstProjectosReprovados}
              rows={rowsProjectosReprovados}
              totalRecords={this.state.projectosReprovados.length}
              onPageChange={this.onPageChangeProjectosReprovados}
              className="p-mt-4"
            />
          </div>
        </div>

        <div className="grid">
          <div className="col-12 xl:col-12">
            <div className="surface-card shadow-2 border-round p-5">
              <div className="flex justify-content-between align-items-center">
                <div className="text-xl text-900 font-medium">
                  Projectos Concluidos
                </div>
              </div>
              {this.state.projectosConcluidos &&
              Array.isArray(this.state.projectosConcluidos) &&
              this.state.projectosConcluidos.length > 0 ? (
                <div>
                  {this.state.projectosConcluidos &&
                  this.state.projectosConcluidos.length > 0 ? (
                    <div>
                      <div
                        className="py-3 border-bottom-1 surface-border "
                        style={{
                          padding: "15px",
                        }}
                      ></div>
                      {this.state.projectosConcluidos.map((projecto, index) => (
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
                                href={`/projecto-visualizar/${projecto.pkProjecto}`}
                                className="text-decoration-none"
                                style={{
                                  color: "#333",
                                  textDecoration: "none",
                                }}
                              >
                                <div className=" text-xl mb-2">
                                  {projecto.fkTema?.titulo}
                                </div>
                                <div className="text-secondary mb-2">
                                  <span className="mr-2">
                                    <strong>Orientador Proposto: </strong>
                                    {projecto.fkTema?.fkOrientadorPropostoEmail}
                                  </span>
                                  <span className="mr-2">
                                    <strong>Estudante Proposto: </strong>
                                    {projecto.fkTema?.fkEstudanteProposto?.nome}
                                  </span>
                                  <span className="mr-2">
                                    <strong>Tema Proposto Por: </strong>
                                    {projecto.fkTema?.fkTemaPropostoPor?.nome}
                                  </span>
                                  <span className="mr-2">
                                    <strong>Estado: </strong>
                                    {projecto.fkTema?.estado}
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
                  ) : (
                    <div>Nenhuma turma encontrada</div>
                  )}
                </div>
              ) : (
                <div>
                  <br />
                  Não existe temas aguardando aprovação
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FuncionarioDeiDashboard;
