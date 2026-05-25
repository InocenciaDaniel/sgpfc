import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

export class Disciplina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      loading: true,
      error: null,
      codigo: "",
      designacao: "",
      descricao: "",
      pkDisciplina: null,
      curso: null,
      cursoOptions: [],
      isEditMode: false,
    };
    this.toast = React.createRef();
  }

  componentDidMount = async () => {
    const { disciplina } = this.props;
    if (disciplina && disciplina.pkDisciplina) {
      this.setState({ isEditMode: true });
      this.fetchDisciplina(disciplina.pkDisciplina);
    }

    const cursoResponse = await api.get("curso/findAll");
    const cursoOptions = cursoResponse.data.map((c) => ({
      label: c.designacao,
      value: c.pkCurso,
    }));

    this.setState({ cursoOptions });
  };

  fetchDisciplina = async (idDisciplina) => {
    try {
      const response = await api.get(
        `disciplina/findByPkDisciplina/${idDisciplina}`
      );
      this.setState({
        pkDisciplina: response.data.pkDisciplina,
        codigo: response.data.codigo,
        designacao: response.data.designacao,
        descricao: response.data.descricao,
        curso: response.data.fkCurso.pkCurso,
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar disciplina:", error);
      this.setState({ error, loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { pkDisciplina, codigo, designacao, descricao, curso, isEditMode } =
      this.state;

    if (!codigo || !designacao || !descricao || !curso) {
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
        await api.put(`disciplina/update`, {
          pkDisciplina,
          codigo,
          designacao,
          descricao,
          fkCurso: curso,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Disciplina atualizado com sucesso!",
          life: 5000,
        });
      } else {
        await api.post("disciplina/save", {
          codigo,
          designacao,
          descricao,
          fkCurso: curso,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Disciplina cadastrado com sucesso!",
          life: 5000,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar a disciplina", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar a disciplina.",
        life: 5000,
      });
    }
  };

  handleCursoChange = (e) => {
    this.setState({ curso: e.value });
  };

  render() {
    const { codigo, designacao, descricao, curso } = this.state;
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
              <label htmlFor="curso">Curso</label>
              <Dropdown
                id="curso"
                value={curso}
                options={this.state.cursoOptions}
                onChange={this.handleCursoChange}
                placeholder="Selecione o curso"
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
export default Disciplina;
