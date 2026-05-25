import React, { Component } from "react";
import api from "../axiosConfig";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../assets/styles/tabela.css";

export class UtilizadorEstudantesFinalistas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      error: null,
      globalFilter: null,
    };
  }

  fetchData = async () => {
    try {
      const response = await api.get("conta/findAllContaEstudanteFinalista");
      this.setState({ data: response.data, loading: false });
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
  }

  setGlobalFilter = (e) => {
    this.setState({ globalFilter: e.target.value });
  };

  // Função para formatar a data
  formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  editUtilizador = (rowData) => {
    this.props.history.push(`/utilizador-editar/${rowData.pkConta}`);
  };

  desactivar = (rowData) => {};

  exportPdf = () => {
    const { data } = this.state;

    const doc = new jsPDF();

    const exportColumns = [
      { title: "Nome", dataKey: "nome" },
      { title: "Email", dataKey: "email" },
      { title: "Telefone", dataKey: "telefone" },
      { title: "Género", dataKey: "genero" },
      { title: "Nº Matricula", dataKey: "matricula" },
      { title: "Perfil", dataKey: "perfil" },
    ];

    const orientadoresData = data.map((conta) => ({
      nome: conta.fkUtilizador?.nome || "",
      email: conta?.email || "",
      telefone: conta.fkUtilizador?.telefone || "",
      genero: conta.fkUtilizador.fkSexo?.designacao || "",
      matricula: conta.fkUtilizador?.numMatriculaEstudante || "",
      perfil: conta.fkUtilizador.fkTipoConta?.designacao || "",
    }));

    doc.setFontSize(14);
    doc.text("UNIVERSIDADE CATÓLICA DE ANGOLA", 64, 20);

    doc.setFontSize(14);
    doc.text("FACULDADE DE ENGENHARIA", 76, 27);
    doc.setFontSize(12);
    doc.text("Lista dos Estudantes Finalistas", 14, 50);

    doc.autoTable({
      startY: 60,
      columns: exportColumns,
      body: orientadoresData,
    });
    doc.setFontSize(10);
    doc.text(
      "Relatório gerado automaticamente pelo sistema [SGPFC - UCAN]",
      14,
      doc.internal.pageSize.height - 10
    );
    const date = new Date().toLocaleDateString();
    const textWidth = doc.getTextWidth(date);
    doc.text(
      date,
      doc.internal.pageSize.width - textWidth - 14,
      doc.internal.pageSize.height - 10
    );
    doc.save("temas.pdf");
  };

  render() {
    const { usuarioLogado, data, error, globalFilter } = this.state;

    if (error) {
      return (
        <div>Erro ao carregar os dados do utilizador: {error.message}</div>
      );
    }

    const actionBodyTemplate = (rowData) => {
      const dropdownOptions = [
        {
          label: (
            <Button
              label="Editar"
              onClick={() => this.editUtilizador(rowData)}
            />
          ),
          command: () => this.editUtilizador(rowData),
        },
        {
          label: (
            <Button
              label="Desabilitar"
              onClick={() => this.desactivarTurma(rowData.id)}
            />
          ),
          command: () => this.desactivarTurma(rowData.id),
        },
      ];
      return (
        <div>
          <Dropdown
            required
            id=""
            options={dropdownOptions}
            className="dropdown-custom"
          />
        </div>
      );
    };

    const rightToolbarTemplate = () => {
      return (
        <React.Fragment>
          <Button
            label="Extrair Tabela"
            icon="pi pi-file-pdf"
            severity="warning"
            className="botao-novo"
            onClick={this.exportPdf}
          />
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

    const dateBodyTemplate = (rowData) => {
      return this.formatDate(rowData.dataCriacao);
    };

    return (
      <div>
        {usuarioLogado ? (
          <div>
            <div className="page-header">
              <h3 className="page-title"> Lista dos Estudantes Finalistas </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#" className="link">
                      {" "}
                      Utilizadores{" "}
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Listar
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
                        field="fkUtilizador.nome"
                        sortable
                        header="Nome"
                      ></Column>
                      <Column field="email" sortable header="Email"></Column>
                      <Column
                        field="fkUtilizador.fkSexo.designacao"
                        sortable
                        header="Género"
                      ></Column>
                      <Column
                        field="fkUtilizador.fkTipoConta.designacao"
                        sortable
                        header="Perfil"
                      ></Column>
                      <Column
                        field="dataCriacao"
                        sortable
                        header="Data de Criação"
                        body={dateBodyTemplate}
                      ></Column>
                      <Column
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{ minWidth: "8rem" }}
                      ></Column>
                    </DataTable>
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

export default UtilizadorEstudantesFinalistas;
