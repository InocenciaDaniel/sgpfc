import React, { Component } from "react";
import api from "../axiosConfig";
import AdminDashboard from "./perfis/Admin";
import OrientadorDashboard from "./perfis/Orientador";
import FuncionarioDeiDashboard from "./perfis/FuncionarioDei";
import EstudanteDashboard from "./perfis/Estudante";
import ConselhoCientificoDashboard from "./perfis/ConselhoCientifico";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      usuarioLogado: null,
      utlizadoresCadastrados: "",
      numeroOrientadoresCadastrados: "",
      numeroEstudantesCadastrados: "",

      projectosEmExecucao: "",
      projectosDoOrientador: [],
      temaEstudante: [],
      projectoEstudante: [],
      temasAguardandoAprovacao: [],
      justificativaProjecto: [],
      irregularidadeVerificada: [],

      alunosCadastrados: null,

      todosAnosLectivos: [],
      todosProjectos: [],
      todosOrientadores: [],

      //Admin
      turmas: [],
      search: "", //campo de pesquisa

      //Coordenador
      isCoordenador: false,
      turmasDoCoordenador: [],

      //Orientador
      projectosEmAndamento: [],

      //Conselho Cientifico
      orientadoresOutrasUniversidadesCadastrados: [],

      //Dashboard
      temasReprovados: "",
      temasPropostos: "",

      isEstudanteMatriculado: false,
      utilizadorPodeProporTema: false,
    };
  }

  async componentDidMount() {
    const usuario = localStorage.getItem("usuario");

    const todosAnosLectivosResponse = await api.get(`anoLectivo/findAll/`, {
      withCredentials: true,
    });

    const todosProjectosResponse = await api.get(`projecto/findAll/`, {
      withCredentials: true,
    });

    const todosOrientadoresResponse = await api.get(
      `utilizador/findAllOrientador/`,
      {
        withCredentials: true,
      }
    );
    this.setState({
      todosAnosLectivos: todosAnosLectivosResponse.data,
      todosProjectos: todosProjectosResponse.data,
      todosOrientadores: todosOrientadoresResponse.data,
    });
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
    try {
      const projectosDoOrientadorResponse = await api.get(
        `projecto/findAllProjectosDoOrientadorEmAndamento/${
          JSON.parse(usuario).fkUtilizador.pkUtilizador
        }`,
        {
          withCredentials: true,
        }
      );

      const turmasResponse = await api.get(`turma/findAll/`);
      this.setState({
        turmas: turmasResponse.data,
        projectosEmAndamento: projectosDoOrientadorResponse.data,
      });

      const orientadoresOutrasUniversidadesCadastradosResponse = await api.get(
        `orientadorProposto/findAll/`,
        {
          withCredentials: true,
        }
      );
      if (orientadoresOutrasUniversidadesCadastradosResponse.data) {
        this.setState({
          orientadoresOutrasUniversidadesCadastrados:
            orientadoresOutrasUniversidadesCadastradosResponse.data,
        });
      }

      //Estatisticas Dashboard
      const utlizadoresCadastradosResponse = await api.get(
        `utilizador/numeroUtilizadoresCadastrados`,
        {
          withCredentials: true,
        }
      );
      const numeroOrientadoresCadastradosResponse = await api.get(
        `utilizador/numeroOrientadoresCadastrados`,
        {
          withCredentials: true,
        }
      );
      const numeroEstudantesCadastradosResponse = await api.get(
        `utilizador/numeroEstudantesCadastrados`,
        {
          withCredentials: true,
        }
      );
      if (utlizadoresCadastradosResponse.data) {
        this.setState({
          utlizadoresCadastrados: utlizadoresCadastradosResponse.data,
          numeroOrientadoresCadastrados:
            numeroOrientadoresCadastradosResponse.data,
          numeroEstudantesCadastrados: numeroEstudantesCadastradosResponse.data,
        });
      }

      const temasPropostosResponse = await api.get(
        `tema/numeroTemasPropostos`,
        {
          withCredentials: true,
        }
      );
      if (temasPropostosResponse.data) {
        this.setState({ temasPropostos: temasPropostosResponse.data });
      }

      const temasReprovadosResponse = await api.get(
        `tema/numeroTemasReprovados`,
        {
          withCredentials: true,
        }
      );
      if (temasReprovadosResponse.data) {
        this.setState({ temasReprovados: temasReprovadosResponse.data });
      }

      const projectosEmExecucaoResponse = await api.get(
        `projecto/numeroProjectosEmExecucao`,
        {
          withCredentials: true,
        }
      );
      if (projectosEmExecucaoResponse.data) {
        this.setState({
          projectosEmExecucao: projectosEmExecucaoResponse.data,
        });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  render() {
    const {
      usuarioLogado,
      todosAnosLectivos,
      todosProjectos,
      todosOrientadores,
    } = this.state;
    const isOrientador =
      usuarioLogado &&
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Orientador";
    const isEstudante =
      usuarioLogado &&
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Estudante";
    const isFuncionarioDei =
      usuarioLogado &&
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao ===
        "Funcionario DEI";
    const isConselhoCientifico =
      usuarioLogado &&
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao ===
        "Conselho Científico";
    const isAdmin =
      usuarioLogado &&
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "admin";

    const labels = todosAnosLectivos.map((ano) => ano.designacao);
    const labelsOrientadores = todosOrientadores.map(
      (orientador) => orientador.nome
    );

    const aprovadosPorAno = labels.map(
      (label) =>
        todosProjectos.filter(
          (p) =>
            p.fkTurma?.fkAnoLectivo?.designacao === label &&
            p.estado === "Em andamento"
        ).length
    );

    const reprovadosPorAno = labels.map(
      (label) =>
        todosProjectos.filter(
          (p) =>
            p.fkTurma?.fkAnoLectivo?.designacao === label &&
            p.estado === "Reprovado"
        ).length
    );

    const descontinuadosPorAno = labels.map(
      (label) =>
        todosProjectos.filter(
          (p) =>
            p.fkTurma?.fkAnoLectivo?.designacao === label &&
            p.estado === "Desistido"
        ).length
    );

    const concluidosPorAno = labels.map(
      (label) =>
        todosProjectos.filter(
          (p) =>
            p.fkTurma?.fkAnoLectivo?.designacao === label &&
            p.estado === "Concluido"
        ).length
    );

    const dataProjectos = {
      labels,
      datasets: [
        {
          label: "Em andamento",
          data: aprovadosPorAno,
          backgroundColor: "rgba(18, 1, 58, 0.5)",
        },
        {
          label: "Reprovados",
          data: reprovadosPorAno,
          backgroundColor: "rgba(12, 4, 121, 0.5)",
        },
        {
          label: "Descontinuados",
          data: descontinuadosPorAno,
          backgroundColor: "rgba(29, 90, 182)",
        },
        {
          label: "Concluídos",
          data: concluidosPorAno,
          backgroundColor: "rgba(29, 90, 182, 0.5)",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Projetos por Ano Lectivo e Estado" },
      },
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true },
      },
    };

    const projetosPorOrientador = labelsOrientadores.map(
      (nome) =>
        todosProjectos.filter(
          (p) => p.fkOrientador?.nome === nome && p.estado === "Em andamento"
        ).length
    );

    // Gera pares [nome, quantidade]
    const orientadoresComProjetos = labelsOrientadores
      .map((nome, idx) => ({ nome, qtd: projetosPorOrientador[idx] }))
      .filter((item) => item.qtd > 0);

    // Labels e dados filtrados
    const labelsFiltrados = orientadoresComProjetos.map((item) => item.nome);
    const dadosFiltrados = orientadoresComProjetos.map((item) => item.qtd);

    const dataProjetosPorOrientador = {
      labels: labelsFiltrados,
      datasets: [
        {
          label: "Projetos por Orientador",
          data: projetosPorOrientador,
          backgroundColor: [
            "rgba(18, 1, 58, 0.5)",
            "rgba(12, 4, 121, 0.5)",
            "rgba(29, 90, 182, 0.5)",
            "rgba(10, 22, 192, 0.5)",
            "rgba(87, 114, 236, 0.5)",
            "rgba(84, 152, 192, 0.5)",
          ],
        },
      ],
    };

    return (
      <div>
        {usuarioLogado && !isEstudante ? (
          <div className="p-7">
            <div className="grid">
              <div className="col-12 lg:col-6 xl:col-3">
                <div className="surface-card shadow-2 p-3 border-1 border-50 border-round">
                  <div className="flex justify-content-between mb-3">
                    <div>
                      <span className="block text-500 font-medium mb-3">
                        Alunos Cadastrados
                      </span>
                      <div className="text-900 font-medium text-xl">
                        {this.state.numeroEstudantesCadastrados
                          ? this.state.numeroEstudantesCadastrados
                          : "0"}
                      </div>
                    </div>
                    <div
                      className="flex align-items-center justify-content-center bg-blue-100 border-round"
                      style={{ width: "2.5rem", height: "2.5rem" }}
                    >
                      <i className="pi pi-user text-blue-500 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 lg:col-6 xl:col-3">
                <div className="surface-card shadow-2 p-3 border-1 border-50 border-round">
                  <div className="flex justify-content-between mb-3">
                    <div>
                      <span className="block text-500 font-medium mb-3">
                        Orientadores Cadastrados
                      </span>
                      <div className="text-900 font-medium text-xl">
                        {this.state.numeroOrientadoresCadastrados
                          ? this.state.numeroOrientadoresCadastrados
                          : "0"}
                      </div>
                    </div>
                    <div
                      className="flex align-items-center justify-content-center bg-blue-100 border-round"
                      style={{ width: "2.5rem", height: "2.5rem" }}
                    >
                      <i className="pi pi-users text-blue-500 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 lg:col-6 xl:col-3">
                <div className="surface-card shadow-2 p-3 border-1 border-50 border-round">
                  <div className="flex justify-content-between mb-3">
                    <div>
                      <span className="block text-500 font-medium mb-3">
                        Temas Propostos
                      </span>
                      <div className="text-900 font-medium text-xl">
                        {this.state.temasPropostos
                          ? this.state.temasPropostos
                          : "0"}
                      </div>
                    </div>
                    <div
                      className="flex align-items-center justify-content-center bg-blue-100 border-round"
                      style={{ width: "2.5rem", height: "2.5rem" }}
                    >
                      <i className="pi pi-book text-blue-500 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 lg:col-6 xl:col-3">
                <div className="surface-card shadow-2 p-3 border-1 border-50 border-round">
                  <div className="flex justify-content-between mb-3">
                    <div>
                      <span className="block text-500 font-medium mb-3">
                        Projectos em Execução
                      </span>
                      <div className="text-900 font-medium text-xl">
                        {this.state.projectosEmExecucao
                          ? this.state.projectosEmExecucao
                          : "0"}
                      </div>
                    </div>
                    <div
                      className="flex align-items-center justify-content-center bg-blue-100 border-round"
                      style={{ width: "2.5rem", height: "2.5rem" }}
                    >
                      <i className="pi pi-comment text-blue-500 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid">
              <div className="col-6">
                <div className="grid">
                  <div className="col-12">
                    <div className="shadow-2 surface-card border-round p-3">
                      <span
                        className="text-900 font-medium text-xl mb-3"
                        style={{ display: "block", textAlign: "center" }}
                      >
                        Projetos Por Ano Lectivo E Estado
                      </span>
                      <div className="flex align-items-center justify-content-between">
                        <div
                          style={{
                            width: "100%",
                          }}
                        >
                          <Bar data={dataProjectos} options={options} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {dataProjetosPorOrientador.labels.length > 0 && (
                    <div className="col-12">
                      <div className="shadow-2 surface-card border-round p-3">
                        <span
                          className="text-900 font-medium text-xl mb-3"
                          style={{ display: "block", textAlign: "center" }}
                        >
                          Projectos Em Andamento Por Orientador
                        </span>
                        <div className="flex align-items-center justify-content-between">
                          <div
                            style={{
                              width: "100%",
                            }}
                          >
                            <Pie
                              data={dataProjetosPorOrientador}
                              options={options}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-6">
                {isAdmin ? (
                  <AdminDashboard />
                ) : isOrientador ? (
                  <OrientadorDashboard />
                ) : isConselhoCientifico ? (
                  <ConselhoCientificoDashboard />
                ) : isFuncionarioDei ? (
                  <FuncionarioDeiDashboard />
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          // Se o utilizador logado por estudante
          <EstudanteDashboard />
        )}
      </div>
    );
  }
}

export default Dashboard;
