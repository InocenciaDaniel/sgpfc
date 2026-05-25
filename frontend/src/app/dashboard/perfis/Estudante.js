import React, { Component } from "react";
import api from "../../axiosConfig";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import ListaTarefasEstudante from "../../tarefa/ListaTarefasEstudante";

export class EstudanteDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      usuarioLogado: null,

      temaEstudante: [],
      projectoEstudante: [],
      numeroFaltas: 0,

      //Admin
      turmas: [],
      search: "", //campo de pesquisa

      //Coordenador
      turmaSelecionada: null,
      temas: [],

      isEstudanteMatriculado: false,
      utilizadorPodeProporTema: false,
    };
  }

  async componentDidMount() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });

      try {
        //Se o utilizador logado for estudante
        if (
          JSON.parse(usuario).fkUtilizador.fkTipoConta.designacao ===
          "Estudante"
        ) {
          const isEstudanteMatriculadoResponse = await api.get(
            `turmaEstudante/isEstudanteMatriculado/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }`
          );

          const fkTurmaEstudanteMatriculadoResponse = await api.get(
            `turma/findTurmaByEstudante/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }`
          );

          console.log(
            "fkTurmaEstudanteMatriculadoResponse "
              .fkTurmaEstudanteMatriculadoResponse
          );

          const utilizadorPodeProporTemaResponse = await api.get(
            `utilizador/utilizadorPodeProporTema/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }`
          );

          if (utilizadorPodeProporTemaResponse.data) {
            this.setState({
              utilizadorPodeProporTema: true,
            });
          }

          this.setState({
            isEstudanteMatriculado: isEstudanteMatriculadoResponse.data,
            turmaSelecionada: fkTurmaEstudanteMatriculadoResponse.data,
          });

          console.log(this.state.turmaSelecionada.data);

          const temaEstudanteResponse = await api.get(
            `tema/findByfkTemaPropostoPor/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }`
          );
          if (temaEstudanteResponse.data) {
            this.setState({ temaEstudante: temaEstudanteResponse.data });
          }

          const projectoEstudanteResponse = await api.get(
            `projecto/findByFkEstudante/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }`
          );
          if (projectoEstudanteResponse.data) {
            this.setState({
              projectoEstudante: projectoEstudanteResponse.data,
            });
          }

          const numeroFaltasResponse = await api.get(
            `presenca/numeroFaltasFindByFkEstudante/${
              JSON.parse(usuario).fkUtilizador?.pkUtilizador
            }/${this.state.turmaSelecionada?.pkTurma}`
          );
          if (numeroFaltasResponse.data) {
            this.setState({ numeroFaltas: numeroFaltasResponse.data });
          }

          
        }
      } catch (error) {
        console.error("Erro ao verificar:", error);
        return false;
      }
    }
  }

  render() {
    const { usuarioLogado, isEstudanteMatriculado } = this.state;

    return (
      <div>
        <style>
          {`
            .p-dataview .p-dataview-header{
              border: none;
              padding: 0;
            }
          `}
        </style>
        {usuarioLogado && (
          // Se o utilizador logado por estudante
          <div className="p-7">
            <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
              <div className="surface-0">
                <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                  <li>
                    <a
                      href="##"
                      className="text-500 no-underline line-height-3 cursor-pointer"
                    >
                      Página Inicial
                    </a>
                  </li>
                  <li className="px-2">
                    <i className="pi pi-angle-right text-500 line-height-3"></i>
                  </li>
                  <li>
                    <span className="text-900 line-height-3">
                      {usuarioLogado?.fkUtilizador?.nome}
                    </span>
                  </li>
                </ul>
                <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                  <div>
                    <div className="font-medium text-3xl text-900"></div>
                    <div className="flex align-items-center text-700 flex-wrap">
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-users mr-2"></i>
                        <span>
                          {usuarioLogado?.fkUtilizador?.numMatriculaEstudante}
                        </span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-globe mr-2"></i>
                        <span>
                          {this.state.numeroFaltas !== null
                            ? this.state.numeroFaltas
                            : "0"}{" "}
                          Falta (s)
                        </span>
                      </div>
                      <div className="flex align-items-center mt-3">
                        {this.state.turmaSelecionada ? (
                          <i className="pi pi-clock mr-2"></i>
                        ) : null}
                        <span>
                          {this.state.turmaSelecionada?.codigo} -{" "}
                          {this.state.turmaSelecionada?.fkDisciplina?.designacao}{" "}
                          -{" "}
                          {this.state.turmaSelecionada?.fkAnoLectivo?.designacao}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 lg:mt-0">
                    {this.state.isEstudanteMatriculado &&
                    this.state.projectoEstudante.every(
                      (projecto) => projecto.estado !== "Em andamento"
                    ) &&
                    this.state.projectoEstudante.every(
                      (projecto) => projecto.estado !== "Concluido"
                    ) &&
                    this.state.temaEstudante.every(
                      (tema) => tema.estado !== "aguardando aprovacao"
                    ) ? (
                      <div>
                        <Link to="/tema-propor">
                          <Button
                            label="Propor Novo Tema"
                            className="p-button-outlined mr-2"
                          />
                        </Link>
                      </div>
                    ) : null}

                    {Array.isArray(this.state.temaEstudante) &&
                    this.state.temaEstudante.length > 0 ? (
                      this.state.temaEstudante.every(
                        (tema) => tema.estado === "reprovado"
                      ) ? null : null
                    ) : (
                      <div>
                        {isEstudanteMatriculado ? (
                          <></>
                        ) : (
                          <div>
                            <Link to="#">
                              <Button
                                label="Estudante Não Matriculado"
                                disabled
                                className="p-button-outlined mr-2"
                              />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="grid">
              <div className="col-6 xl:col-6">
                {this.state.projectoEstudante.length > 0 ? (
                  <div className="surface-card shadow-2 border-round p-4">
                    <div className="text-xl text-900 font-medium">
                      Tarefas Atribuidas <br />
                    </div>
                    <div
                      className="py-3 border-bottom-1 surface-border "
                      style={{}}
                    ></div>
                    <ListaTarefasEstudante desabilitarFiltros={true} />
                  </div>
                ) : null}
              </div>
              <div className="col-6 xl:col-6">
                {this.state.projectoEstudante.length > 0 ? (
                  <div className="surface-card shadow-2 border-round p-4">
                    {this.state.projectoEstudante.length !== 0 ? (
                      <div>
                        <div className="text-xl text-900 font-medium">
                          Meus Projectos <br />
                        </div>

                        <div
                          className="py-3 border-bottom-1 surface-border "
                          style={{
                            padding: "15px",
                          }}
                        ></div>
                        {this.state.projectoEstudante.map((projecto, index) => (
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
                                  <div className=" mb-2">
                                    <strong>
                                      {projecto.fkTema?.titulo
                                        .charAt(0)
                                        .toUpperCase() +
                                        projecto.fkTema?.titulo
                                          .slice(1)
                                          .toLowerCase()}
                                    </strong>
                                  </div>
                                  <div className="text-secondary mb-2">
                                    <span className="mr-2">
                                      <strong>Orientador: </strong>
                                      {projecto.fkOrientador?.nome}
                                    </span>

                                    <span className="mr-2">
                                      <strong>Estado: </strong>

                                      {projecto?.estado
                                        .charAt(0)
                                        .toUpperCase() +
                                        projecto?.estado.slice(1).toLowerCase()}
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
                    ) : null}
                  </div>
                ) : (
                  <></>
                )}
                <br />
                {this.state.temaEstudante.length > 0 ? (
                  <div className="surface-card shadow-2 border-round p-4">
                    <div>
                      <div className="text-xl text-900 font-medium">
                        Meus Temas
                        <br />
                      </div>

                      <div>
                        <div
                          className="py-3 border-bottom-1 surface-border "
                          style={{
                            padding: "15px",
                          }}
                        ></div>

                        {Array.isArray(this.state.temaEstudante) &&
                        this.state.temaEstudante.length > 0
                          ? this.state.temaEstudante
                              //  .filter((tema) => tema.estado !== "aprovado") // Filtra temas que não estão aprovados
                              .map((tema, index) => (
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
                                        href={`/tema-visualizar/${tema.pkTema}`}
                                        className="text-decoration-none"
                                        style={{
                                          color: "#333",
                                          textDecoration: "none",
                                        }}
                                        id="tema-link"
                                      >
                                        <div className=" mb-2">
                                          <strong>
                                            {tema?.titulo
                                              .charAt(0)
                                              .toUpperCase() +
                                              tema?.titulo
                                                .slice(1)
                                                .toLowerCase()}
                                          </strong>
                                        </div>
                                        <div className="text-secondary mb-2">
                                          <span className="mr-2">
                                            <strong>
                                              Orientador Proposto:{" "}
                                            </strong>
                                            {tema?.fkOrientadorPropostoEmail}
                                          </span>

                                          <span className="mr-2">
                                            <strong>Estado: </strong>
                                            {tema?.estado
                                              .charAt(0)
                                              .toUpperCase() +
                                              tema?.estado
                                                .slice(1)
                                                .toLowerCase()}
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
                              ))
                          : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default EstudanteDashboard;
