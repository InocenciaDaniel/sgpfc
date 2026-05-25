import React, { Component } from "react";
import api from "../../axiosConfig";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

export class UtilizadorOrientadorIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      listaOrientadoresRejeitados: [],
      error: null,
      search: "",

      products: [],
      layout: "grid",
      sortKey: null,
      sortOrder: null,
      sortField: "",
      globalFilterValue: "",
      filteredProducts: null,
    };
  }

  fetchData = async () => {
    try {
      const response = await api.get("conta/findAllContaOrientador");

      const responseListaOrientadoresRejeitados = await api.get(
        "orientadorProposto/findAllOrientadoresRejeitados"
      );
      this.setState({
        products: response.data,
        loading: false,
        listaOrientadoresRejeitados: responseListaOrientadoresRejeitados.data,
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
  }

  onFilter = (e) => {
    const value = e.target.value.toLowerCase();
    this.setState({ globalFilterValue: value });

    if (!value) {
      this.setState({ filteredProducts: null });
    } else {
      const filtered = this.state.products.filter((product) =>
        product.fkUtilizador.nome.toLowerCase().includes(value)
      );
      this.setState({ filteredProducts: filtered });
    }
  };

  onSortChange = (event) => {
    const value = event.value;
    this.setState({ sortKey: value });

    let sortedProducts;
    switch (value) {
      case "Orientadores Rejeitados":
        sortedProducts = this.state.listaOrientadoresRejeitados;
        break;
      case "Todos Orientadores":
        sortedProducts = [...this.state.products].filter(
          (product) =>
            product.fkUtilizador.fkTipoConta.designacao === "Orientador"
        );
        break;
      default:
        sortedProducts = [...this.state.products];
        break;
    }

    this.setState({
      filteredProducts: sortedProducts,
    });
  };

  exportPdf = () => {
    const { products } = this.state;

    const doc = new jsPDF();

    const exportColumns = [
      { title: "Nome", dataKey: "nome" },
      { title: "Email", dataKey: "email" },
      { title: "Telefone", dataKey: "telefone" },
      { title: "Género", dataKey: "genero" },
      { title: "Universidade Vinculada", dataKey: "universidade" },
      { title: "Grau Académico", dataKey: "grau" },
      { title: "Perfil", dataKey: "perfil" },
    ];

    const orientadoresData = products.map((conta) => ({
      nome: conta.fkUtilizador?.nome || "",
      email: conta?.email || "",
      telefone: conta.fkUtilizador?.telefone || "",
      genero: conta.fkUtilizador.fkSexo?.designacao || "",
      universidade: conta.fkUtilizador.fkUniversidadeOrientador?.sigla || "",
      grau: conta.fkUtilizador?.grauAcademicoOrientador || "-",
      perfil: conta.fkUtilizador.fkTipoConta?.designacao || "",
    }));

    doc.setFontSize(14);
    doc.text("UNIVERSIDADE CATÓLICA DE ANGOLA", 64, 20);

    doc.setFontSize(14);
    doc.text("FACULDADE DE ENGENHARIA", 76, 27);
    doc.setFontSize(12);
    doc.text("Lista dos Orientadores", 14, 50);

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
    doc.save("orientadores.pdf");
  };

  itemTemplate = (product, layout) => {
    if (!product) return;

    if (layout === "list") {
      return this.dataviewListItem(product);
    } else if (layout === "grid") {
      return this.dataviewGridItem(product);
    }
  };

  dataviewListItem = (data) => (
    <div className="col-12 p-1">
      <div
        className="flex flex-column md:flex-row align-items-center p-3 w-full hover:shadow-2 border-round surface-card transition-all"
        style={{
          border: "1px solid #d9d9d9",
          padding: "15px",
          cursor: "pointer",
        }}
      >
        <div className="flex-grow-1">
          <a
            href={`/utilizador-visualizar/${data?.fkUtilizador?.pkUtilizador}`}
            className="text-decoration-none"
            style={{
              color: "#333",
              textDecoration: "none",
            }}
          >
            <div className="font-bold text-xl mb-2">
              {data?.fkUtilizador?.nome}
            </div>
            <div className="text-secondary mb-2">
              <b>Email: </b>
              {data?.email}
            </div>
            <div className="text-sm text-muted">
              <b>Universidade: </b>
              {data?.fkUtilizador?.fkUniversidadeOrientador?.designacao}
            </div>
          </a>
        </div>
        <div className="ml-3">
          <button
            className="p-button p-component p-button-text p-button-rounded"
            style={{
              backgroundColor: "transparent",
              color: "#007bff",
            }}
            onClick={() =>
              (window.location.href = `/utilizador-visualizar/${data?.fkUtilizador?.pkUtilizador}`)
            }
          >
            <i className="pi pi-eye" style={{ fontSize: "1.5rem" }}></i>
          </button>
        </div>
      </div>
    </div>
  );

  dataviewGridItem = (data) => (
    <div className="col-12 md:col-3 p-1">
      <div
        className="text-center border-1 surface-border border-round p-4"
        style={{
          transition:
            "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
          e.currentTarget.style.border = "none";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.border = "1px solid var(--surface-border)";
        }}
      >
        <div className="text-900 text-2xl font-bold my-3">
          <a
            href={`/utilizador-visualizar/${data?.fkUtilizador?.pkUtilizador}`}
            className="text-900 text-xl font-medium"
            style={{
              color: "#333",
              fontSize: "1.25rem",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            {data?.fkUtilizador?.nome}
          </a>
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-medium text-900 mb-2">
            <a
              href={`/utilizador-visualizar/${data?.fkUtilizador?.pkUtilizador}`}
              className="text-900 text-xl font-medium"
              style={{
                color: "#333",
                fontSize: "1.25rem",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              <div className="font-medium text-700 mb-2">
                <i className="pi pi-envelope mr-2"></i>
                {data?.email}
              </div>
            </a>
          </div>
          <div className="font-italic text-600 mt-3">
            {data?.fkUtilizador?.fkUniversidadeOrientador?.designacao}
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      usuarioLogado,
      error,

      filteredProducts,
      products,
      layout,
      sortKey,
      sortOrder,
      sortField,
      globalFilterValue,
    } = this.state;

    if (error) {
      return (
        <div>Erro ao carregar os dados do utilizador: {error.message}</div>
      );
    }

    const dataViewHeader = (
      <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
        <Dropdown
          value={sortKey}
          options={[
            { label: "Todos Orientadores", value: "Todos Orientadores" },
            {
              label: "Orientadores Rejeitados",
              value: "Orientadores Rejeitados",
            },
          ]}
          optionLabel="label"
          placeholder="Filtrar Orientadores"
          onChange={this.onSortChange}
        />
        <span className="p-input-icon-left ">
          <InputText
            value={globalFilterValue}
            onChange={this.onFilter}
            placeholder="  Pesquisar Por Nome"
          />
        </span>
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => this.setState({ layout: e.value })}
        />

        <Link to="/utilizador-cadastrar">
          <Button
            label="Novo Orientador"
            className="p-button"
            style={{ width: "10rem" }}
          />
        </Link>
        <Button
          label="Extrair Em PDF"
          icon="pi pi-file-pdf"
          severity="warning"
          className="botao-novo"
          onClick={this.exportPdf}
          style={{ width: "20rem" }}
        />
      </div>
    );

    return (
      <div>
        <style>
          {`
            .p-dataview .p-dataview-header{
              background: #ffffff;
              border: none;
            }
          `}
        </style>

        {usuarioLogado ? (
          <div className="p-7">
            <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/utilizador-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Orientadores
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Lista de Orientadores
                  </span>
                </li>
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                  <div className="flex align-items-center text-700 flex-wrap">
                    <div className="mr-5 flex align-items-center"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                <DataView
                  value={filteredProducts || products}
                  layout={layout}
                  paginator
                  rows={12}
                  sortOrder={sortOrder}
                  sortField={sortField}
                  itemTemplate={this.itemTemplate}
                  header={dataViewHeader}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "0.5rem",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default UtilizadorOrientadorIndex;
