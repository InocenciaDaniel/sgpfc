import React, { Component } from "react";
import api from "../../axiosConfig";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";

export class ConselhoCientificoDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientadoresOutrasUniversidadesCadastrados: [],

      products: [],
      layout: "list",
      sortKey: null,
      sortOrder: null,
      sortField: "",
      globalFilterValue: "",
      filteredProducts: null,
    };
  }

  async componentDidMount() {
    try {
      const orientadoresOutrasUniversidadesCadastradosResponse = await api.get(
        `orientadorProposto/findAll/`
      );
      if (orientadoresOutrasUniversidadesCadastradosResponse.data) {
        this.setState({
          products: orientadoresOutrasUniversidadesCadastradosResponse.data,
        });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  onFilter = (e) => {
    const value = e.target.value.toLowerCase();
    this.setState({ globalFilterValue: value });

    if (!value) {
      this.setState({ filteredProducts: null });
    } else {
      const filtered = this.state.products.filter((product) =>
        product.nome.toLowerCase().includes(value)
      );
      this.setState({ filteredProducts: filtered });
    }
  };

  onSortChange = (event) => {
    const value = event.value;
    this.setState({ sortKey: value });

    let sortedProducts;
    switch (value) {
      case "Rejeitado":
        sortedProducts = [...this.state.products].filter(
          (product) => product.estado === "rejeitado"
        );
        break;

      case "Proposto":
        sortedProducts = [...this.state.products].filter(
          (product) => product.estado === "proposto"
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
            href={`/utilizador-aprovar-orientador-proposto/${data.pkOrientadorProposto}`}
            className="text-decoration-none"
            style={{
              color: "#333",
              textDecoration: "none",
            }}
          >
            <div className="font-bold text-xl mb-2">{data.nome}</div>
            <div className="text-secondary mb-2">
              {data.grauAcademicoOrientador} -{" "}
              {data.fkUniversidadeOrientador.designacao}
            </div>
            <div className="text-sm text-muted">
              {data.estado.charAt(0).toUpperCase() +
                data.estado.slice(1).toLowerCase()}
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
              (window.location.href = `/utilizador-aprovar-orientador-proposto/${data.pkOrientadorProposto}`)
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
            href={`/utilizador-aprovar-orientador-proposto/${data.pkOrientadorProposto}`}
            className="text-900 text-xl font-medium"
            style={{
              color: "#333",
              fontSize: "1.25rem",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            {data.nome}
          </a>
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-medium text-900 mb-2">
            <a
              href={`/utilizador-aprovar-orientador-proposto/${data.pkOrientadorProposto}`}
              className="text-900 text-xl font-medium"
              style={{
                color: "#333",
                fontSize: "1.25rem",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              <div className="font-medium text-700 mb-2">
                {data.grauAcademicoOrientador}
              </div>
              <div className="font-medium text-700 mb-2">
                {data.fkUniversidadeOrientador.designacao}
              </div>
            </a>
          </div>
          <div className="font-italic text-600 mt-3">
            {data.estado.charAt(0).toUpperCase() +
              data.estado.slice(1).toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      filteredProducts,
      products,
      layout,
      sortKey,
      sortOrder,
      sortField,
      globalFilterValue,
      orientadoresOutrasUniversidadesCadastrados,
    } = this.state;

    const orietadoresPropostos =
      orientadoresOutrasUniversidadesCadastrados.filter(
        (orientador) => orientador.estado === "proposto"
      );
    const orientadoresRejeitados =
      orientadoresOutrasUniversidadesCadastrados.filter(
        (orientador) => orientador.estado === "rejeitado"
      );

    const qtdOrientadoresPropostos = orietadoresPropostos.length;
    const qtdOrientadoresRejeitados = orientadoresRejeitados.length;

    const data = {
      labels: ["Orientadores Propostos", "Orientadores Rejeitados"],
      datasets: [
        {
          label: "Estados dos Orientadores",
          data: [
            Number(qtdOrientadoresPropostos) || 0,
            Number(qtdOrientadoresRejeitados) || 0,
          ],
          backgroundColor: [
            "rgba(54, 162, 235, 0.5)",
            "rgba(240, 6, 57, 0.71)",
          ],
        },
      ],
    };

    const dataViewHeader = (
      <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
        <Dropdown
          value={sortKey}
          options={[
            { label: "Rejeitado", value: "Rejeitado" },
            { label: "Proposto", value: "Proposto" },
          ]}
          optionLabel="label"
          placeholder="Filtrar Por Estado"
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
            label="Cadastrar Orientador"
            className="p-button-outlined"
            style={{ width: "15rem" }}
          />
        </Link>
      </div>
    );

    return (
      <div>
        <style>
          {`
             .p-dataview .p-dataview-header {
                background: #ffffff;
                border: none !important;
            },
            `}
        </style>

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
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "0.5rem",
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConselhoCientificoDashboard;
