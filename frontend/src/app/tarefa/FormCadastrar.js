import React, { Component } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { withRouter } from "react-router-dom";
import { Message } from "primereact/message";
import api from "../axiosConfig";
import { Toast } from "primereact/toast";

class TarefaFormCadastrar extends Component {
  state = {
    error: null,
    usuarioLogado: null,
    pkTarefa: null,
    designacao: "",
    descricao: "",
    uploadObrigatorio: true,
    tipoTarefa: "",
    comecarContarQuando: "",
    observacoes: "",
    peso: "",
    prazo: "",
    toast: null,

    isEditMode: false,
  };

  async componentDidMount() {
    const { tarefa } = this.props;
    if (tarefa && tarefa.pkTarefa) {
      this.setState({ isEditMode: true });
      this.fetchTarefa(tarefa.pkTarefa);
    }
    try {
      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  fetchTarefa = async (idTarefa) => {
    try {
      const response = await api.get(`tarefa/${idTarefa}`);
      this.setState({
        pkTarefa: response.data.pkTarefa,
        designacao: response.data.designacao,
        descricao: response.data.descricao,
        uploadObrigatorio: response.data.uploadObrigatorio,
        tipoTarefa: response.data.tipoTarefa,
        comecarContarQuando: response.data.comecarContarQuando,
        observacoes: response.data.observacoes,
        peso: response.data.peso,
        prazo: response.data.prazo,

        loading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar a tarefa:", error);
      this.setState({ error, loading: false });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleUploadObrigatorioChange = (e) => {
    this.setState({ uploadObrigatorio: e.checked });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const {
      pkTarefa,
      isEditMode,
      designacao,
      descricao,
      uploadObrigatorio,
      tipoTarefa,
      comecarContarQuando,
      observacoes,
      peso,
      prazo,
      usuarioLogado,
    } = this.state;

    if (!tipoTarefa || !designacao || !peso || !prazo) {
      this.setState({
        error: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    try {
      if (isEditMode) {
        await api.put("tarefa/update", {
          pkTarefa,
          designacao,
          descricao,
          uploadObrigatorio,
          tipoTarefa,
          observacoes,
          peso,
          prazo,
          comecarContarQuando,
        });
      } else {
        await api.post("tarefa/save", {
          designacao,
          descricao,
          uploadObrigatorio,
          tipoTarefa,
          observacoes,
          peso,
          prazo,
          comecarContarQuando,
          createdBy: usuarioLogado.fkUtilizador.pkUtilizador,
        });

        this.setState({
          designacao: "",
          descricao: "",
          uploadObrigatorio: true,
          tipoTarefa: "",
          comecarContarQuando: "",
          observacoes: "",
          peso: "",
          prazo: "",
        });
      }

      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Operação realizada com sucesso!",
        life: 3000,
      });

      if (this.props.onTarefaSaved) {
        this.props.onTarefaSaved();
      }
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao realizar essa operação.",
        life: 3000,
      });
      this.setState({
        error: "Erro ao salvar a tarefa. Tente novamente.",
      });
    }
  };

  render() {
    const {
      error,
      usuarioLogado,
      uploadObrigatorio,
      tipoTarefa,
      comecarContarQuando,
      designacao,
      descricao,
      observacoes,
      peso,
      prazo,
    } = this.state;

    const tipoTarefaOptions = [
      { label: "Avaliação dos Seminários", value: "Avaliação dos seminário" },
      { label: "Participação", value: "Participação" },
      {
        label: "Tarefa técnica e analítica",
        value: "Tarefa técnica e analítica",
      },
      {
        label: "Fase de Execução/Desenvolvimento",
        value: "Fase de Execução/Desenvolvimento",
      },
      {
        label: "Apresentação do Relatório de Progresso",
        value: "Apresentação do relatório de progresso",
      },
    ];

    const comecarContarQuandoOptions = [
      { label: "Após a criação da tarefa", value: "Após a criação da tarefa" },
      {
        label: "Depois do fim da tarefa anterior",
        value: "Depois do fim da tarefa anterior",
      },
    ];

    return (
      <div>
        <style>
          {`
            #pr_id_3_content > div > div > div > span > input { width: 94% }
            .p-dropdown-label, .p-inputtext { width: 100%; }
        `}
        </style>
        {usuarioLogado ? (
          <div>
            <Toast ref={(el) => (this.toast = el)} />
            <form onSubmit={this.handleSubmit}>
              <div className="p-fluid" style={{ marginTop: "1px" }}>
                <div className="surface-section surface-card p-5 border-round flex-auto">
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
                  <div
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label htmlFor="disciplina">Designação</label>
                      <InputText
                        required
                        id="designacao"
                        name="designacao"
                        type="text"
                        className="form-control"
                        onChange={this.handleChange}
                        value={designacao}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="coordenador">Peso (%)</label>
                    <InputText
                      id="peso"
                      name="peso"
                      type="number"
                      max={100}
                      min={0}
                      onChange={this.handleChange}
                      value={peso}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="descricao">Descrição</label>
                    <InputTextarea
                      id="descricao"
                      name="descricao"
                      type="text"
                      onChange={this.handleChange}
                      value={descricao}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="prazo">Prazo (Dias)</label>
                    <InputText
                      id="prazo"
                      name="prazo"
                      type="number"
                      min={1}
                      onChange={this.handleChange}
                      value={prazo}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      gridColumn: "span 12 / span 6",
                    }}
                  >
                    <label htmlFor="comecarContarQuando">
                      Começar a contar quando?{" "}
                    </label>
                    <Dropdown
                      required
                      id="comecarContarQuando"
                      name="comecarContarQuando"
                      value={comecarContarQuando}
                      options={comecarContarQuandoOptions}
                      onChange={this.handleChange}
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
                      id="observacoes"
                      name="observacoes"
                      type="text"
                      onChange={this.handleChange}
                      value={observacoes}
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
                    <label htmlFor="uploadObrigatorio">
                      Upload Obrigatorio
                    </label>
                    <Checkbox
                      id="uploadObrigatorio"
                      checked={uploadObrigatorio}
                      onChange={this.handleUploadObrigatorioChange}
                      className="form-control"
                    />
                  </div>
                  <div
                    className="col-2"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginLeft: "auto",
                    }}
                  >
                    <Button
                      type="submit"
                      label="Salvar"
                      className="p-button-outlined mr-2"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(TarefaFormCadastrar);
