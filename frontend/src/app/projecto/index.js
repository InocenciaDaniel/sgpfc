import React, { Component } from "react";
import api from "../axiosConfig";
import { InputText } from "primereact/inputtext";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Projecto from "../outras-tabelas/Projecto";

export class ProjectoIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      projectos: [],
      layout: "grid",
      sortKey: null,
      sortKeyCurso: null,
      cursosOptions: [],
      sortOrder: null,
      sortField: "",
      globalFilterValue: "",
      filteredProjectos: null,
      displayDialog: false,
    };
  }

  fetchData = async () => {
    try {
      const response = await api.get("projecto/findAll");

      const cursosResponse = await api.get(`curso/findAll`, {
        withCredentials: true,
      });
      const cursosOptions = cursosResponse.data.map((c) => ({
        label: c.designacao,
        value: c.pkCurso,
      }));

      this.setState({
        cursosOptions,
        projectos: response.data,
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
  onOpenModal = () => {
    this.setState({
      displayDialog: true,
    });
  };

  onCloseModal = () => {
    this.setState({
      displayDialog: false,
    });
  };

  onFilter = (e) => {
    const value = e.target.value.toLowerCase();
    this.setState({ globalFilterValue: value });

    if (!value) {
      this.setState({ filteredProjectos: null });
    } else {
      const filtered = this.state.projectos.filter((projecto) =>
        projecto.fkTema.titulo.toLowerCase().includes(value)
      );
      this.setState({ filteredProjectos: filtered });
    }
  };

  onSortChange = (event) => {
    const value = event.value;
    this.setState({ sortKey: value });

    let sortedProjectos;
    switch (value) {
      case "Em andamento":
        sortedProjectos = [...this.state.projectos].filter(
          (product) => product.estado === "Em andamento"
        );
        break;

      case "Reprovado":
        sortedProjectos = [...this.state.projectos].filter(
          (product) => product.estado === "Reprovado"
        );
        break;

      case "Desistido":
        sortedProjectos = [...this.state.projectos].filter(
          (product) => product.estado === "Desistido"
        );
        break;
      case "Concluido":
        sortedProjectos = [...this.state.projectos].filter(
          (product) => product.estado === "Concluido"
        );
        break;

      default:
        sortedProjectos = [...this.state.projectos];
        break;
    }

    this.setState({
      filteredProjectos: sortedProjectos,
    });
  };

  onSortCursoChange = (event) => {
    const value = event.value;
    this.setState({
      sortKeyCurso: value,
      sortKey: null,
    });

    const filteredProjectos = this.state.projectos.filter(
      (projecto) => projecto.fkTurma.fkDisciplina.fkCurso.pkCurso === value
    );

    this.setState({
      filteredProjectos,
    });
  };

  itemTemplate = (projecto, layout) => {
    if (!projecto) return;

    if (layout === "list") {
      return this.dataviewListItem(projecto);
    } else if (layout === "grid") {
      return this.dataviewGridItem(projecto);
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
            <div className="text-xl mb-2">
              {data?.fkTema?.titulo.charAt(0).toUpperCase() +
                data?.fkTema?.titulo.slice(1).toLowerCase()}
            </div>
            <div className="text-sm text-muted">
              <span className="mr-2">
                <strong>Orientador: </strong>
                {data.fkOrientador?.nome}
              </span>
              <span className="mr-2">
                <strong>Estudante: </strong>
                {data.fkEstudante?.nome}
              </span>
              <span className="mr-2">
                <strong>Estado: </strong>
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
            href={`/projecto-visualizar/${data.pkProjecto}`}
            className="text-900 text-xl font-medium"
            style={{
              color: "#333",
              fontSize: "1.25rem",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            {data?.fkTema?.titulo.charAt(0).toUpperCase() +
              data?.fkTema?.titulo.slice(1).toLowerCase()}
          </a>
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-italic text-600 mt-3">
            <i className="pi pi-info-circle mr-2"></i>
            Estado: {data.estado}
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      usuarioLogado,
      filteredProjectos,
      projectos,
      layout,
      sortKey,
      sortKeyCurso,
      sortOrder,
      sortField,
      globalFilterValue,
    } = this.state;

    const isAdmin =
      usuarioLogado &&
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
          value={sortKey}
          options={[
            { label: "Em Andamento", value: "Em andamento" },
            { label: "Reprovado", value: "Reprovado" },
            { label: "Concluído", value: "Concluido" },
            { label: "Descontinuado", value: "Desistido" },
          ]}
          optionLabel="label"
          placeholder="Filtrar Por Estado"
          onChange={this.onSortChange}
        />
        <span className="p-input-icon-left ">
          <InputText
            value={globalFilterValue}
            onChange={this.onFilter}
            placeholder="  Pesquisar por titulo do tema"
          />
        </span>
        {isAdmin && (
          <Button
            label="Adicionar Novo"
            className="p-button"
            style={{ width: "15rem" }}
            onClick={this.onOpenModal}
            //onClick={() => this.setState({ displayDialogTemplate: true })}
          />
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
                    href="/projecto-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Projectos
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Lista de Projectos
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
                  value={filteredProjectos || projectos}
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

        <Dialog
          header="Criar Novo Projecto"
          visible={this.state.displayDialog}
          onHide={this.onCloseModal}
          style={{ width: "75vw" }}
          modal
        >
          <Projecto />
        </Dialog>
      </div>
    );
  }
}

export default ProjectoIndex;
