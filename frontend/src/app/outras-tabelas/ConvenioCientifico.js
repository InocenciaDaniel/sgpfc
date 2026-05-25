import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import TabelasSistema from "./TabelasSistema";
import api from "../axiosConfig";

class ConvenioCientifico extends Component {
  state = {
    usuarioLogado: null,
    data: null,
    loading: true,
    error: null,
    globalFilter: null,
    isNewModalVisible: false,
    actividadesAcademica: null,
    actividadesAcademicaOptions: [],
    designacao: "",
    descricao: "",
  };

  fetchData = async () => {
    try {
      const response = await api.get("convenioCientifico/findAll");

      const actividadesAcademicaResponse = await api.get(
        "actividadesAcademica/findAll"
      );
      const actividadesAcademicaOptions = actividadesAcademicaResponse.data.map(
        (a) => ({ label: a.designacao, value: a.pkActividadesAcademica })
      );

      this.setState({
        data: response.data,
        loading: false,
        actividadesAcademicaOptions,
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

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  setGlobalFilter = (e) => {
    this.setState({ globalFilter: e.target.value });
  };

  handleConvenioCientificoChange = (e) => {
    this.setState({ curso: e.value });
  };

  novoConveniocientifico = () => {
    this.setState({
      isNewModalVisible: true,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { designacao, descricao, fkConvenioCientifico } = this.state;

    try {
      await api.post("convenioCientifico/save", {
        designacao,
        descricao,
        fkConvenioCientifico,
      });
      this.props.history.push("/convenio-cientifico");
    } catch (error) {
      console.error("Erro ao salvar o convenio cientifico", error);
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
                        #designacao, #descricao, #actividadesAcademicas { background: #f0f0f0 !important}
                        .p-dropdown-label, .p-inputtext{
                        width: 100%;
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
              <label htmlFor="actividadesAcademicas">
                Actividades Academicas
              </label>
              <Dropdown
                id="actividadesAcademicas"
                value={this.state.actividadesAcademica}
                options={this.state.actividadesAcademicaOptions}
                onChange={this.handleCursoChange}
                placeholder="Selecione a actividade academica"
                className=" form-control"
              />
              <br />
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

    const rightToolbarTemplate = () => {
      return (
        <React.Fragment>
          <Link to="#" className="link">
            <Button
              label="Novo Convenio"
              icon="pi pi-plus"
              className="botao-novo"
              onClick={() => this.novoConveniocientifico()}
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
            <TabelasSistema />
            <div className="p-7 pt-0">
              <div className="p-fluid" style={{ marginTop: "1px" }}>
                <div className="surface-section surface-card p-5 border-round flex-auto">
                  <div style={{ display: "grid" }}>
                    <div className="row">
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
                        currentPageReportTemplate="Mostrando {first} para {last} de {totalRecords} convenio cientifico"
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
                          field="fkActividadesAcademica.designacao"
                          sortable
                          header="Actividades Academicas"
                        ></Column>
                      </DataTable>
                      <Dialog
                        header="Novo Convenio Cientifico"
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
          </div>
        ) : null}
      </div>
    );
  }
}
export default withRouter(ConvenioCientifico);
