import React, { Component } from "react";
import { Checkbox } from "primereact/checkbox";
import { withRouter } from "react-router-dom";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

class TarefaAtribuidaVisualizar extends Component {
  state = {
    usuarioLogado: null,
    tarefa: null,
    pkTarefa: "",
    error: "",
  };

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;
      const tarefaResponse = await api.get(`tarefasAtribuidas/${id}`);

      this.setState({
        pkTarefa: tarefaResponse.data.pkTarefa,
        tarefa: tarefaResponse.data,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  handleBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { usuarioLogado, tarefa } = this.state;
    const isOrientadorCriador =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Orientador";

    return (
      <div>
        {usuarioLogado ? (
          <div className="p-7">
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="##"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Tarefa Atribuida
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">Mais Detalhes</span>
                </li>
                {isOrientadorCriador && (
                  <li className="ml-auto">
                    <a
                      href={`/tarefa-atribuida-editar/${tarefa.pkTarefasAtribuidas}`}
                      style={{
                        marginTop: "0.5rem",
                        textDecoration: "none",
                        color: "#123456",
                      }}
                    >
                      Editar
                    </a>
                  </li>
                )}
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                  <div className="flex align-items-center text-700 flex-wrap">
                    <div className="mr-5 flex align-items-center mt-3"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                <div className="surface-section">
                  <div className="grid">
                    <div className="col-9">
                      <div className="font-medium text-3xl text-900 mb-3">
                        {tarefa.designacaoTarefa}
                      </div>
                    </div>
                  </div>
                  <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Peso
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.pesoTarefa} %
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Data Entrega
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {new Date(
                          tarefa.dataEntregaTarefa
                        ).toLocaleDateString()}
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Descrição
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.descricaoTarefa}
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Observações
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.observacoesTarefa}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Tipo de Tarefa
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.tipoTarefa}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Upload Obrigatorio
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <Checkbox
                          id="uploadObrigatorio"
                          checked={tarefa.uploadObrigatorioTarefa}
                          className="form-control"
                          disabled
                        />
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Tarefa Atribuida A
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.tarefaAtribuidaA}
                      </div>
                    </li>
                    {tarefa.tarefaAtribuidaA === "Turma" && (
                      <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">
                          Turma
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          {tarefa.fkTurma.codigo}
                        </div>
                      </li>
                    )}

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Tarefa Criada Por
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.createdBy.nome}
                      </div>
                    </li>
                    {tarefa.dataActualizacaoEntregaTarefa && (
                      <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">
                          Data de Actualização
                        </div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          {new Date(
                            tarefa.dataActualizacaoEntregaTarefa
                          ).toLocaleDateString()}
                        </div>
                      </li>
                    )}
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap"></li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className="back-button"
              style={{ marginTop: "20px", textAlign: "left" }}
            >
              <Button
                label="Voltar"
                icon="pi pi-arrow-left"
                className="p-button-outlined"
                onClick={this.handleBack}
                style={{ backgroundColor: "#007bff", color: "#fff" }}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(TarefaAtribuidaVisualizar);
