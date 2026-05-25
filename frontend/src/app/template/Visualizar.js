import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import api from "../axiosConfig";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { OrderList } from "primereact/orderlist";

class TemplateVisualizar extends Component {
  state = {
    usuarioLogado: null,
    template: {},
    tarefas: [],
    tarefasNaoAssociadas: [],
    tarefasSelecionadas: [],
    error: "",
    designacao: "",

    toast: null,
    displayDialog: false,
  };

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;
      const templateResponse = await api.get(`template/findById/${id}`);
      const tarefasResponse = await api.get(
        `templateTarefa/findByFkTemplate/${id}`
      );

      const todasTarefasResponse = await api.get(`tarefa/findAll`);
      const todasTarefas = todasTarefasResponse?.data || [];
      const tarefasAssociadas = tarefasResponse?.data || [];
      const tarefasNaoAssociadas = todasTarefas.filter(
        (tarefa) =>
          !tarefasAssociadas.some(
            (t) => t.fkTarefa.pkTarefa === tarefa.pkTarefa
          )
      );

      this.setState({
        template: templateResponse?.data,
        designacao: templateResponse?.data.designacao,
        tarefas: tarefasAssociadas,
        tarefasNaoAssociadas,
      });

      this.setState({
        tarefasSelecionadas: this.state.tarefas.map((t) => t.pkTemplateTarefa), // ou outro campo relevante
      });
    } catch (error) {
      console.error("Error fetching data", error);
      this.setState({ error: "Erro ao carregar os dados do template." });
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  onEditClick = (e) => {
    e.preventDefault();
    this.setState({
      displayDialog: true,
    });
  };

  tarefaTemplate = (tarefa) => {
    return (
      <div className="flex align-items-center">
        {tarefa.fkTarefa.designacao}
      </div>
    );
  };

  handleTemplateSubmit = async (e) => {
    //Implementar a lógica de actualizar o template
    e.preventDefault();
    const { id } = this.props.match.params;
    const { designacao, tarefasSelecionadas } = this.state;

    console.log("id", id);
    console.log("designacao", designacao);
    console.log("tarefasSelecionadas", tarefasSelecionadas);

    try {
      await api.put(`template/update`, {
        pkTemplate: id,
        designacao,
      });
      console.log("Tarefas Selecioandas", tarefasSelecionadas);

      await api.delete(`templateTarefa/deleteByFkTemplate/${id}`);

      await Promise.all(
        tarefasSelecionadas.map(async (tarefa, index) => {
          console.log("tarefasSelecionadas", tarefa);
          await api.post("templateTarefa/save", {
            fkTemplate: id,
            fkTarefa: tarefa,
            posicaoTarefaTemplate: index + 1,
          });
        })
      );

      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Template actualizado com sucesso.",
        life: 3000,
      });
      // window.location.reload();
    } catch (error) {
      console.error("Erro ao actualizar o template", error);
      this.setState({ error: "Erro ao actualizar o template." });
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao actualizar o template.",
        life: 3000,
      });
    }
  };

  salvarNovaOrdem = async () => {
    const { tarefas } = this.state;

    try {
      await Promise.all(
        tarefas.map(async (tarefa, index) => {
          await api.put("templateTarefa/updateTarefasOrder", {
            pkTemplateTarefa: tarefa.pkTemplateTarefa,
            posicaoTarefaTemplate: index + 1,
          });
        })
      );

      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Ordem das tarefas actualizada com sucesso.",
        life: 3000,
      });
    } catch (error) {
      console.error("Erro ao salvar a nova ordem", error);
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao actualizar a ordem das tarefas.",
        life: 3000,
      });
    }
  };

  render() {
    const {
      usuarioLogado,
      template,
      tarefas,
      designacao,
      error,
      tarefasNaoAssociadas,
      tarefasSelecionadas,
    } = this.state;

    return (
      <div>
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
                    Template
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">Mais Detalhes</span>
                </li>
                <li className="ml-auto">
                  <a
                    href={`/template-editar/${template.pkTemplate}`}
                    onClick={(e) => this.onEditClick(e)}
                    style={{
                      marginTop: "0.5rem",
                      textDecoration: "none",
                      color: "#123456",
                    }}
                  >
                    Editar
                  </a>
                </li>
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
                        {template.designacao}
                      </div>
                    </div>
                  </div>
                  <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Designação
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {template.designacao}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Tarefas
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <OrderList
                          value={tarefas}
                          onChange={(e) => {
                            this.setState({ tarefas: e.value }, () => {
                              this.salvarNovaOrdem();
                            });
                          }}
                          itemTemplate={this.tarefaTemplate}
                          placeholder="Arraste as tarefas para reordenar"
                        />
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
          header="Editar Template"
          visible={this.state.displayDialog}
          onHide={() => this.setState({ displayDialog: false })}
          style={{ width: "50vw" }}
          modal
        >
          <form onSubmit={this.handleTemplateSubmit}>
            <div className="surface-section surface-card p-5 border-round flex-auto">
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label htmlFor="designacao">Designação</label>
                  <InputText
                    id="designacao"
                    name="designacao"
                    value={designacao}
                    onChange={(e) =>
                      this.setState({ designacao: e.target.value })
                    }
                    required
                    className="p-inputtext p-component w-full"
                  />
                </div>
              </div>
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
                className="grid"
              >
                <div style={{ flex: 1, marginRight: 5 }} className="col-11">
                  <label htmlFor="tarefas">Tarefas</label>
                  <MultiSelect
                    id="tarefas"
                    value={tarefasSelecionadas}
                    options={[...tarefas, ...tarefasNaoAssociadas].map(
                      (tarefa) => ({
                        label: tarefa.fkTarefa
                          ? tarefa?.fkTarefa.designacao
                          : tarefa.designacao,
                        value: tarefa.pkTemplateTarefa || tarefa.pkTarefa,
                      })
                    )}
                    onChange={(e) =>
                      this.setState({ tarefasSelecionadas: e.value })
                    }
                    filter={true}
                    placeholder="Selecione as tarefas"
                    display="chip"
                    required
                    className="p-inputtext p-component w-full"
                  />
                </div>
                <Button
                  label=""
                  icon="pi pi-plus"
                  className="p-button-label col-1"
                  style={{ marginTop: 5, width: "2rem", height: "2rem" }}
                  onClick={() => this.setState({ displayDialogTarefa: true })}
                />
              </div>

              <Button
                type="submit"
                label="Salvar"
                className="p-button-outlined mr-2"
              />
            </div>
          </form>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(TemplateVisualizar);
