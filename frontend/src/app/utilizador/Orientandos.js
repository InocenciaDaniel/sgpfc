import React, { Component } from "react";
import api from "../axiosConfig";
import { InputText } from "primereact/inputtext";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";

export class OrientandosIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: [],
      error: null,

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
      const response = await api.get(
        `projecto/findAllProjectosDoOrientador/${
          JSON.parse(localStorage.getItem("usuario")).fkUtilizador.pkUtilizador
        }`
      );
      this.setState({ products: response.data, loading: false });
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

    let sortedProjectos;
    switch (value) {
      case "Em andamento":
        sortedProjectos = [...this.state.products].filter(
          (product) => product.estado === "Em andamento"
        );
        break;

      case "Reprovado":
        sortedProjectos = [...this.state.products].filter(
          (product) => product.estado === "Reprovado"
        );
        break;

      case "desistido":
        sortedProjectos = [...this.state.products].filter(
          (product) => product.estado === "desistido"
        );
        break;
      case "concluido":
        sortedProjectos = [...this.state.products].filter(
          (product) => product.estado === "concluido"
        );
        break;

      default:
        sortedProjectos = [...this.state.products];
        break;
    }

    this.setState({
      filteredProducts: sortedProjectos,
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
            href={`/projecto-visualizar/${data.pkProjecto}`}
            className="text-decoration-none"
            style={{
              color: "#333",
              textDecoration: "none",
            }}
          >
            <div className="font-bold text-xl mb-2">
              {data.fkEstudante.nome}
            </div>

            <div className="text-sm text-muted">
              <span className="mr-2">
                <strong>Turma: </strong>
                {data.fkTurma?.codigo}
              </span>
              <span className="mr-2">
                <strong>Estado do Projecto: </strong>
                {data.estado}
              </span>
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
              (window.location.href = `/projecto-visualizar/${data.pkProjecto}`)
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
            href={`/projecto-visualizar/${data.pkProjecto}`}
            className="text-900 text-xl font-medium"
            style={{
              color: "#333",
              fontSize: "1.25rem",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            {data.fkEstudante.nome}
          </a>
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-medium text-900 mb-2">
            <a
              href={`/projecto-visualizar/${data.pkProjecto}`}
              className="text-900 text-xl font-medium"
              style={{
                color: "#333",
                fontSize: "1.25rem",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              <div className="font-medium text-700 mb-2">
                <i className="pi pi-briefcase mr-2"></i>
                {data.fkTurma.codigo}
              </div>
            </a>
          </div>
          <div className="font-italic text-600 mt-3">{data?.estado}</div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      usuarioLogado,
      filteredProducts,
      products,
      layout,
      sortKey,
      sortOrder,
      sortField,
      globalFilterValue,
    } = this.state;

    const dataViewHeader = (
      <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
        <Dropdown
          value={sortKey}
          options={[
            { label: "Em Andamento", value: "Em andamento" },
            { label: "Reprovado", value: "Reprovado" },
            {
              label: "Concluído",
              value: "concluido",
            },
            {
              label: "Descontinuado",
              value: "desistido",
            },
          ]}
          optionLabel="label"
          placeholder="Filtrar Por Estado do Projecto"
          onChange={this.onSortChange}
        />
        <span className="p-input-icon-left ">
          <InputText
            value={globalFilterValue}
            onChange={this.onFilter}
            placeholder="  Pesquisar por nome"
          />
        </span>
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => this.setState({ layout: e.value })}
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
                    Orientandos
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Lista de Orientandos
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
        ) : null}
      </div>
    );
  }
}

export default OrientandosIndex;
