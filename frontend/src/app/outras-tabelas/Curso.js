import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

export class Curso extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      loading: true,
      error: null,
      selectedNivelCurso: null,
      niveisCursoOptions: [
        { label: "Graduação", value: "Graduação" },
        { label: "Pós-graduação", value: "Pós-graduação" },
        { label: "Extensão", value: "Extensão" },
        { label: "Técnico", value: "Técnico" },
      ],
      nivelCurso: null,
      codigo: "",
      designacao: "",
      descricao: "",
      pkCurso: null,
      isEditMode: false,
    };
    this.toast = React.createRef();
  }

  componentDidMount() {
    const { curso } = this.props;
    if (curso && curso.pkCurso) {
      this.setState({ isEditMode: true });
      this.fetchCurso(curso.pkCurso);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  fetchCurso = async (idCurso) => {
    try {
      const response = await api.get(`curso/findByPkCurso/${idCurso}`);
      this.setState({
        pkCurso: response.data.pkCurso,
        codigo: response.data.codigo,
        designacao: response.data.designacao,
        descricao: response.data.descricao,
        nivelCurso: response.data.nivelCurso,
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar curso:", error);
      this.setState({ error, loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { pkCurso, codigo, designacao, descricao, nivelCurso, isEditMode } =
      this.state;

    if (!codigo || !designacao || !descricao || !nivelCurso) {
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
        await api.put(`curso/update`, {
          pkCurso,
          codigo,
          designacao,
          descricao,
          nivelCurso,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Curso atualizado com sucesso!",
          life: 5000,
        });
      } else {
        await api.post("curso/save", {
          codigo,
          designacao,
          descricao,
          nivelCurso,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Curso cadastrado com sucesso!",
          life: 5000,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar o curso", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar o curso.",
        life: 5000,
      });
    }
  };

  handleDelete = async (e) => {
    const { pkCurso } = this.state;
    try {
      const response = await api.delete(
        `curso/deleteById/${pkCurso}/${this.state.usuarioLogado.fkUtilizador.pkUtilizador}`
      );

      console.log("Resposta do servidor:", response.data);

      e.preventDefault();
      return;
      /* this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Curso excluído com sucesso!",
        life: 5000,
      });*/
      //window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir o curso", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao excluir o curso.",
        life: 5000,
      });
    }
  };

  handleNivelCursoChange = (e) => {
    this.setState({ nivelCurso: e.value });
  };

  render() {
    const { codigo, designacao, descricao, nivelCurso } = this.state;
    return (
      <div>
        <Toast ref={this.toast} />
        <form onSubmit={this.handleSubmit}>
          <div className="p-fluid grid">
            <div className="field col-6">
              <label htmlFor="codigo">Código</label>
              <InputText
                required
                id="codigo"
                name="codigo"
                value={codigo}
                type="text"
                className="form-control"
                onChange={(e) => this.setState({ codigo: e.target.value })}
              />
            </div>
            <div className="field col-6">
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
              <label htmlFor="nivelCurso">Nível do Curso</label>
              <Dropdown
                id="nivelCurso"
                value={nivelCurso}
                options={this.state.niveisCursoOptions}
                onChange={this.handleNivelCursoChange}
                placeholder="Selecione um nível"
                className=" form-control"
              />
            </div>
          </div>
          <Button label="Salvar" icon="pi pi-save" type="submit" />
          {this.state.isEditMode && (
            <Button
              label="Excluir"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={this.handleDelete}
              style={{ marginLeft: "10px" }}
            />
          )}
        </form>
      </div>
    );
  }
}
export default Curso;
