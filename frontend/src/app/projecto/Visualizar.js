import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Toast } from "primereact/toast";
import api from "../axiosConfig";
import { Badge } from "primereact/badge";
import ProjectoBotoesRodape from "./partes/ProjectoBotoesRodape";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import ProjectoSideBar from "./partes/ProjectoSideBar";
import ProjectoTarefas from "./partes/ProjectoTarefas";
import ProjectoEstado from "./partes/ProjectoEstado";
import ProjectoPrivacidade from "./partes/ProjectoPrivacidade";
import ProjectoComentarios from "./partes/ProjectoComentarios";
import ProjectoAvaliacoes from "./partes/ProjectoAvaliacoes";

const RedirectComponent = ({ usuarioLogado, projecto }) => {
  if (
    usuarioLogado &&
    usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Estudante" &&
    projecto?.fkEstudante.pkUtilizador !==
      usuarioLogado.fkUtilizador.pkUtilizador
  ) {
    this.props.history.push("/unauthorized");
  }

  return null;
};

class ProjectoVisualizar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      projecto: null,
      numeroFaltas: null,
      progresso: 0,

      irregularidadeVerificada: null,
      justificativaProjecto: null,
    };
  }

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;

      const projectoResponse = await api.get(`projecto/${id}`);

      if (
        this.state.projecto === null ||
        this.state.projecto.pkProjecto !== projectoResponse.data.pkProjecto
      ) {
        this.setState({ projecto: projectoResponse.data });
      }

      if (this.state.projecto) {
        const numeroFaltasResponse = await api.get(
          `presenca/numeroFaltasFindByFkEstudante/${this.state.projecto.fkEstudante.pkUtilizador}/${this.state.projecto.fkTurma?.pkTurma}`
        );
        if (numeroFaltasResponse.data) {
          this.setState({ numeroFaltas: numeroFaltasResponse.data });
        }

        const irregularidadeProjectoResponse = await api.get(
          `irregularidadeProjecto/findByFkProjecto/${this.state.projecto?.pkProjecto}`
        );
        if (irregularidadeProjectoResponse.data) {
          this.setState({
            irregularidadeVerificada: irregularidadeProjectoResponse.data,
          });
        }
      }

      if (
        this.state.projecto.estado === "Desistido" ||
        this.state.projecto.estado === "Reprovado"
      ) {
        const justificativaProjectoResponse = await api.get(
          `justificativaProjecto/findByPkProjecto/${this.state.projecto?.pkProjecto}`
        );
        if (justificativaProjectoResponse.data) {
          this.setState({
            justificativaProjecto: justificativaProjectoResponse.data,
          });
        }
      }

      /*const responseTarefasDoEstudanteAtribuidasAoEstudante = await api.get(
        `tarefasAtribuidas/findLastTarefa/${this.state.projecto?.fkEstudante?.pkUtilizador}/${this.state.projecto?.pkProjecto}/${this.state.projecto?.fkTurma?.pkTurma}`
      );
      this.setState({ progresso: this.state.projecto.progresso * 100 / responseTarefasDoEstudanteAtribuidasAoEstudante.data.length });

      */
      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });

        if (
          this.state.usuarioLogado.fkUtilizador.fkTipoConta.designacao ===
            "Estudante" &&
          this.state.projecto?.fkEstudante.pkUtilizador !==
            this.state.usuarioLogado.fkUtilizador.pkUtilizador
        ) {
          this.props.history.push("/unauthorized");
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  handleValidarRelatorioDesistencia = async (e) => {
    e.preventDefault();
    const { usuarioLogado, justificativaProjecto } = this.state;
    try {
      const formData = new FormData();
      formData.append("validadoPor", usuarioLogado?.fkUtilizador?.pkUtilizador);
      formData.append(
        "pkJustificativaProjecto",
        justificativaProjecto?.pkJustificativaProjecto
      );

      await api.put("justificativaProjecto/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.setState({ justificativa: "", relatorio: null });
      this.hideDesistirModal();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar a justificativa do projecto", error);
    }
  };

  render() {
    const {
      usuarioLogado,
      projecto,
      numeroFaltas,
      irregularidadeVerificada,
      justificativaProjecto,
    } = this.state;
    const isFuncionarioDei =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Funcionario DEI";
    const isEstudante =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Estudante";
    const isAdministrador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "admin";

    return (
      <div>
        <RedirectComponent
          usuarioLogado={this.props.usuarioLogado}
          projecto={this.props.projecto}
        />
        <style>
          {`
            .divider {
              border-bottom: 1px solid #ccc;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .p-tabview .p-tabview-nav{
              border-bottom: none;
            }
          `}
        </style>
        <div className="p-7">
          <Toast ref={(el) => (this.toast = el)} />
          <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
            <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
              <li>
                <a
                  href="/projecto-index"
                  className="text-500 no-underline line-height-3 cursor-pointer"
                >
                  Projectos
                </a>
              </li>
              <li className="px-2">
                <i className="pi pi-angle-right text-500 line-height-3"></i>
              </li>
              <li>
                <span className="text-900 line-height-3">Mais Detalhes</span>
              </li>
              <li className="ml-auto">
                {projecto?.estado === "Em andamento" ? (
                  <Badge
                    value={projecto?.estado}
                    style={{ background: "#95a5a6" }}
                  ></Badge>
                ) : (
                  <Badge
                    value={
                      projecto?.estado === "Desistido"
                        ? "Descontinuado"
                        : projecto?.estado
                    }
                    style={{ background: "#95a5a6" }}
                  ></Badge>
                )}
              </li>
            </ul>

            <div
              className="surface-300 w-full mt-2"
              style={{ height: "7px", borderRadius: "4px" }}
            >
              <div
                className="bg-indigo-500 h-full"
                style={{
                  width: `${projecto?.progresso}%`,
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>
          <div style={{ marginTop: "1px" }}>
            <div className="surface-section surface-card p-5 border-round flex-auto">
              <div>
                {projecto?.estado === "Desistido" ||
                projecto?.estado === "Reprovado" ? (
                  <div className="flex align-items-start p-4 bg-yellow-100 border-round border-1 border-yellow-300">
                    <i className="pi pi-exclamation-triangle text-yellow-900 text-2xl mr-3"></i>
                    <div className="mr-3">
                      <div className="text-yellow-900 font-medium text-xl mb-2 line-height-1">
                        Atenção
                      </div>
                      <p className="m-0 p-0 text-yellow-700 mb-3 line-height-3">
                        {`Projecto ${
                          projecto?.estado === "Desistido"
                            ? "Descontinuado"
                            : projecto?.estado
                        }. Para mais informações, abra a aba "Projecto ${
                          projecto?.estado === "Desistido"
                            ? "Descontinuado"
                            : projecto?.estado
                        }"`}
                      </p>
                      {isFuncionarioDei ? (
                        justificativaProjecto?.fkValidadoPor === null ? (
                          <div>
                            <Button
                              label="Confirmar que o relatório foi entregue"
                              onClick={this.handleValidarRelatorioDesistencia}
                              severity="info"
                              outlined
                            />
                          </div>
                        ) : null
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {projecto?.estado === "Concluido" ? (
                  <div class="flex align-items-start p-4 bg-green-100 border-round border-1 border-green-300">
                    <i class="pi pi-check-circle text-green-900 text-2xl mr-3"></i>
                    <div class="mr-3">
                      <div class="text-green-900 font-medium text-xl mb-2 line-height-1">
                        Concluído
                      </div>
                      <p class="m-0 p-0 text-green-700 line-height-3">
                        Projecto concluído com sucesso!
                      </p>
                    </div>
                  </div>
                ) : null}
                <br />
              </div>

              <div className="grid">
                <div className="col-12 lg:col lg:px-5">
                  <div className="flex flex-wrap align-items-center justify-content-between mb-5 gap-5">
                    <TabView>
                      <TabPanel header="Informações Gerais do Projecto">
                        <h2 className="card-title mb-1">
                          {projecto?.fkTema?.titulo}
                        </h2>
                        <br />
                        <p className="text-justify">
                          <strong>Descrição: </strong>
                          {projecto?.fkTema?.descricao}
                        </p>
                        <p className="text-justify ">
                          <strong>Diferencial: </strong>
                          {projecto?.fkTema?.diferencial}
                        </p>
                        <p className="text-justify">
                          <strong>Justificativa: </strong>
                          {projecto?.fkTema?.justificativa}
                        </p>
                        {!isEstudante ? (
                          <div>
                            <p className="text-justify">
                              {projecto?.declaracaoAptidaoUrl !== null && (
                                <div className="file-container">
                                  <div className="file-item">
                                    <span className="pi pi-file file-icon"></span>
                                    <a
                                      href={`http://localhost:3000/declaracoes/${projecto?.declaracaoAptidaoUrl}`}
                                      download={projecto?.declaracaoAptidaoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="file-link"
                                    >
                                      {projecto?.declaracaoAptidaoUrl}
                                    </a>
                                  </div>
                                </div>
                              )}
                            </p>
                          </div>
                        ) : null}
                      </TabPanel>
                      <TabPanel header="Tarefas">
                        <ProjectoTarefas
                          projecto={projecto ? projecto : null}
                          usuarioLogado={usuarioLogado}
                        />
                      </TabPanel>
                      <TabPanel header="Irregularidades">
                        <ul className="list-none p-0 m-0">
                          {irregularidadeVerificada && (
                            <div>
                              {irregularidadeVerificada.map(
                                (irregularidade, index) => (
                                  <li
                                    key={index}
                                    className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap"
                                  >
                                    <div className="text-500 w-6 md:w-2 font-medium">
                                      {
                                        irregularidade.dataIrregularidadeVerificada
                                      }
                                    </div>
                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                      {irregularidade.irregularidadeVerificada}
                                    </div>
                                  </li>
                                )
                              )}
                            </div>
                          )}
                        </ul>
                      </TabPanel>
                      <TabPanel header="Comentários">
                        <ProjectoComentarios
                          projecto={projecto ? projecto : null}
                          usuarioLogado={usuarioLogado}
                        />
                      </TabPanel>
                      {projecto?.estado === "Em andamento" && isEstudante && (
                        <TabPanel header="Avaliações">
                          <ProjectoAvaliacoes
                            projecto={projecto ? projecto : null}
                            usuarioLogado={usuarioLogado}
                          />
                        </TabPanel>
                      )}

                      {projecto?.estado === "Desistido" ||
                      projecto?.estado === "Reprovado" ? (
                        <TabPanel
                          header={`Projecto ${
                            projecto?.estado === "Desistido"
                              ? "Descontinuado"
                              : projecto?.estado
                          }`}
                        >
                          <ProjectoEstado
                            projecto={projecto ? projecto : null}
                            usuarioLogado={usuarioLogado}
                          />
                        </TabPanel>
                      ) : null}
                    </TabView>
                  </div>
                  <p className="divider"></p>
                  <br />
                  {projecto?.fkTurma?.deletedAt === null &&
                    new Date(projecto?.fkTurma?.dataFimSemestre) >
                      new Date() && (
                      <ProjectoBotoesRodape
                        projecto={projecto}
                        usuarioLogado={usuarioLogado}
                      />
                    )}

                  {isAdministrador && projecto.estado === "Concluido" ? (
                    <div>
                      <ProjectoPrivacidade
                        projecto={projecto ? projecto : null}
                        usuarioLogado={usuarioLogado}
                      />
                    </div>
                  ) : null}
                </div>
                <ProjectoSideBar
                  projecto={projecto ? projecto : null}
                  usuarioLogado={usuarioLogado}
                  numeroFaltas={numeroFaltas}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(ProjectoVisualizar);
