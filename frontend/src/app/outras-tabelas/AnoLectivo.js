import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";

export class AnoLectivo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      loading: true,
      error: null,
      designacao: "",
      dataFim: null,
      dataInicio: null,
      pkAnoLectivo: null,
      isEditMode: false,
    };
    this.toast = React.createRef();
  }

  componentDidMount() {
    const { AnoLectivo } = this.props;
    if (AnoLectivo && AnoLectivo.pkAnoLectivo) {
      this.setState({ isEditMode: true });
      this.fetchAnoLectivo(AnoLectivo.pkAnoLectivo);
    }
  }

  fetchAnoLectivo = async (idAnoLectivo) => {
    try {
      const response = await api.get(
        `anoLectivo/findByPkAnoLectivo/${idAnoLectivo}`
      );

      const { dataInicio, dataFim } = response.data;

      this.setState({
        pkAnoLectivo: response.data.pkAnoLectivo,
        designacao: response.data.designacao,
        dataInicio: dataInicio ? new Date(dataInicio) : null,
        dataFim: dataFim ? new Date(dataFim) : null,
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar Ano Lectivo:", error);
      this.setState({ error, loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { pkAnoLectivo, designacao, dataInicio, dataFim, isEditMode } =
      this.state;

    if (!designacao || !dataInicio || !dataFim) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, preencha todos os campos.",
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
      if (isEditMode) {
        await api.put(`anoLectivo/update`, {
          pkAnoLectivo,
          designacao,
          dataInicio,
          dataFim,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Ano Lectivo atualizado com sucesso!",
          life: 5000,
        });
      } else {
        await api.post("anoLectivo/save", {
          designacao,
          dataInicio,
          dataFim,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Ano Lectivo cadastrado com sucesso!",
          life: 5000,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar o ano lectivo", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar o ano lectivo.",
        life: 5000,
      });
    }
  };

  render() {
    const { designacao, dataInicio, dataFim } = this.state;
    return (
      <div>
        <Toast ref={this.toast} />
        <form onSubmit={this.handleSubmit}>
          <div className="p-fluid grid">
            <div className="field col-12">
              <label htmlFor="designacao">Designação</label>
              <InputText
                required
                id="designacao"
                name="designacao"
                value={designacao}
                type="text"
                className="form-control"
                onChange={(e) => this.setState({ designacao: e.target.value })}
              />
            </div>
            <div className="field col-6">
              <label htmlFor="dataInicio">Data Inicio do Ano Lectivo</label>

              <Calendar
                required
                id="dataInicio"
                name="dataInicio"
                value={dataInicio}
                placeholder={
                  dataInicio
                    ? dataInicio.toLocaleDateString()
                    : "Selecione uma data"
                }
                className="form-control"
                onChange={(e) => this.setState({ dataInicio: e.target.value })}
                showIcon
              />
            </div>
            <div className="field col-6">
              <label htmlFor="dataFimSemestre">Data Fim do Ano Lectivo</label>
              <Calendar
                required
                id="dataFim"
                name="dataFim"
                value={dataFim}
                placeholder={
                  dataFim ? dataFim.toLocaleDateString() : "Selecione uma data"
                }
                className="form-control"
                onChange={(e) => this.setState({ dataFim: e.target.value })}
                showIcon
              />
            </div>
          </div>
          <Button label="Salvar" icon="pi pi-save" type="submit" />
        </form>
      </div>
    );
  }
}
export default AnoLectivo;
