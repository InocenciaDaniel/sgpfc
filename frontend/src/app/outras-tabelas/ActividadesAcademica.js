import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

export class ActividadeAcademica extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      loading: true,
      error: null,
      designacao: "",
      descricao: "",
      pkActividadeAcademica: null,
      isEditMode: false,
    };
    this.toast = React.createRef();
  }

  componentDidMount() {
    const { actividadeAcademica } = this.props;
    if (actividadeAcademica && actividadeAcademica.pkActividadesAcademica) {
      this.setState({ isEditMode: true });
      this.fetchUniversidade(actividadeAcademica.pkActividadesAcademica);
    }
  }

  fetchUniversidade = async (idActividadesAcademica) => {
    try {
      const response = await api.get(
        `actividadesAcademica/findByPkActividadesAcademica/${idActividadesAcademica}`
      );
      this.setState({
        pkActividadesAcademica: response.data.pkActividadesAcademica,
        designacao: response.data.designacao,
        descricao: response.data.descricao,
        loading: false,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao buscar actividade académica", error);
      this.setState({ error, loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { pkActividadesAcademica, designacao, descricao, isEditMode } =
      this.state;

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
        await api.put(`actividadesAcademica/update`, {
          pkActividadesAcademica,
          designacao,
          descricao,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Universidade atualizada com sucesso!",
          life: 5000,
        });
      } else {
        await api.post("actividadesAcademica/save", {
          designacao,
          descricao,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Actividade Académica cadastrada com sucesso!",
          life: 5000,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar a actividade académica", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar a actividade académica.",
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
export default ActividadeAcademica;
