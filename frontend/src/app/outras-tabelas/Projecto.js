import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

export class Projecto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      loading: true,
      error: null,

      tema: null,

      pkTema: "",
      temaTitulo: "",
      temaDescricao: "",
      temaJustificativa: "",
      temaObservacoes: "",
      temaDiferencial: "",
      temaEstado: "",
      temaAreaConhecimento: null,
      temaLinhaPesquisaOptions: [],
      temaOrientadoresOptions: [],
      temaLocalRealizacaoOptions: [],
      temaAreaConhecimentoOptions: [],
      temaEstudantesOptions: [],
      temaLinhaPesquisa: null,
      temaLocalRealizacao: null,

      projecto: null,
      projectoTurma: null,
      projectoOrientador: null,
      projectoEstudante: null,
      projectoDataInicio: null,
      projectoDataFim: null,
      projectoDataDefesa: null,
      projectoNotaObtida: "",
      //projectoEstado: "",
      projectoZipUrl: "",
      projectoRelatorioFinalUrl: "",
      //projectoProgresso: "",
      projectoPrivacidade: null,
      projectoPrivacidadeOptions: [
        { label: "Público", value: "Público" },
        { label: "Privado", value: "Privado" },
      ],
      projectoCreatedAt: "",

      pkProjecto: null,
      isEditMode: false,
    };
    this.toast = React.createRef();
  }

  async componentDidMount() {
    const { projecto } = this.props;

    const linhaPesquisaResponse = await api.get("linhaPesquisa/findAll");
    const temaLinhaPesquisaOptions = linhaPesquisaResponse.data.map((l) => ({
      label: l.designacao,
      value: l.pkLinhaPesquisa,
    }));

    const orientadoresResponse = await api.get("utilizador/findAllOrientador");
    const temaOrientadoresOptions = orientadoresResponse.data.map((o) => ({
      label: o.nome,
      value: o.pkUtilizador,
    }));

    const estudanteResponse = await api.get(
      "utilizador/findAllEstudanteMatriculado"
    );
    const temaEstudantesOptions = estudanteResponse.data.map((o) => ({
      label: o.nome,
      value: o.pkUtilizador,
    }));

    const localRelaizacaoResponse = await api.get("localRealizacao/findAll");
    const temaLocalRealizacaoOptions = localRelaizacaoResponse.data.map(
      (l) => ({
        label: `${l.designacao} ( ${l.convenioCientifico} )`,
        value: l.pkLocalRealizacao,
      })
    );

    const areaConhecimentoResponse = await api.get("areaConhecimento/findAll");
    const temaAreaConhecimentoOptions = areaConhecimentoResponse.data.map(
      (a) => ({ label: a.designacao, value: a.pkAreaConhecimento })
    );

    this.setState({
      temaLinhaPesquisaOptions,
      temaOrientadoresOptions,
      temaLocalRealizacaoOptions,
      temaAreaConhecimentoOptions,
      temaEstudantesOptions,
      loading: false,
    });

    if (projecto && projecto.pkProjecto) {
      this.setState({ isEditMode: true });
      this.fetchProjecto(projecto.pkProjecto);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  fetchProjecto = async (idProjecto) => {
    try {
      const response = await api.get(`projecto/findByPkProjecto/${idProjecto}`);
      this.setState({
        pkProjecto: response.data.idProjecto,
      });
    } catch (error) {
      console.error("Erro ao buscar projecto:", error);
      this.setState({ error, loading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      temaTitulo,
      temaDescricao,
      temaJustificativa,
      temaObservacoes,
      temaDiferencial,
      temaLinhaPesquisa,
      temaLocalRealizacao,
      projectoOrientador,
      temaAreaConhecimento,
      projectoEstudante,
      projectoPrivacidade,
      projectoDataDefesa,
      projectoDataFim,
      projectoDataInicio,
      projectoNotaObtida,
      projectoRelatorioFinalUrl,
      projectoZipUrl,
    } = this.state;
    let orientadorPropostoEmail = null;
    try {
      const response = await api.get(
        `conta/findByFkUtilizador/${projectoOrientador}`
      );
      orientadorPropostoEmail = response.data.email;

      const formData = new FormData();

      formData.append("projectoRelatorioFinalUrl", projectoRelatorioFinalUrl);
      formData.append("projectoZipUrl", projectoZipUrl);

      formData.append(
        "form",
        new Blob(
          [
            JSON.stringify({
              titulo: temaTitulo,
              descricao: temaDescricao,
              justificativa: temaJustificativa,
              observacoes: temaObservacoes,
              diferencial: temaDiferencial,
              linhaPesquisa: temaLinhaPesquisa,
              localRealizacao: temaLocalRealizacao,
              projectoOrientador,
              areaConhecimento: temaAreaConhecimento,
              temaPropostoPor:
                this.state.usuarioLogado.fkUtilizador.pkUtilizador,
              projectoEstudante,
              projectoPrivacidade,
              projectoDataDefesa,
              projectoDataFim,
              projectoDataInicio,
              projectoNotaObtida,
              orientadorPropostoEmail,
            }),
          ],
          { type: "application/json" }
        )
      );

      await api.post("repositorio/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Projecto cadastrado com sucesso!",
        life: 5000,
      });

      window.location.reload();
      console.log(this.state);
    } catch (error) {
      console.error("Erro ao salvar o projecto", error);
      alert("Erro ao salvar projecto.");
    }
  };

  render() {
    const {
      temaTitulo,
      temaDescricao,
      temaJustificativa,
      temaObservacoes,
      temaDiferencial,
      temaLinhaPesquisa,
      temaLocalRealizacao,
      temaLocalRealizacaoOptions,
      temaAreaConhecimentoOptions,
      temaOrientadoresOptions,
      projectoOrientador,
      temaAreaConhecimento,
      temaLinhaPesquisaOptions,
      temaEstudantesOptions,
      projectoEstudante,
      projectoPrivacidade,
      projectoPrivacidadeOptions,
      projectoDataDefesa,
      projectoDataFim,
      projectoDataInicio,
      projectoNotaObtida,
    } = this.state;

    return (
      <div>
        <Toast ref={this.toast} />
        <form onSubmit={this.handleSubmit}>
          <div className="p-fluid grid">
            <div className="field col-12">
              <label htmlFor="temaTitulo">Título</label>
              <InputText
                required
                id="temaTitulo"
                name="temaTitulo"
                value={temaTitulo}
                type="text"
                className="form-control"
                onChange={(e) => this.setState({ temaTitulo: e.target.value })}
              />
            </div>
            <div className="field col-6">
              <label htmlFor="temaDescricao">Descrição</label>
              <InputTextarea
                required
                id="temaDescricao"
                name="temaDescricao"
                value={temaDescricao}
                type="text"
                className="form-control"
                onChange={(e) =>
                  this.setState({ temaDescricao: e.target.value })
                }
              />
            </div>
            <div className="field col-6">
              <label htmlFor="temaJustificativa">Justificativa</label>
              <InputTextarea
                required
                id="temaJustificativa"
                name="temaJustificativa"
                value={temaJustificativa}
                type="text"
                className="form-control"
                onChange={(e) =>
                  this.setState({ temaJustificativa: e.target.value })
                }
              />
            </div>
            <div className="field col-6">
              <label htmlFor="temaObservacoes">Observações</label>
              <InputTextarea
                required
                id="temaObservacoes"
                name="temaObservacoes"
                value={temaObservacoes}
                type="text"
                className="form-control"
                onChange={(e) =>
                  this.setState({ temaObservacoes: e.target.value })
                }
              />
            </div>
            <div className="field col-6">
              <label htmlFor="temaDiferencial">Diferencial</label>
              <InputTextarea
                required
                id="temaDiferencial"
                name="temaDiferencial"
                value={temaDiferencial}
                type="text"
                className="form-control"
                onChange={(e) =>
                  this.setState({ temaDiferencial: e.target.value })
                }
              />
            </div>
            <div className="field col-6">
              <label htmlFor="projectoDataInicio">
                Data Início do Projecto
              </label>
              <Calendar
                required
                id="projectoDataInicio"
                name="projectoDataInicio"
                value={projectoDataInicio}
                placeholder={
                  projectoDataInicio
                    ? projectoDataInicio.toLocaleDateString()
                    : ""
                }
                className="form-control"
                onChange={(e) =>
                  this.setState({ projectoDataInicio: e.target.value })
                }
                showIcon
              />
            </div>
            <div className="field col-6">
              <label htmlFor="projectoDataInicio">Data Fim do Projecto</label>
              <Calendar
                required
                id="projectoDataFim"
                name="projectoDataFim"
                value={projectoDataFim}
                placeholder={
                  projectoDataFim ? projectoDataFim.toLocaleDateString() : ""
                }
                className="form-control"
                onChange={(e) =>
                  this.setState({ projectoDataFim: e.target.value })
                }
                showIcon
              />
            </div>
            <div className="field col-6">
              <label htmlFor="temaLinhaPesquisa">Orientador</label>
              <Dropdown
                id="temaLinhaPesquisa"
                value={projectoOrientador}
                options={temaOrientadoresOptions}
                onChange={(e) => this.setState({ projectoOrientador: e.value })}
                placeholder=""
                className=" form-control"
              />
            </div>
            <div className="field col-6">
              <label htmlFor="temaEstudante">Estudante</label>
              <Dropdown
                id="temaEstudante"
                value={projectoEstudante}
                options={temaEstudantesOptions}
                onChange={(e) => this.setState({ projectoEstudante: e.value })}
                placeholder=""
                className=" form-control"
              />
              {/*<Button
                label=""
                icon="pi pi-plus"
                className="p-button-label"
                style={{ marginTop: 10 }}
                onClick={() =>
                  this.setState({ displayDialogCadastrarEstudante: true })
                }
              />*/}
            </div>
            <div className="field col-6">
              <label htmlFor="temaLinhaPesquisa">Linha de Pesquisa</label>
              <Dropdown
                id="temaLinhaPesquisa"
                value={temaLinhaPesquisa}
                options={temaLinhaPesquisaOptions}
                onChange={(e) => this.setState({ temaLinhaPesquisa: e.value })}
                placeholder=""
                className=" form-control"
              />
            </div>
            <div className="field col-6">
              <label htmlFor="temaAreaConhecimento">Área de Conhecimento</label>
              <Dropdown
                id="temaAreaConhecimento"
                value={temaAreaConhecimento}
                options={temaAreaConhecimentoOptions}
                onChange={(e) =>
                  this.setState({ temaAreaConhecimento: e.value })
                }
                placeholder=""
                className=" form-control"
              />
            </div>
            <div className="field col-6">
              <label htmlFor="temaLocalRealizacao">Local de Realização</label>
              <Dropdown
                id="temaLocalRealizacao"
                value={temaLocalRealizacao}
                options={temaLocalRealizacaoOptions}
                onChange={(e) =>
                  this.setState({ temaLocalRealizacao: e.value })
                }
                placeholder=""
                className=" form-control"
              />
            </div>
            <div className="field col-6">
              <label htmlFor="projectoDataInicio">
                Data Defesa do Projecto
              </label>
              <Calendar
                required
                id="projectoDataDefesa"
                name="projectoDataDefesa"
                value={projectoDataDefesa}
                placeholder={
                  projectoDataDefesa
                    ? projectoDataDefesa.toLocaleDateString()
                    : ""
                }
                className="form-control"
                onChange={(e) =>
                  this.setState({ projectoDataDefesa: e.target.value })
                }
                showIcon
              />
            </div>
            <div className="field col-6">
              <label htmlFor="projectoNotaObtida">Nota Obtida</label>
              <InputText
                required
                id="projectoNotaObtida"
                name="projectoNotaObtida"
                value={projectoNotaObtida}
                type="number"
                max={20}
                min={10}
                className="form-control"
                onChange={(e) =>
                  this.setState({ projectoNotaObtida: e.target.value })
                }
              />
            </div>
            <div className="field col-6">
              <label htmlFor="projectoPrivacidade">Privacidade</label>
              <Dropdown
                id="projectoPrivacidade"
                value={projectoPrivacidade}
                options={projectoPrivacidadeOptions}
                onChange={(e) =>
                  this.setState({ projectoPrivacidade: e.value })
                }
                className=" form-control"
              />
            </div>
            <div className="field col-6">
              <FileUpload
                name="projectoRelatorioFinalUrl"
                accept=".docx,.doc,.pdf"
                onSelect={(e) => {
                  const file = e.files[0];
                  this.setState({ projectoRelatorioFinalUrl: file });
                }}
                chooseLabel="Upload Relatório final (.docx, .doc, .pdf)"
                mode="basic"
                className="p-d-block"
                required
              />
            </div>
            <div className="field col-6">
              <FileUpload
                name="projectoZipUrl"
                accept=".zip"
                onSelect={(e) => {
                  const file = e.files[0];
                  this.setState({ projectoZipUrl: file });
                }}
                chooseLabel="Upload Código/projecto (.zip)"
                mode="basic"
                className="p-d-block"
                required
              />
            </div>
          </div>
          <hr />
          <br />
          <Button label="Salvar" icon="pi pi-save" type="submit" />
        </form>
      </div>
    );
  }
}
export default Projecto;
