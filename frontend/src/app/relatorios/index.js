import React, { Component } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Bar } from "react-chartjs-2";
import api from "../axiosConfig";

export class ProjectoIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabelasPrincipaisOptions: [
        { label: "Tema", value: "temas" },
        { label: "Projectos", value: "projectos" },
      ],
      tabelasPrincipais: null,

      tipoFiltroOptions: [
        { label: "Estado", value: "estado" },
        { label: "Orientador", value: "orientador" },
      ],
      tipoFiltro: null,

      estadoTemasOptions: [
        { label: "Temas Propostos", value: "propostos" },
        { label: "Temas Aguardando Aprovação", value: "aguardando aprovacao" },
        { label: "Temas Aprovados", value: "aprovados" },
        { label: "Temas Reprovados", value: "reprovados" },
        { label: "Todos", value: "todos" },
      ],
      estadoTemas: null,

      estadoProjectosOptions: [
        { label: "Projectos Concluídos", value: "Concluido" },
        { label: "Projectos Reprovados", value: "Reprovado" },
        { label: "Projectos Descontinuados", value: "Desistido" },
        { label: "Projectos Em Andamento", value: "Em andamento" },
      ],
      estadoProjectos: null,

      turmasCoordenadorOptions: [],
      turmasCoordenador: null,

      orientadoresOptions: [],
      orientadores: null,

      cursossOptions: [],
      cursos: null,

      anosLectivosOptions: [],
      anosLectivos: null,

      dataInicial: "",
      dataFinal: "",

      usuarioLogado: null,

      projectosEmAndamento: [],
      listaOrientadores: [],

      todosAnosLectivos: [],
      todosProjectos: [],
      todosCursos: [],
    };
    this.toast = React.createRef();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const params = {
      curso: this.state.cursos,
      anoLectivo: this.state.anosLectivos,
      estado: this.state.estadoProjectos,
    };

    try {
      const response = await api.get("/relatorios/exportarExcel", {
        params,
        responseType: "arraybuffer",
      });

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "relatorio.xlsx";
      link.click();
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
    }
  };

  gerarListaOrientadores = async (e) => {
    e.preventDefault();

    try {
      const response = await api.get("/relatorios/allOrientadores", {
        responseType: "arraybuffer",
      });

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "lista_orientadores.xlsx";
      link.click();
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
    }
  };

  async componentDidMount() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });

      try {
        const orientadoresResponse = await api.get(
          "utilizador/findAllOrientador"
        );
        const orientadoresOptions = orientadoresResponse.data.map((o) => ({
          label: o.nome,
          value: o.pkUtilizador,
        }));

        const cursosResponse = await api.get("curso/findAll");
        const cursossOptions = cursosResponse.data.map((c) => ({
          label: c.designacao,
          value: c.pkCurso,
        }));

        const anoLectivoResponse = await api.get("anoLectivo/findAll");
        const anosLectivosOptions = anoLectivoResponse.data.map((c) => ({
          label: c.designacao,
          value: c.pkAnoLectivo,
        }));

        const turmasCoordenadorResponse = await api.get(
          `turma/findTurmasDoCoordenador/${
            JSON.parse(usuario).fkUtilizador.pkUtilizador
          }`
        );
        const turmasCoordenadorOptions = turmasCoordenadorResponse.data.map(
          (tc) => ({
            label: tc.codigo,
            value: tc.pkTurma,
          })
        );

        this.setState({
          orientadoresOptions,
          cursossOptions,
          anosLectivosOptions,
          turmasCoordenadorOptions,
        });

        const todosAnosLectivosResponse = await api.get(`anoLectivo/findAll/`, {
          withCredentials: true,
        });
        const todosProjectosResponse = await api.get(`projecto/findAll/`, {
          withCredentials: true,
        });
        const todosCursosResponse = await api.get(`curso/findAll/`, {
          withCredentials: true,
        });
        this.setState({
          todosAnosLectivos: todosAnosLectivosResponse.data,
          todosProjectos: todosProjectosResponse.data,
          todosCursos: todosCursosResponse.data,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }
  render() {
    const { todosAnosLectivos, todosProjectos, todosCursos } = this.state;

    const cursos = [
      ...new Set(
        todosProjectos
          .map((p) => p.fkTurma?.fkDisciplina?.fkCurso?.designacao)
          .filter((designacao) => !!designacao)
      ),
    ];

    const anos = [
      ...new Set(
        todosProjectos
          .map((p) => p.fkTurma?.fkAnoLectivo?.designacao)
          .filter((designacao) => !!designacao)
      ),
    ];

    const cores = [
      "rgba(18, 1, 58, 0.5)",
      "rgba(12, 4, 121, 0.5)",
      "rgba(29, 90, 182, 0.5)",
      "rgba(10, 22, 192, 0.5)",
      "rgba(87, 114, 236, 0.5)",
      "rgba(84, 152, 192, 0.5)",
    ];

    const datasets = anos.map((ano, idx) => ({
      label: ano,
      data: cursos.map(
        (curso) =>
          todosProjectos.filter(
            (p) =>
              p.fkTurma?.fkDisciplina?.fkCurso?.designacao === curso &&
              p.fkTurma?.fkAnoLectivo?.designacao === ano
          ).length
      ),
      backgroundColor: cores[idx % cores.length],
    }));

    const dataProjetosPorCurso = {
      labels: cursos,
      datasets,
    };

    return (
      <div>
        <style>
          {`
            .divider {
              border-bottom: 1px solid #ccc;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
          `}
        </style>

        <div className="p-7" onSubmit={this.handleSubmit}>
          <Toast ref={(el) => (this.toast = el)} />
          <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
            <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
              <li>
                <a
                  href="/tarefa-index"
                  className="text-500 no-underline line-height-3 cursor-pointer"
                >
                  Relatórios
                </a>
              </li>
              <li className="px-2">
                <i className="pi pi-angle-right text-500 line-height-3"></i>
              </li>
              <li>
                <span className="text-900 line-height-3">Gerar Relatórios</span>
              </li>
              {/*<li className="ml-auto">
                <Button
                  type="submit"
                  label="Gerar Relatório"
                  className="p-button-outlined mr-2"
                />
              </li>*/}
            </ul>
          </div>

          <div className="p-fluid" style={{ marginTop: "1px" }}>
            <div className="surface-section surface-card p-5 border-round flex-auto">
              <div className="grid">
                <div className="col-3 md:col-3 surface-card p-5 shadow-2 border-round">
                  <div className="field">
                    <Button
                      type="button"
                      label="Gerar Lista de Orientadores"
                      className="p-button-outlined mr-2"
                      onClick={this.gerarListaOrientadores}
                    />
                  </div>
                  {/*<div className="field">
                    <Button
                      type="submit"
                      label="Gerar Lista de Estudantes"
                      className="p-button-outlined mr-2"
                    />
                  </div>*/}
                  <div className="divider"> </div>

                  <div className="divider"> </div>
                  <div className="field">
                    <Dropdown
                      required
                      id="cursos"
                      value={this.state.cursos}
                      options={this.state.cursossOptions}
                      onChange={(e) => this.setState({ cursos: e.value })}
                      placeholder="Selecione o curso"
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                    <br />
                    <Dropdown
                      required
                      id="anosLectivos"
                      value={this.state.anosLectivos}
                      options={this.state.anosLectivosOptions}
                      onChange={(e) => this.setState({ anosLectivos: e.value })}
                      placeholder="Selecione o ano lectivo"
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                    <br />
                    <Dropdown
                      required
                      id="estadoProjectos"
                      value={this.state.estadoProjectos}
                      options={this.state.estadoProjectosOptions}
                      onChange={(e) =>
                        this.setState({ estadoProjectos: e.value })
                      }
                      placeholder="Selecione o estado do projecto"
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                    <br />
                    <Button
                      type="button"
                      label="Gerar Relatório"
                      className="p-button-outlined mr-2"
                      onClick={this.handleSubmit}
                    />
                  </div>
                  <div className="divider"> </div>
                  <div className="field"></div>
                  <div className="divider"> </div>
                  <div className="field"></div>
                </div>

                <div className="col-9 md:col-9">
                  <span
                    className="text-900 font-medium text-xl mb-3"
                    style={{ display: "block", textAlign: "center" }}
                  >
                    Projectos por Curso agrupados por Ano Lectivo
                  </span>
                  <Bar
                    data={dataProjetosPorCurso}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                          text: "Projetos por Curso e Ano Letivo",
                        },
                      },
                      scales: {
                        x: { stacked: false },
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="divider"> </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ProjectoIndex;
