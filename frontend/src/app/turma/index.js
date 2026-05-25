import React, { Component } from "react";
import api from "../axiosConfig";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";

export class TurmaIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: [],
      error: null,

      turmas: [],
      layout: "grid",
      sortKey: null,
      sortKeyCurso: null,
      sortKeySemestre: null,
      sortOrder: null,
      sortField: "",
      globalFilterValue: "",
      filteredTurmas: null,
      cursosOptions: [],
      semestresOptions: [],
    };
  }

  fetchData = async () => {
    try {
      let endpoint;

      if (
        JSON.parse(localStorage.getItem("usuario"))?.fkUtilizador?.fkTipoConta
          ?.designacao === "Orientador"
      ) {
        const isCoordenadorResponse = await api.get(
          `utilizador/isCoordenador/${
            JSON.parse(localStorage.getItem("usuario")).fkUtilizador
              .pkUtilizador
          }`
        );
        if (isCoordenadorResponse.data) {
          endpoint = `turma/findTurmasDoCoordenador/${
            JSON.parse(localStorage.getItem("usuario")).fkUtilizador
              .pkUtilizador
          }`;
        }
      } else {
        endpoint = "turma/findAll";
      }
      const response = await api.get(endpoint);

      const cursosResponse = await api.get(`curso/findAll`, {
        withCredentials: true,
      });
      const cursosOptions = cursosResponse.data.map((c) => ({
        label: c.designacao,
        value: c.pkCurso,
      }));

      const semestreResponse = await api.get(`semestre/findAll`, {
        withCredentials: true,
      });
      const semestresOptions = semestreResponse.data.map((s) => ({
        label: s.designacao,
        value: s.pkSemestre,
      }));

      this.setState({
        semestresOptions,
        cursosOptions,
        turmas: response.data,
        loading: false,
      });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  componentDidMount() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }

    this.fetchData();
  }

  onFilter = (e) => {
    const value = e.target.value.toLowerCase();
    this.setState({ globalFilterValue: value });

    if (!value) {
      this.setState({ filteredTurmas: null });
    } else {
      const filtered = this.state.turmas.filter((turma) =>
        turma.codigo.toLowerCase().includes(value)
      );
      this.setState({ filteredTurmas: filtered });
    }
  };
  onSortChange = (event) => {
    const value = event.value;
    this.setState({
      sortKey: value,
      sortKeyCurso: null,
      sortKeySemestre: null,
    });

    let sortedTurmas;

    if (value === "Crescente") {
      sortedTurmas = [...this.state.turmas].sort((a, b) =>
        a.fkAnoLectivo.designacao.localeCompare(b.fkAnoLectivo.designacao)
      );
    } else if (value === "Decrescente") {
      sortedTurmas = [...this.state.turmas].sort((a, b) =>
        b.fkAnoLectivo.designacao.localeCompare(a.fkAnoLectivo.designacao)
      );
    } else {
      sortedTurmas = [...this.state.turmas];
    }

    this.setState({
      filteredTurmas: sortedTurmas,
    });
  };

  onSortCursoChange = (event) => {
    const value = event.value;
    this.setState({
      sortKeyCurso: value,
      sortKey: null,
      sortKeySemestre: null,
    });

    const filteredTurmas = this.state.turmas.filter(
      (turma) => turma.fkDisciplina.fkCurso.pkCurso === value
    );

    this.setState({
      filteredTurmas,
    });
  };

  onSortSemestreChange = (event) => {
    const value = event.value;
    this.setState({
      sortKeySemestre: value,
      sortKeyCurso: null,
      sortKey: null,
    });

    const filteredTurmas = this.state.turmas.filter(
      (turma) => turma.fkSemestre.pkSemestre === value
    );

    this.setState({
      filteredTurmas,
    });
  };

  itemTemplate = (turma, layout) => {
    if (!turma) return;

    if (layout === "list") {
      return this.dataviewListItem(turma);
    } else if (layout === "grid") {
      return this.dataviewGridItem(turma);
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
            href={`/turma-visualizar/${data.pkTurma}`}
            className="text-decoration-none"
            style={{
              color: "#333",
              textDecoration: "none",
            }}
          >
            <div className="font-bold text-xl mb-2">
              {data.codigo} - {data.fkSemestre.designacao}
            </div>
            <div className="text-secondary mb-2">
              {data.fkAnoLectivo.designacao}
            </div>
            <div className="text-sm text-muted">
              {data.fkSemestre.designacao}
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
              (window.location.href = `/turma-visualizar/${data.pkTurma}`)
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
            href={`/turma-visualizar/${data.pkTurma}`}
            className="text-900 text-xl font-medium"
            style={{
              color: "#333",
              fontSize: "1.25rem",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            {data.codigo} - {data.fkSemestre.designacao}
          </a>
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-medium text-900 mb-2">
            <a
              href={`/turma-visualizar/${data.pkTurma}`}
              className="text-900 text-xl font-medium"
              style={{
                color: "#333",
                fontSize: "1.25rem",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              <div className="font-medium text-700 mb-2">
                <i className="pi pi-calendar mr-2"></i>
                {data.fkAnoLectivo.designacao}
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      usuarioLogado,
      filteredTurmas,
      turmas,
      layout,
      sortKey,
      sortKeyCurso,
      sortKeySemestre,
      sortOrder,
      sortField,
      globalFilterValue,
    } = this.state;

    const isAdmin =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "admin";

    const dataViewHeader = (
      <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
        <Dropdown
          value={sortKeyCurso}
          options={this.state.cursosOptions}
          optionLabel="label"
          placeholder="Filtrar Por Curso"
          onChange={this.onSortCursoChange}
        />
        <Dropdown
          value={sortKeySemestre}
          options={this.state.semestresOptions}
          optionLabel="label"
          placeholder="Filtrar Por Semestre"
          onChange={this.onSortSemestreChange}
        />

        <Dropdown
          value={sortKey}
          options={[
            { label: "Crescente", value: "Crescente" },
            { label: "Decrescente", value: "Decrescente" },
            { label: "Todos", value: "Todos" },
          ]}
          optionLabel="label"
          placeholder="Ordernar Por Ano Lectivo"
          onChange={this.onSortChange}
        />
        <span className="p-input-icon-left ">
          <InputText
            value={globalFilterValue}
            onChange={this.onFilter}
            placeholder="  Pesquisar por código"
          />
        </span>
        {isAdmin && (
          <Link to="/turma-cadastrar">
            <Button
              label="Nova Turma"
              className="p-button"
              style={{ width: "10rem" }}
            />
          </Link>
        )}
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
                    href="/turma-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Turmas
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Lista de Turmas
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
                  value={filteredTurmas || turmas}
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

export default TurmaIndex;
