import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import api from "../axiosConfig";
import { Dropdown } from "primereact/dropdown";
import TarefaFormCadastrar from "../tarefa/FormCadastrar";
import { Toast } from "primereact/toast";

class AtribuirTarefas extends Component {
  state = {
    usuarioLogado: null,
    id: null,
    turma: null,

    showDialog: false,
    toast: null,

    selectedOption: null,
    tarefaOptions: [],
    templateOptions: [],
    selectedTarefas: [],
    selectedTemplates: [],
    displayDialogTarefa: false,
  };

  async componentDidMount() {
    try {
      const { id, usuarioLogado } = this.props;
      console.log("Turma ID:", id);

      const tarefaResponse = await api.get("tarefa/findAll");
      const tarefaOptions = tarefaResponse.data.map((t) => ({
        label: t.designacao,
        value: t.pkTarefa,
      }));

      const templateResponse = await api.get("template/findAll");
      const templateOptions = templateResponse.data.map((t) => ({
        label: t.designacao,
        value: t.pkTemplate,
      }));

      this.setState({
        id,
        usuarioLogado,
        tarefaOptions,
        templateOptions,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  abrirDialog = () => {
    this.setState({ showDialog: true });
  };

  fecharDialog = () => {
    this.setState({ showDialog: false });
  };

  handleOptionChange = (e) => {
    this.setState({ selectedOption: e.value });
  };

  handleTarefaChange = (e) => {
    this.setState({ selectedTarefas: e.value });
  };

  handleTemplateChange = (e) => {
    this.setState({ selectedTemplates: e.value });
  };

  handleAddTarefa = () => {
    this.setState({ displayDialogTarefa: true });
  };

  handleTarefaSaved = () => {
    this.fetchTarefas();
    this.setState({ displayDialogTarefa: false });
  };

  fetchTarefas = async () => {
    try {
      const response = await api.get("tarefa/findAll");
      const tarefaOptions = response.data.map((e) => ({
        label: e.designacao,
        value: e.pkTarefa,
      }));
      this.setState({ tarefaOptions });
    } catch (error) {
      console.error("Erro ao atualizar tarefaOptions:", error);
    }
  };

  handleSave = async () => {
    const { selectedOption, selectedTarefas, selectedTemplates } = this.state;
    const { id, tabela, usuarioLogado, projecto } = this.props;

    try {
      if (selectedOption === "tarefa") {
        if (selectedTarefas.length > 0) {
          if (tabela === "turma") {
            // Quando a tabela é 'turma',
            await Promise.all(
              selectedTarefas.map(async (tarefa) => {
                await api.post("tarefasAtribuidas/save", {
                  fkTurma: id,
                  fkTarefa: tarefa,
                  createdBy: usuarioLogado,
                  tabela: "Turma",
                  opcao: "Tarefa",
                });
              })
            );

            this.toast.show({
              severity: "success",
              summary: "Sucesso",
              detail: "Tarefas atribuídas a turma com sucesso!",
              life: 3000,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else if (tabela === "estudante") {
            await Promise.all(
              selectedTarefas.map(async (tarefa) => {
                await api.post("tarefasAtribuidas/save", {
                  fkEstudante: id,
                  fkProjecto: projecto,
                  fkTarefa: tarefa,
                  createdBy: usuarioLogado,
                  tabela: "Estudante",
                  opcao: "Tarefa",
                });
              })
            );
            this.toast.show({
              severity: "success",
              summary: "Sucesso",
              detail: "Tarefas atribuídas ao estudante com sucesso!",
              life: 3000,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
      } else if (selectedOption === "template") {
        // Quando a tabela template
        if (selectedTemplates.length > 0) {
          if (tabela === "turma") {
            await Promise.all(
              selectedTemplates.map(async (template) => {
                await api.post("tarefasAtribuidas/save", {
                  fkTurma: id,
                  fkTemplate: template,
                  createdBy: usuarioLogado,
                  tabela: "Turma",
                  opcao: "Template",
                });
              })
            );

            this.toast.show({
              severity: "success",
              summary: "Sucesso",
              detail: "Tarefas atribuídas a turma com sucesso!",
              life: 3000,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else if (tabela === "estudante") {
            await Promise.all(
              selectedTemplates.map(async (template) => {
                await api.post("tarefasAtribuidas/save", {
                  fkEstudante: id,
                  fkProjecto: projecto,
                  fkTemplate: template,
                  createdBy: usuarioLogado,
                  tabela: "Estudante",
                  opcao: "Template",
                });
              })
            );

            this.toast.show({
              severity: "success",
              summary: "Sucesso",
              detail: "Tarefas atribuídas ao estudante com sucesso!",
              life: 3000,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao atribuir tarefas/templates:", error);
      this.state.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Houve um problema ao salvar as tarefas ou templates.",
        life: 3000,
      });
    }
  };

  render() {
    const {
      selectedOption,
      tarefaOptions,
      templateOptions,
      selectedTarefas,
      selectedTemplates,
      displayDialogTarefa,
    } = this.state;

    const optionItems = [
      { label: "Selecionar Tarefa", value: "tarefa" },
      { label: "Selecionar Template", value: "template" },
    ];

    return (
      <div>
        <Toast ref={(el) => (this.toast = el)} />

        <div className="grid">
          <div className="field col-12">
            <br />
            <br />
            <label htmlFor="option">
              Escolhe uma das opções apresentadas abaixo para atribuir tarefas
            </label>
            <Dropdown
              id="option"
              className="w-full"
              value={selectedOption}
              options={optionItems}
              onChange={this.handleOptionChange}
              placeholder="Selecione uma opção"
            />
          </div>

          {selectedOption === "tarefa" && (
            <div className="col-11" style={{ flex: 1, marginRight: 5 }}>
              <label htmlFor="tarefa">Tarefas</label>
              <MultiSelect
                id="tarefa"
                value={selectedTarefas}
                options={tarefaOptions}
                onChange={this.handleTarefaChange}
                placeholder="Selecione as tarefas"
                className="p-inputtext p-component w-full"
                filter={true}
                display="chip"
              />
              <Button
                className="col-1"
                style={{
                  marginTop: 5,
                  width: "2rem",
                  height: "2rem",
                }}
                icon="pi pi-plus"
                onClick={this.handleAddTarefa}
              />
              <Dialog
                header="Adicionar Nova Tarefa"
                visible={displayDialogTarefa}
                style={{ width: "50vw" }}
                onHide={() => this.setState({ displayDialogTarefa: false })}
                modal
              >
                <TarefaFormCadastrar onTarefaSaved={this.fetchTarefas} />
              </Dialog>
            </div>
          )}

          {selectedOption === "template" && (
            <div className="field col-12">
              <label htmlFor="template">Templates</label>
              <MultiSelect
                id="template"
                className="w-full"
                value={selectedTemplates}
                options={templateOptions}
                onChange={this.handleTemplateChange}
                placeholder="Selecione os templates"
                display="chip"
                filter={true}
              />
            </div>
          )}
        </div>
        <br />
        <Button
          label="Atribuir Tarefa"
          outlined
          className="p-button-primary mt-2"
          onClick={this.handleSave}
        />
      </div>
    );
  }
}

export default withRouter(AtribuirTarefas);
