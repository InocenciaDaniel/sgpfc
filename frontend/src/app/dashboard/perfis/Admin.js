import React, { Component } from "react";
import api from "../../axiosConfig";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      turmas: [],
      search: "",
      sortKey: null,
      sortKeyEstado: null,
      cursosOptions: [],

      todosAnosLectivos: [],
      todosProjectos: [],
      todosOrientadores: [],
    };
  }

  async componentDidMount() {
    try {
      const todosAnosLectivosResponse = await api.get(`anoLectivo/findAll/`, {
        withCredentials: true,
      });

      const todosProjectosResponse = await api.get(`projecto/findAll/`, {
        withCredentials: true,
      });

      const todosOrientadoresResponse = await api.get(`projecto/findAll/`, {
        withCredentials: true,
      });
      this.setState({
        todosAnosLectivos: todosAnosLectivosResponse.data,
        todosProjectos: todosProjectosResponse.data,
        todosOrientadores: todosOrientadoresResponse.data,
      });

      const turmasResponse = await api.get(`turma/findAll/`, {
        withCredentials: true,
      });

      const cursosResponse = await api.get(`curso/findAll`, {
        withCredentials: true,
      });
      const cursosOptions = cursosResponse.data.map((c) => ({
        label: c.designacao,
        value: c.pkCurso,
      }));

      this.setState({
        cursosOptions,
        turmas: turmasResponse.data,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  onSortChange = (event) => {
    const value = event.value;
    this.setState({ sortKey: value, sortKeyEstado: null });

    const filteredTurmas = this.state.turmas.filter(
      (turma) => turma.fkDisciplina.fkCurso.pkCurso === value
    );

    this.setState({
      filteredTurmas,
    });
  };

  onSortEstadoChange = (event) => {
    const value = event.value;
    this.setState({ sortKeyEstado: value, sortKey: null });

    let sortedEstado;
    switch (value) {
      case "Activa":
        sortedEstado = [...this.state.turmas].filter(
          (turma) => turma.deletedAt === null
        );
        break;

      case "Desactiva":
        sortedEstado = [...this.state.turmas].filter(
          (turma) => turma.deletedAt !== null
        );
        break;

      default:
        sortedEstado = [...this.state.turmas];
        break;
    }

    this.setState({
      filteredTurmas: sortedEstado,
    });
  };

  render() {
    const { sortKey, sortKeyEstado } = this.state;

    const filteredTurmas = this.state.turmas.filter((turma) => {
      const search = this.state.search.toLowerCase();

      const codigo = turma.codigo?.toLowerCase() || "";
      const semestre = turma.fkSemestre?.designacao?.toLowerCase() || "";
      const disciplina = turma.fkDisciplina?.designacao?.toLowerCase() || "";
      const curso =
        turma.fkDisciplina?.fkCurso?.designacao?.toLowerCase() || "";
      const anoLectivo = turma.fkAnoLectivo?.designacao?.toLowerCase() || "";

      return (
        codigo.includes(search) ||
        semestre.includes(search) ||
        disciplina.includes(search) ||
        curso.includes(search) ||
        anoLectivo.includes(search)
      );
    });

    const turmasParaExibir =
      this.state.filteredTurmas || filteredTurmas || this.state.turmas;

    const { turmas } = this.state;

    const turmasAtivas = turmas.filter((turma) => turma.deletedAt === null);
    const turmasDesativadas = turmas.filter(
      (turma) => turma.deletedAt !== null
    );

    const qtdAtivas = turmasAtivas.length;
    const qtdDesativadas = turmasDesativadas.length;

    const data = {
      labels: ["Turma Activa", "Turma Desactiva"],
      datasets: [
        {
          label: "Estados das Turmas",
          data: [Number(qtdAtivas) || 0, Number(qtdDesativadas) || 0],
          backgroundColor: ["rgba(7, 117, 75, 0.5)", "rgba(27, 133, 32, 0.71)"],
        },
      ],
    };

    return (
      <div className="grid">
        <div className="col-12">
          <div className="shadow-2 surface-card border-round p-3">
            <div className="flex align-items-center justify-content-between">
              <Dropdown
                value={sortKey}
                options={this.state.cursosOptions}
                optionLabel="label"
                placeholder="Filtrar Por Curso"
                onChange={this.onSortChange}
              />
              <Dropdown
                style={{ flex: 1, marginLeft: "1rem" }}
                value={sortKeyEstado}
                options={[
                  { label: "Turma Activa", value: "Activa" },
                  { label: "Turma Desactiva", value: "Desactiva" },
                ]}
                optionLabel="label"
                placeholder="Filtrar Por Estado"
                onChange={this.onSortEstadoChange}
              />
              <div style={{ flex: 1, marginRight: "1rem", marginLeft: "1rem" }}>
                <InputText
                  value={this.state.search}
                  onChange={(e) => this.setState({ search: e.target.value })}
                  placeholder="Pesquisar Turma..."
                  className="w-full p-inputtext p-component"
                  style={{ border: "1px solid var(--surface-border)" }}
                />
              </div>
              <Link to="/turma-cadastrar">
                <Button label="Nova Turma" className="p-button-outlined mr-2" />
              </Link>
            </div>







            <div className="mt-3">
              {turmasParaExibir && turmasParaExibir.length > 0 ? (
                <div className="grid">
                  {turmasParaExibir.map((turma, fileIdx) => (
                    <div className="col-4">
                      <a
                        key={fileIdx}
                        href={`/turma-visualizar/${turma.pkTurma}`}
                        className="col-12 md:col-3"
                        style={{
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 16px rgba(0, 0, 0, 0.2)";
                          e.currentTarget.firstChild.style.border = "none";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.firstChild.style.border =
                            "1px solid var(--surface-border)";
                        }}
                      >
                        <div className="text-center border-1 surface-border border-round p-4">
                          {/* {turma.deletedAt === null ? (
                <Badge value="Activa" severity="contrast"></Badge>
                ) : (
                <Badge value="Desativa" severity="danger"></Badge>
                )}*/}
                          <div className="text-900 text-2xl font-700 my-3 font-bold">
                            {turma.fkAnoLectivo.designacao}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="font-medium text-900 mb-2">
                              <div
                                className="text-900 text-xl font-medium mr-2"
                                style={{
                                  color: "#333",
                                  fontSize: "1.25rem",
                                  fontWeight: "500",
                                }}
                              >
                                {turma.codigo} - {turma.fkSemestre.designacao}
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Nenhuma turma encontrada</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
