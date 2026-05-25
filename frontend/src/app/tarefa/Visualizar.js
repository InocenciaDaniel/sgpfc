import React, { Component } from "react";
import { Checkbox } from "primereact/checkbox";
import { withRouter } from "react-router-dom";
import api from "../axiosConfig";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import TarefaFormCadastrar from "./FormCadastrar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

class TarefaVisualizar extends Component {
  state = {
    usuarioLogado: null,
    turmaCorrente: "",
    uploadObrigatorio: true,
    error: "",
    alterarDataEntrega: false,
    templates: [],

    displayDialog: false,
    showEliminarDialog: false,
  };

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;
      const tarefaResponse = await api.get(`tarefa/${id}`);

      const templatesResponse = await api.get(
        `templateTarefa/findByFkTarefa/${id}`
      );
      this.setState({
        pkTarefa: tarefaResponse.data.pkTarefa,
        tarefa: tarefaResponse.data,
        uploadObrigatorio: tarefaResponse.data.uploadObrigatorio,
        templates: templatesResponse.data,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleUploadObrigatorioChange = (e) => {
    this.setState({ uploadObrigatorio: e.checked });
  };

  onEditClick = (e, tarefa) => {
    e.preventDefault();
    this.setState({
      displayDialog: true,
      selectedTarefa: tarefa,
    });
  };

  render() {
    const { usuarioLogado, tarefa, error } = this.state;
    const isOrientadorCriador =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Orientador" &&
      tarefa?.createdBy?.pkUtilizador ===
        usuarioLogado?.fkUtilizador?.pkUtilizador;

    return (
      <div>
        <style>
          {`
            .p-dropdown-label,
            .p-inputtext
            {
                width: 100%;
            }

            .data > input,
            .data > input
            {
                margin-top: -11px !important;
                border: none;
                height: calc(2.25rem + 2px);
                font-weight: normal;
                font-size: 0.875rem;
                padding: 0.625rem 0.6875rem;
                background-color: #2A3038 !important;
                border-radius: 2px;
                color: #ffffff;
            }
          `}
        </style>
        {usuarioLogado ? (
          <div className="p-7">
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/tarefa-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Tarefa
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
                      href={`/tarefa-editar/${tarefa.pkTarefa}`}
                      onClick={(e) => this.onEditClick(e, tarefa)}
                      style={{
                        marginTop: "0.5rem",
                        textDecoration: "none",
                        color: "#123456",
                      }}
                    >
                      Editar
                    </a>

                    <button
                      onClick={() =>
                        this.setState({ showEliminarDialog: true })
                      }
                      style={{
                        marginTop: "0.5rem",
                        textDecoration: "none",
                        color: "#ff0000",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      Eliminar
                    </button>
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
                  {error && (
                    <div className="alert alert-danger">
                      <Message
                        style={{
                          border: "solid #832226",
                          borderWidth: "0 0 0 6px",
                          color: "#832226",
                        }}
                        c
                        className="border-danger w-full justify-content-start"
                        severity="error"
                        content={error}
                      />
                    </div>
                  )}
                  <br />
                  <div className="grid">
                    <div className="col-9">
                      <div className="font-medium text-3xl text-900 mb-3">
                        {tarefa.designacao}
                      </div>
                    </div>
                  </div>
                  <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Peso
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.peso} %
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Prazo
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.prazo} Dias
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Descrição
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.descricao}
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Observações
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.observacoes}
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
                        Começar a contar quando?
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.comecarContarQuando}
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Upload Obrigatorio
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <Checkbox
                          id="uploadObrigatorio"
                          checked={this.state.uploadObrigatorio}
                          onChange={this.handleUploadObrigatorioChange}
                          className="form-control"
                          disabled
                        />
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Templates que usam essa tarefa
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {this.state.templates.map((template) => (
                          <div key={template.pkTemplateTarefa}>
                            <a
                              href={`/template-visualizar/${template.fkTemplate.pkTemplate}`}
                              style={{
                                textDecoration: "none",
                                color: "#123456",
                                transition: "color 0.3s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.color = "#0D253F")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.color = "#123456")
                              }
                            >
                              {template.fkTemplate.designacao}
                            </a>{" "}
                            ;
                          </div>
                        ))}
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Tarefa Criada Por
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {tarefa.createdBy.nome}
                      </div>
                    </li>

                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap"></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <Dialog
          header="Editar Tarefa"
          visible={this.state.displayDialog}
          onHide={() => this.setState({ displayDialog: false })}
          style={{ width: "50vw" }}
          modal
        >
          <TarefaFormCadastrar
            tarefa={this.state.selectedTarefa}
            onTarefaSaved={() => {
              this.setState({ displayDialog: false });
              this.componentDidMount();
            }}
          />
        </Dialog>

        <Dialog
          header="Tem a certeza que deseja eliminar esta tarefa?"
          visible={this.state.showEliminarDialog}
          onHide={() => this.setState({ showEliminarDialog: false })}
          style={{ width: "50vw" }}
          modal
        >
          <p className="mt-3">
            Se a tarefa já tiver sido atribuída a um aluno ou a uma turma,
            precisara remover a tarefa do projecto aluno ou da turma
            diretamente.
          </p>

          <div>
            <br />
            <Button
              onClick={async () => {
                try {
                  const { id } = this.props.match.params;
                  await api.put(`tarefa/update/deletedAt/${id}`);

                  this.setState({ showEliminarDialog: false });
                  this.props.history.push("/tarefa-index");
                } catch (error) {
                  console.error("Error deleting task", error);
                }
              }}
              className="p-button-danger"
            >
              Eliminar
            </Button>
            <Button
              onClick={() => this.setState({ showEliminarDialog: false })}
              className="p-button-text"
            >
              Cancelar
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(TarefaVisualizar);
