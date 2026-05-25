import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

class TarefaAtribuidaEditar extends Component {
  state = {
    tarefa: null,
    pkTarefasAtribuidas: "",
    designacaoTarefa: "",
    dataEntregaTarefa: null,
    descricaoTarefa: "",
    tarefaAtribuidaA: "",
    tipoTarefa: "",
    uploadObrigatorioTarefa: "",
    observacoesTarefa: "",
    pesoTarefa: "",
    error: null,
    usuarioLogado: null,
    toast: null,
  };

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;
      const tarefaResponse = await api.get(`tarefasAtribuidas/${id}`);

      this.setState({
        pkTarefasAtribuidas: tarefaResponse.data.pkTarefasAtribuidas,
        designacaoTarefa: tarefaResponse.data.designacaoTarefa,
        dataEntregaTarefa: tarefaResponse.data.dataEntregaTarefa
          ? new Date(tarefaResponse.data.dataEntregaTarefa)
          : null,
        descricaoTarefa: tarefaResponse.data.descricaoTarefa,
        tarefaAtribuidaA: tarefaResponse.data.tarefaAtribuidaA,
        tipoTarefa: tarefaResponse.data.tipoTarefa,
        uploadObrigatorioTarefa: tarefaResponse.data.uploadObrigatorioTarefa,
        pesoTarefa: tarefaResponse.data.pesoTarefa,
        observacoesTarefa: tarefaResponse.data.observacoesTarefa,
        tarefa: tarefaResponse.data,
      });
      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleUploadObrigatorioChange = (e) => {
    this.setState({ uploadObrigatorioTarefa: e.checked });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      pkTarefasAtribuidas,
      designacaoTarefa,
      dataEntregaTarefa,
      descricaoTarefa,
      tarefaAtribuidaA,
      tipoTarefa,
      uploadObrigatorioTarefa,
      observacoesTarefa,
      pesoTarefa,
      usuarioLogado,
    } = this.state;

    if (!tipoTarefa || !designacaoTarefa || !pesoTarefa || !dataEntregaTarefa) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao editar tarefa. Tente novamente.",
        life: 5000,
      });
      return;
    }
    try {
      await api.put("tarefasAtribuidas/update", {
        pkTarefasAtribuidas,
        designacaoTarefa,
        descricaoTarefa,
        uploadObrigatorioTarefa,
        tipoTarefa,
        observacoesTarefa,
        pesoTarefa,
        dataEntregaTarefa: dataEntregaTarefa,
        opcao: tarefaAtribuidaA,
        updatedBy: usuarioLogado.fkUtilizador.pkUtilizador,
      });
      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Operação realizada com sucesso!",
        life: 3000,
      });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao editar a tarefa:", error);
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao realizar essa operação.",
        life: 3000,
      });
    }

    //TErminar a implementação
  };

  render() {
    const {
      usuarioLogado,
      designacaoTarefa,
      descricaoTarefa,
      dataEntregaTarefa,
      pesoTarefa,
      tipoTarefa,
      observacoesTarefa,
      tarefaAtribuidaA,
      uploadObrigatorioTarefa,
    } = this.state;

    const tipoTarefaOptions = [
      { label: "Avaliação dos Seminários", value: "Avaliação dos seminário" },
      { label: "Participação", value: "Participação" },
      {
        label: "Apresentação do Relatório de Progresso",
        value: "Apresentação do relatório de progresso",
      },
    ];

    const tarefaAtribuidaOptions = [
      { label: "Turma", value: "Turma" },
      { label: "Estudante", value: "Estudante" },
    ];

    return (
      <div>
        {usuarioLogado ? (
          <div>
            <Toast ref={(el) => (this.toast = el)} />

            <form className="p-7" onSubmit={this.handleSubmit}>
              <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
                <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                  <li>
                    <a
                      href="/tarefa-index"
                      className="text-500 no-underline line-height-3 cursor-pointer"
                    >
                      Tarefas
                    </a>
                  </li>
                  <li className="px-2">
                    <i className="pi pi-angle-right text-500 line-height-3"></i>
                  </li>
                  <li>
                    <span className="text-900 line-height-3">
                      Mais Detalhes
                    </span>
                  </li>
                  <li className="ml-auto">
                    <Button
                      type="submit"
                      label="Salvar Alterações"
                      className="p-button-outlined mr-2"
                    />
                  </li>
                </ul>
              </div>

              <div className="p-fluid" style={{ marginTop: "1px" }}>
                <div className="surface-section surface-card p-5 border-round flex-auto">
                  <div
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label htmlFor="designacaoTarefa">Designação</label>
                      <InputText
                        required
                        id="designacaoTarefa"
                        name="designacaoTarefa"
                        type="text"
                        className="form-control"
                        onChange={this.handleChange}
                        value={designacaoTarefa}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="pesoTarefa">Peso (%)</label>
                    <InputText
                      id="pesoTarefa"
                      name="pesoTarefa"
                      type="number"
                      max={100}
                      min={0}
                      onChange={this.handleChange}
                      value={pesoTarefa}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="descricaoTarefa">Descrição</label>
                    <InputTextarea
                      id="descricaoTarefa"
                      name="descricaoTarefa"
                      type="text"
                      onChange={this.handleChange}
                      value={descricaoTarefa}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="descricao">Observações</label>
                    <InputTextarea
                      id="observacoesTarefa"
                      name="observacoesTarefa"
                      type="text"
                      onChange={this.handleChange}
                      value={observacoesTarefa}
                    />
                  </div>
                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="tipoTarefa">Tipo de Tarefa </label>
                    <Dropdown
                      required
                      id="tipoTarefa"
                      name="tipoTarefa"
                      value={tipoTarefa}
                      options={tipoTarefaOptions}
                      onChange={this.handleChange}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="tarefaAtribuidaA">Tarefa Atribuida  A</label>
                    <Dropdown
                    disabled
                      required
                      id="tarefaAtribuidaA"
                      name="tarefaAtribuidaA"
                      value={tarefaAtribuidaA}
                      options={tarefaAtribuidaOptions}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="dataEntregaTarefa">Data de Entrega</label>
                    <Calendar
                      required
                      minDate={new Date()}
                      id="dataEntregaTarefa"
                      name="dataEntregaTarefa"
                      value={dataEntregaTarefa}
                      placeholder={
                        dataEntregaTarefa
                          ? dataEntregaTarefa.toLocaleDateString()
                          : "Selecione uma data"
                      }
                      className="form-control"
                      onChange={(e) =>
                        this.setState({ dataEntregaTarefa: e.target.value })
                      }
                      showIcon
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="uploadObrigatorio">
                      Upload Obrigatorio
                    </label>
                    <Checkbox
                      id="uploadObrigatorio"
                      checked={uploadObrigatorioTarefa}
                      onChange={this.handleUploadObrigatorioChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div
                className="back-button"
                style={{ marginTop: "20px", textAlign: "left" }}
              >
              </div>
            </form>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(TarefaAtribuidaEditar);
