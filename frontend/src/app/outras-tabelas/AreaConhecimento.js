import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

export class AreaConhecimento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      loading: true,
      error: null,
      designacao: "",
      descricao: "",
      pkAreaConhecimento: null,
      actividadeAcademica: null,
      actividadeAcademicaOptions: [],
      isEditMode: false,
    };
    this.toast = React.createRef();
  }

  componentDidMount = async () => {
    const { areaConhecimento } = this.props;
    if (areaConhecimento && areaConhecimento.pkAreaConhecimento) {
      this.setState({ isEditMode: true });
      this.fetchDisciplina(areaConhecimento.pkAreaConhecimento);
    }

    const actividadeAcademicaResponse = await api.get(
      "actividadesAcademica/findAll"
    );
    const actividadeAcademicaOptions = actividadeAcademicaResponse.data.map(
      (c) => ({
        label: c.designacao,
        value: c.pkActividadesAcademica,
      })
    );

    this.setState({ actividadeAcademicaOptions });
  };

  fetchDisciplina = async (idAreaConhecimento) => {
    try {
      const response = await api.get(
        `areaConhecimento/findByPkAreaConhecimento/${idAreaConhecimento}`
      );
      this.setState({
        pkAreaConhecimento: response.data.pkAreaConhecimento,
        designacao: response.data.designacao,
        descricao: response.data.descricao,
        actividadeAcademica:
          response.data.fkActividadesAcademica.pkActividadesAcademica,
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar area conhecimento:", error);
      this.setState({ error, loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      pkAreaConhecimento,
      designacao,
      descricao,
      actividadeAcademica,
      isEditMode,
    } = this.state;

    if (!designacao || !descricao || !actividadeAcademica) {
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
        await api.put(`areaConhecimento/update`, {
          pkAreaConhecimento,
          designacao,
          descricao,
          fkActividadesAcademica: actividadeAcademica,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Área Conhecimento atualizado com sucesso!",
          life: 5000,
        });
      } else {
        await api.post("areaConhecimento/save", {
          designacao,
          descricao,
          fkActividadesAcademica: actividadeAcademica,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Área Conhecimento cadastrado com sucesso!",
          life: 5000,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar a área de conhecimento", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar a área de conhecimento.",
        life: 5000,
      });
    }
  };

  handleActividadeAcademicaChange = (e) => {
    this.setState({ actividadeAcademica: e.value });
  };

  render() {
    const { designacao, descricao, actividadeAcademica } = this.state;
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
            <div className="field col-12">
              <label htmlFor="curso">Actividades Académicas</label>
              <Dropdown
                id="curso"
                value={actividadeAcademica}
                options={this.state.actividadeAcademicaOptions}
                onChange={this.handleActividadeAcademicaChange}
                placeholder="Selecione a actividade académica"
                className=" form-control"
              />
            </div>
          </div>
          <Button label="Salvar" icon="pi pi-save" type="submit" />
        </form>
      </div>
    );
  }
}
export default AreaConhecimento;
