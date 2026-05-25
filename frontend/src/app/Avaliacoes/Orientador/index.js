import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import api from "../../axiosConfig";
import { Calendar } from "primereact/calendar";
import { Rating } from "primereact/rating";
import { TabView, TabPanel } from "primereact/tabview";

class AvaliacoesOrientador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      periodos: [],
      avaliacoesOrientador: [],
      dataInicio: null,
      dataFim: null,
      isCoordenador: false,
    };

    this.toast = React.createRef();
  }

  async componentDidMount() {
    try {
      const responsePeriodos = await api.get(`avaliacao/periodo/findAll/`);
      const responseAvaliacoesOrientador = await api.get(
        `avaliacao/orientador/findAll/`
      );

      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });

        const response = await api.get(
          `utilizador/isCoordenador/${
            JSON.parse(usuario).fkUtilizador.pkUtilizador
          }`,
          {
            withCredentials: true,
          }
        );

        this.setState({
          isCoordenador: response.data,
        });

        if (this.state.isCoordenador) {
          const responsePeriodos = await api.get(
            `avaliacao/periodo/findAllAvaliacaoPeriodoDoCoordenador/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }`
          );

          const responseAvaliacoesOrientador = await api.get(
            `avaliacao/orientador/findByFkCoordenador/${
              JSON.parse(usuario).fkUtilizador.pkUtilizador
            }`
          );
          this.setState({
            periodos: responsePeriodos.data,
            avaliacoesOrientador: responseAvaliacoesOrientador.data,
          });
        } else {
          this.setState({
            periodos: responsePeriodos.data,
            avaliacoesOrientador: responseAvaliacoesOrientador.data,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  onSubmitPeriodo = async () => {
    const { dataInicio, dataFim, usuarioLogado } = this.state;

    if (!dataInicio || !dataFim) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, define o periodo.",
        life: 5000,
      });
      return;
    }

    if (dataInicio > dataFim) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "A data de início não pode ser posterior à data de fim.",
        life: 5000,
      });
      return;
    }

    try {
      await api.post("avaliacao/periodo/save", {
        dataInicio,
        dataFim,
        createdBy: usuarioLogado.fkUtilizador,
      });
      this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Periodo adicionado com sucesso!",
        life: 5000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao criar o periodo.",
        life: 3000,
      });
      return;
    }
  };

  render() {
    const {
      avaliacoesOrientador,
      periodos,
      isCoordenador,
      dataInicio,
      dataFim,
    } = this.state;

    return (
      <div>
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
          <Toast ref={this.toast} />
          <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
            <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
              <li>
                <a
                  href="/projecto-index"
                  className="text-500 no-underline line-height-3 cursor-pointer"
                >
                  Avaliações
                </a>
              </li>
              <li className="px-2">
                <i className="pi pi-angle-right text-500 line-height-3"></i>
              </li>
              <li>
                <span className="text-900 line-height-3">Mais Detalhes</span>
              </li>{" "}
            </ul>
          </div>

          <div style={{ marginTop: "1px" }}>
            <div className="surface-section surface-card p-5 border-round flex-auto">
              <div className="grid">
                <div className="col-12 lg:col lg:px-5">
                  <div className="flex flex-wrap align-items-center justify-content-between mb-5 gap-5">
                    <TabView>
                      <TabPanel header="Avaliações">
                        <DataTable
                          value={avaliacoesOrientador}
                          onRowExpand={this.onRowExpand}
                          dataKey="pkAvaliacaoOrientador"
                          tableStyle={{ minWidth: "95rem" }}
                        >
                          <Column field="#" header="" />
                          <Column
                            field="avaliacao"
                            header="Avaliação"
                            sortable
                            body={(rowData) => (
                              <Rating
                                value={rowData.avaliacao}
                                readOnly
                                stars={5}
                                cancel={false}
                              />
                            )}
                          />

                          <Column
                            field="comentario"
                            header="Comentário"
                            sortable
                          />

                          <Column
                            field="fkProjecto.fkOrientador.nome"
                            header="Orientador"
                            sortable
                          />
                        </DataTable>
                      </TabPanel>

                      <TabPanel header="Periodo de Avaliações">
                        {isCoordenador && (
                          <form
                            className="p-fluid grid"
                            onSubmit={this.onSubmitPeriodo}
                          >
                            <div class="field col-5">
                              <label htmlFor="dataInicio">Data Inicío</label>
                              <Calendar
                                required
                                id="dataInicio"
                                name="dataInicio"
                                minDate={new Date()}
                                value={dataInicio}
                                placeholder={
                                  dataInicio
                                    ? dataInicio.toLocaleDateString()
                                    : "Selecione uma data"
                                }
                                className="form-control"
                                onChange={(e) =>
                                  this.setState({ dataInicio: e.target.value })
                                }
                                showIcon
                              />
                            </div>
                            <div class="field col-5">
                              <label htmlFor="dataFim">Data Final</label>
                              <Calendar
                                required
                                id="dataFim"
                                name="dataFim"
                                minDate={new Date()}
                                value={dataFim}
                                placeholder={
                                  dataFim
                                    ? dataFim.toLocaleDateString()
                                    : "Selecione uma data"
                                }
                                className="form-control"
                                onChange={(e) =>
                                  this.setState({ dataFim: e.target.value })
                                }
                                showIcon
                              />
                            </div>
                            <div
                              class="field col-2"
                              style={{ marginTop: "1.5rem" }}
                            >
                              <Button
                                type="submit"
                                label="Salvar Novo Periodo"
                                className="p-button"
                              />
                            </div>
                          </form>
                        )}
                        <br />
                        <br />
                        <br />
                        <DataTable
                          value={periodos}
                          onRowExpand={this.onRowExpand}
                          dataKey="pkAvaliacaoPeriodo"
                          tableStyle={{ minWidth: "95rem" }}
                        >
                          <Column field="#" header="" />
                          <Column
                            field="dataInicio"
                            header="Data Inicio"
                            sortable
                          />
                          <Column field="dataFim" header="Data Fim" sortable />
                          <Column
                            field="createdBy.nome"
                            header="Criado Por"
                            sortable
                          />
                        </DataTable>
                      </TabPanel>
                    </TabView>
                  </div>
                </div>
              </div>

              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AvaliacoesOrientador);
