import React, { Component } from "react";
import api from "../axiosConfig";

export class PresencaIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      loading: true,
      error: null,
      turma: null,
      turmasActivas: [],
    };
  }

  fetchData = async () => {
    try {
      const usuario = localStorage.getItem("usuario");

      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });
      }
      const usuarioLogado = JSON.parse(usuario).fkUtilizador;

      if (
        usuarioLogado.fkTipoConta.designacao === "admin" ||
        usuarioLogado.fkTipoConta.designacao === "Funcionario DEI" ||
        usuarioLogado.fkTipoConta.designacao === "Conselho Científico"
      ) {
        const turmasResponse = await api.get(`turma/findAllTurmasActivas/`);
        this.setState({
          turmasActivas: turmasResponse.data,
        });
      }
      if (usuarioLogado.fkTipoConta.designacao === "Orientador") {
        const turmasResponse = await api.get(
          `turma/findAllTurmasActivasDoOrientador/${usuarioLogado.pkUtilizador}`
        );

        console.log(usuarioLogado.pkUtilizador);
        this.setState({
          turmasActivas: turmasResponse.data,
        });
      }

      this.setState({
        loading: false,
      });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  setGlobalFilter = (e) => {
    this.setState({ globalFilter: e.target.value });
  };

  visualizarPresenca = (rowData) => {
    this.props.history.push(`/presenca-visualizar/${rowData.pkPresenca}`);
  };

  render() {
    const { usuarioLogado, error } = this.state;
    

    if (error) {
      return <div>Erro ao carregar os dados: {error.message}</div>;
    }

    return (
      <div>
        {usuarioLogado ? (
          <div className="p-7">
            <div className="surface-section px-4 py-2 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/presenca-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Presenças
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Lista de Turmas Activas
                  </span>
                </li>
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                  <div className="flex align-items-center text-700 flex-wrap">
                    <div className="mr-5 flex align-items-center">
                      <b>Ano Lectivo: </b>{" "}
                      {this.state.turmasActivas[0]?.fkAnoLectivo.designacao}
                    </div>
                  </div>
                </div>
                <div className="mt-3 lg:mt-0"></div>
              </div>
            </div>
            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-card border-round p-3">
                {
                  <div className="grid">
                    {this.state.turmasActivas.length > 0 ? (
                      this.state.turmasActivas.map((turma, index) => (
                        <a
                          key={index}
                          href={`/lista-estudantes-presenca/${turma.pkTurma}`}
                          style={{
                            marginTop: "0.5rem",
                            textDecoration: "none",
                            color: "#123456",
                            textAlign: "center",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
                          }}
                          className="col-12 md:col-3"


                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.border = "none";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div
                            style={{
                              border: "1px solid var(--surface-border)",
                              borderRadius: "0.5rem",
                              padding: "1rem",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "var(--text-color)",
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                margin: "1rem 0",
                              }}
                            >
                              {turma.codigo}
                            </div>
                            <span
                              style={{
                                fontWeight: "500",
                                color: "var(--text-secondary-color)",
                              }}
                            >
                              {turma.fkAnoLectivo.designacao}
                            </span>
                            <br />
                            <br />
                          </div>
                        </a>
                      ))
                    ) : (
                      <div>Nenhuma turma encontrada.</div>
                    )}
                  </div>
                }
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

export default PresencaIndex;
