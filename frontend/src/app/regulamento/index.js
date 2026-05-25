import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import api from "../axiosConfig";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import "../../assets/styles/tabela.css";

class RegulamentoVisualizar extends Component {
  state = {
    usuarioLogado: null,
    data: null,
    loading: true,
    error: null,
    globalFilter: null,
    isNewModalVisible: false,
    designacao: "",
    descricao: "",
    ficheiro: "",
    dataActualizacao: "",
    estado: "",
    curso: null,
    cursoOptions: [],
  };

  fetchData = async () => {
    try {
      const response = await api.get("regulamento/findAll", {
        withCredentials: true, // Inclui cookies na requisição, caso necessário
      });

      const cursoResponse = await api.get("curso/findAll", {
        withCredentials: true, // Inclui cookies na requisição, caso necessário
      });
      const cursoOptions = cursoResponse.data.map((c) => ({
        label: c.designacao,
        value: c.pkCurso,
      }));

      this.setState({
        data: response.data,
        loading: false,
        cursoOptions,
      });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  componentDidMount() {
    this.fetchData();

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
    console.log(usuario);
  }

  setGlobalFilter = (e) => {
    this.setState({ globalFilter: e.target.value });
  };

  // Função para formatar a data
  formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  handleCursoChange = (e) => {
    this.setState({ curso: e.value });
  };

  actualizarNovo = () => {
    this.setState({
      isNewModalVisible: true,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { codigo, designacao, descricao, fkCurso } = this.state;
    try {
      await api.post("regulamento/save", {
        codigo,
        designacao,
        descricao,
        fkCurso,
      });
      this.props.history.push("/disciplina");
    } catch (error) {
      console.error("Erro ao salvar a disciplina", error);
    }
  };

  hideNewModal = () => {
    this.setState({ isNewModalVisible: false });
  };

  renderNewModalContent = () => {
    return (
      <div>
        <style>
          {`
                        #designacao, #descricao, #curso { background: #f0f0f0 !important}
                        .p-dropdown-label, .p-inputtext{
                            width: 100%;
                        }

                        .p-fileupload, .p-fileupload-basic, .p-component {
                            background-color: #f0f0f0 !important;
                            color: #000000 !important;
                        }
                    `}
        </style>
        <form className="forms-sample" onSubmit={this.handleSubmit}>
          <div className="col-md-12">
            <div className="p-field">
              <label htmlFor="designacao">Designação</label>
              <InputText
                required
                id="designacao"
                name="designacao"
                type="text"
                placeholder="Designação da Disciplina"
                className="form-control"
                onChange={this.handleChange}
              />
            </div>
            <br />
            <div className="p-field">
              <label htmlFor="descricao">Descrição</label>
              <InputTextarea
                required
                id="descricao"
                name="descricao"
                type="text"
                placeholder="Descrição da Disciplina"
                className="form-control"
                onChange={this.handleChange}
              />
            </div>
            <br />
            <div className="p-field">
              <label htmlFor="curso">Curso</label>
              <Dropdown
                id="curso"
                value={this.state.curso}
                options={this.state.cursoOptions}
                onChange={this.handleCursoChange}
                placeholder="Selecione o curso"
                className=" form-control"
              />
              <br />
            </div>
            <br />
            <div className="p-field">
              <FileUpload
                mode="basic"
                name="ficheiro"
                accept=".pdf,.doc,.docx"
                customUpload
                uploadHandler={this.onFileUpload}
                chooseLabel="Escolher Ficheiro"
                style={{ backgroundColor: "#f0f0f0", color: "#333" }}
              />
            </div>
            <br />
          </div>
          <Button type="submit" label="Salvar" outlined className="mr-2" />
        </form>
      </div>
    );
  };

  render() {
    const {
      usuarioLogado,
      data,
      loading,
      error,
      globalFilter,
      isNewModalVisible,
    } = this.state;
    if (loading) {
      return <div>Carregando...</div>;
    }
    if (error) {
      return <div>Erro ao carregar os dados: {error.message}</div>;
    }

    const dateBodyTemplate = (rowData) => {
      return this.formatDate(rowData.dataActualizacao);
    };

    const rightToolbarTemplate = () => {
      return (
        <React.Fragment>
          <Link to="#" className="link">
            <Button
              label="Actualizar Regulamento"
              icon="pi pi-plus"
              className="botao-novo"
              onClick={() => this.actualizarNovo()}
            />
          </Link>
        </React.Fragment>
      );
    };

    const leftToolbarTemplate = (
      <div>
        <InputText
          type="search"
          onInput={(e) => this.setGlobalFilter(e)}
          placeholder="Pesquisar..."
        />
      </div>
    );

    return (
      <div>
        {usuarioLogado ? (
          <div>
            <div className="page-header">
              <h3 className="page-title"> Regulamento </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="regulamento-visualizar" className="link">
                      {" "}
                      Visualizar{" "}
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>

            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <Toolbar
                      left={leftToolbarTemplate}
                      right={rightToolbarTemplate}
                    ></Toolbar>
                    <DataTable
                      value={data}
                      globalFilter={globalFilter}
                      className="table-custom"
                      dataKey="id"
                      paginator
                      rows={10}
                      rowsPerPageOptions={[5, 10, 25]}
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      currentPageReportTemplate="Mostrando {first} para {last} de {totalRecords} utilizadores"
                      responsiveLayout="scroll"
                    >
                      <Column
                        field="designacao"
                        sortable
                        header="Designação"
                      ></Column>
                      <Column
                        field="descricao"
                        sortable
                        header="Descrição"
                      ></Column>
                      <Column
                        field="dataActualizacao"
                        sortable
                        header="Data Actualização"
                        body={dateBodyTemplate}
                      ></Column>
                      <Column field="estado" sortable header="Estado"></Column>
                      <Column
                        field="fkCurso.designacao"
                        sortable
                        header="Curso"
                      ></Column>
                    </DataTable>
                    <Dialog
                      header="Nova Disciplina"
                      visible={isNewModalVisible}
                      style={{ width: "50vw" }}
                      onHide={this.hideNewModal}
                    >
                      {this.renderNewModalContent()}
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(RegulamentoVisualizar);
