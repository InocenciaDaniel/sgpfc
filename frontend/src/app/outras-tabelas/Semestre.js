import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

export class Semestre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      loading: true,
      error: null,
      designacao: "",
      descricao: "",
      pkSemestre: null,
      isEditMode: false,
    };
    this.toast = React.createRef();
  }

  componentDidMount() {
    const { semestre } = this.props;
    if (semestre && semestre.pkSemestre) {
      this.setState({ isEditMode: true });
      this.fetchCurso(semestre.pkSemestre);
    }
  }

  fetchCurso = async (idSemestre) => {
    try {
      const response = await api.get(`semestre/findByPkSemestre/${idSemestre}`);
      this.setState({
        pkSemestre: response.data.pkSemestre,
        designacao: response.data.designacao,
        descricao: response.data.descricao,
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar semestre:", error);
      this.setState({ error, loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { pkSemestre, designacao, descricao, isEditMode } = this.state;

    if (!designacao || !descricao) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, preencha todos os campos.",
        life: 5000,
      });
      return;
    }

    try {
      if (isEditMode) {
        await api.put(`semestre/update`, {
          pkSemestre,
          designacao,
          descricao,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Semestre atualizado com sucesso!",
          life: 5000,
        });
      } else {
        await api.post("semestre/save", {
          designacao,
          descricao,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Semestre cadastrado com sucesso!",
          life: 5000,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar o semestre", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar o semestre.",
        life: 5000,
      });
    }
  };

  render() {
    const { designacao, descricao } = this.state;
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
            <div className="field col-12">
              <label htmlFor="descricao">Descrição</label>
              <InputTextarea
                required
                id="descricao"
                name="descricao"
                value={descricao}
                type="text"
                className="form-control"
                onChange={(e) => this.setState({ descricao: e.target.value })}
              />
            </div>
          </div>
          <Button label="Salvar" icon="pi pi-save" type="submit" />
        </form>
      </div>
    );
  }
}
export default Semestre;
