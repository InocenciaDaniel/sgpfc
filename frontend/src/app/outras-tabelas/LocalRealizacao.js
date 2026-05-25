import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

export class LocalRealizacao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      loading: true,
      error: null,
      selectedConvenioCientifico: null,
      convenioCientificoOptions: [
        { label: "Ensino e Investigação", value: "Ensino e Investigação" },
        { label: "Pesquisa conjunta", value: "Pesquisa conjunta" },
        {
          label: "Intercâmbio de estudantes e professores",
          value: "Intercâmbio de estudantes e professores",
        },
        {
          label: "Compartilhamento de infraestrutura e recursos",
          value: "Compartilhamento de infraestrutura e recursos",
        },
        { label: "Publicações conjuntas", value: "Publicações conjuntas" },
        {
          label: "Desenvolvimento de novas tecnologias",
          value: "Desenvolvimento de novas tecnologias",
        },
        { label: "Financiamento conjunto", value: "Financiamento conjunto" },
        { label: "Propriedade intelectual", value: "Propriedade intelectual" },
      ],
      convenioCientifico: null,
      designacao: "",
      descricao: "",
      pkLocalRealizacao: null,
      isEditMode: false,
    };
    this.toast = React.createRef();
  }

  componentDidMount() {
    const { localRealizacao } = this.props;
    if (localRealizacao && localRealizacao.pkLocalRealizacao) {
      this.setState({ isEditMode: true });
      this.fetchCurso(localRealizacao.pkLocalRealizacao);
    }
  }

  fetchCurso = async (idLocalRealizacao) => {
    try {
      const response = await api.get(
        `localRealizacao/findByPkLocalRealizacao/${idLocalRealizacao}`
      );
      this.setState({
        pkLocalRealizacao: response.data.pkLocalRealizacao,
        designacao: response.data.designacao,
        descricao: response.data.descricao,
        convenioCientifico: response.data.convenioCientifico,
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar Local Realização:", error);
      this.setState({ error, loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      pkLocalRealizacao,
      designacao,
      descricao,
      convenioCientifico,
      isEditMode,
    } = this.state;

    if (!designacao || !descricao || !convenioCientifico) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, preencha todos os local realização.",
        life: 5000,
      });
      return;
    }

    try {
      if (isEditMode) {
        await api.put(`localRealizacao/update`, {
          pkLocalRealizacao,
          designacao,
          descricao,
          convenioCientifico,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Local Realização atualizado com sucesso!",
          life: 5000,
        });
      } else {
        await api.post("localRealizacao/save", {
          designacao,
          descricao,
          convenioCientifico,
        });
        this.toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Local Realização cadastrado com sucesso!",
          life: 5000,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar o local de arealização", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar o local de realização.",
        life: 5000,
      });
    }
  };

  handleConvenioCientificoChange = (e) => {
    this.setState({ convenioCientifico: e.value });
  };

  render() {
    const { designacao, descricao, convenioCientifico } = this.state;
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
              <label htmlFor="convenioCientifico">Convênio Científico</label>
              <Dropdown
                id="convenioCientifico"
                value={convenioCientifico}
                options={this.state.convenioCientificoOptions}
                onChange={this.handleConvenioCientificoChange}
                placeholder="Selecione o convênio científico"
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
export default LocalRealizacao;
