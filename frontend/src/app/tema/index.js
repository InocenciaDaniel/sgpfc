import React, { Component } from "react";
import api from "../axiosConfig";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";

export class TemaIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      temas: [],
      layout: "grid",
      sortKey: null,
      sortKeyArea: null,
      sortKeyLocal: null,
      sortOrder: null,
      sortField: "",
      globalFilterValue: "",
      filteredTemas: null,
      areaConhecimentoOptions: [],
      localRealizacaoOptions: [],
    };
  }

  fetchData = async () => {
    try {
      const response = await api.get("tema/findAll");

      const areaConhecimentoResponse = await api.get(
        `areaConhecimento/findAll`,
        {
          withCredentials: true,
        }
      );
      const areaConhecimentoOptions = areaConhecimentoResponse.data.map(
        (area) => ({
          label: area.designacao,
          value: area.pkAreaConhecimento,
        })
      );

      const localRealizacaoResponse = await api.get(`localRealizacao/findAll`, {
        withCredentials: true,
      });

      const localRealizacaoOptions = localRealizacaoResponse.data.map(
        (local) => ({
          label: local.designacao,
          value: local.pkLocalRealizacao,
        })
      );

      this.setState({
        localRealizacaoOptions,
        areaConhecimentoOptions,
        temas: response.data,
        loading: false,
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
      this.setState({ filteredTemas: null });
    } else {
      const filtered = this.state.temas.filter((tema) =>
        tema.titulo.toLowerCase().includes(value)
      );
      this.setState({ filteredTemas: filtered });
    }
  };

  onSortChange = (event) => {
    const value = event.value;
    this.setState({ sortKey: value, sortKeyArea: null, sortKeyLocal: null });

    let sortedTemas;
    switch (value) {
      case "aprovado":
        sortedTemas = [...this.state.temas].filter(
          (product) => product.estado === "aprovado"
        );
        break;
      case "reprovado":
        sortedTemas = [...this.state.temas].filter(
          (product) => product.estado === "reprovado"
        );
        break;
      case "aguardando aprovacao":
        sortedTemas = [...this.state.temas].filter(
          (product) => product.estado === "aguardando aprovacao"
        );
        break;

      default:
        sortedTemas = [...this.state.temas];
        break;
    }

    this.setState({
      filteredTemas: sortedTemas,
    });
  };

  onSortLocalRealizacaoChange = (event) => {
    const value = event.value;
    this.setState({ sortKeyLocal: value, sortKeyArea: null, sortKey: null });

    const filteredTemas = this.state.temas.filter(
      (tema) => tema.fkLocalRealizacao.pkLocalRealizacao === value
    );

    this.setState({
      filteredTemas,
    });
  };

  onSortAreaConhecimentoChange = (event) => {
    const value = event.value;
    this.setState({ sortKeyArea: value, sortKeyLocal: null, sortKey: null });

    const filteredTemas = this.state.temas.filter(
      (tema) => tema.fkAreaConhecimento.pkAreaConhecimento === value
    );

    this.setState({
      filteredTemas,
    });
  };

  itemTemplate = (tema, layout) => {
    if (!tema) return;

    if (layout === "list") {
      return this.dataviewListItem(tema);
    } else if (layout === "grid") {
      return this.dataviewGridItem(tema);
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
            href={`/tema-visualizar/${data.pkTema}`}
            className="text-decoration-none"
            style={{
              color: "#333",
              textDecoration: "none",
            }}
          >
            <div className="text-xl mb-2">
              {data.titulo.charAt(0).toUpperCase() +
                data.titulo.slice(1).toLowerCase()}
            </div>

            <div className="text-sm text-muted mb-2">
              <span className="mr-2">
                <strong>Orientador Proposto: </strong>
                {data.fkOrientadorPropostoEmail}
              </span>
              <span className="mr-2">
                <strong>Estudante Proposto: </strong>
                {data.fkEstudanteProposto?.nome}
              </span>
              <span className="mr-2">
                <strong>Tema Proposto Por: </strong>
                {data.fkTemaPropostoPor?.nome}
              </span>
              <span className="mr-2">
                <strong>Estado: </strong>
                {data.estado.charAt(0).toUpperCase() + data.estado.slice(1)}
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
              (window.location.href = `/tema-visualizar/${data.pkTema}`)
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
          height: "30vh",
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
            href={`/tema-visualizar/${data.pkTema}`}
            className="text-900 text-xl font-medium"
            style={{
              color: "#333",
              fontSize: "1.25rem",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            {data.titulo.charAt(0).toUpperCase() +
              data.titulo.slice(1).toLowerCase()}
          </a>
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-medium text-900 mb-2"></div>
          <div className="font-italic text-600 mt-3">
            <i className="pi pi-info-circle mr-2"></i>
            Estado: {data.estado.charAt(0).toUpperCase() + data.estado.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      usuarioLogado,
      filteredTemas,
      temas,
      layout,
      sortKey,
      sortKeyArea,
      sortKeyLocal,
      sortOrder,
      sortField,
      globalFilterValue,
    } = this.state;

    const isOrientador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador";

    const dataViewHeader = (
      <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
        <Dropdown
          value={sortKey}
          options={[
            { label: "Aprovado", value: "aprovado" },
            { label: "Reprovado", value: "reprovado" },
            { label: "Aguardando Aprovação", value: "aguardando aprovacao" },
          ]}
          optionLabel="label"
          placeholder="Filtrar Por Estado"
          onChange={this.onSortChange}
        />

        <Dropdown
          value={sortKeyLocal}
          options={this.state.localRealizacaoOptions}
          optionLabel="label"
          placeholder="Filtrar Por Local de Realização"
          onChange={this.onSortLocalRealizacaoChange}
        />

        <Dropdown
          value={sortKeyArea}
          options={this.state.areaConhecimentoOptions}
          optionLabel="label"
          placeholder="Filtrar Por Área de Conhecimento"
          onChange={this.onSortAreaConhecimentoChange}
        />

        <span className="p-input-icon-left ">
          <InputText
            value={globalFilterValue}
            onChange={this.onFilter}
            placeholder="  Pesquisar por título"
          />
        </span>

        {isOrientador && (
          <Link to="/tema-propor">
            <Button
              label="Propor Tema"
              className="p-button"
              style={{ width: "10rem" }}
            />
          </Link>
        )}
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
                    href="/tema-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Temas
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">Lista de Temas</span>
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
                  value={filteredTemas || temas}
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

export default TemaIndex;
