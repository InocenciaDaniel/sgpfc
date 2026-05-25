import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import "react-datepicker/dist/react-datepicker.css";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import Curso from "./Curso";
import Disciplina from "./Disciplina";
import AnoLectivo from "./AnoLectivo";
import Semestre from "./Semestre";
import Universidade from "./Universidade";
import LocalRealizacao from "./LocalRealizacao";
import AreaConhecimento from "./AreaConhecimento";
import ActividadeAcademica from "./ActividadesAcademica";
import Regulamento from "./Regulamento";
import Projecto from "./Projecto";

class CustomDataViewLayoutOptions extends Component {
  render() {
    const buttonStyle = {
      backgroundColor: "#fff",
      borderColor: "#ccc",
      color: "#333",
    };

    const activeButtonStyle = {
      backgroundColor: "#007bff",
      borderColor: "#007bff",
      color: "#fff",
    };

    return (
      <div
        className="p-dataview-layout-options"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Button
          icon="pi pi-bars"
          onClick={() => this.props.onChange({ value: "list" })}
          style={this.props.layout === "list" ? activeButtonStyle : buttonStyle}
        />
        <Button
          icon="pi pi-th-large"
          onClick={() => this.props.onChange({ value: "grid" })}
          style={this.props.layout === "grid" ? activeButtonStyle : buttonStyle}
        />
      </div>
    );
  }
}

export class TabelasSistema extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,

      cursos: [],
      projectos: [],
      semestres: [],
      disciplinas: [],
      anosLectivos: [],
      universidades: [],
      locaisRealizacao: [],
      areasConhecimento: [],
      actividadesCientificas: [],
      regulamentos: [],

      cursoOptions: [],

      layout: "grid",
      sortOrder: null,
      sortField: "",

      toast: null,
      selectedFilter: "Curso",

      displayDialog: false,
      selectedEntity: null,
    };
  }

  fetchData = async () => {
    try {
      const responseCursos = await api.get("curso/findAll");

      const cursoOptions = responseCursos.data.map((e) => ({
        label: e.designacao,
        value: e.pkcurso,
      }));

      this.setState({ cursoOptions, loading: false });
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      this.setState({ error, loading: false });
    }
  };

  async componentDidMount() {
    this.fetchData();
    await this.fetchCursos();
    await this.fetchProjectos();
    await this.fetchSemestres();
    await this.fetchDisciplinas();
    await this.fetchAnosLectivos();
    await this.fetchUniversidades();
    await this.fetchLocaisRealizacao();
    await this.fetchAreasConhecimento();
    await this.fetchActividadesAcademicas();
    await this.fetchRegulamentos();

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  fetchCursos = async () => {
    try {
      const response = await api.get("curso/findAll");
      this.setState({
        cursos: response.data,
        filteredItems: response.data,
      });
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
  };

  fetchProjectos = async () => {
    try {
      const response = await api.get("projecto/findAll");
      this.setState({
        projectos: response.data,
      });
    } catch (error) {
      console.error("Erro ao carregar projectos:", error);
    }
  };

  fetchSemestres = async () => {
    try {
      const response = await api.get("semestre/findAll");
      this.setState({ semestres: response.data });
    } catch (error) {
      console.error("Erro ao carregar semestres:", error);
    }
  };

  fetchDisciplinas = async () => {
    try {
      const response = await api.get("disciplina/findAll");
      this.setState({ disciplinas: response.data });
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  };

  fetchAnosLectivos = async () => {
    try {
      const response = await api.get("anoLectivo/findAll");
      this.setState({ anosLectivos: response.data });
    } catch (error) {
      console.error("Erro ao carregar anos lectivos:", error);
    }
  };

  fetchUniversidades = async () => {
    try {
      const response = await api.get("universidade/findAll");
      this.setState({ universidades: response.data });
    } catch (error) {
      console.error("Erro ao carregar universidades:", error);
    }
  };

  fetchLocaisRealizacao = async () => {
    try {
      const response = await api.get("localRealizacao/findAll");
      this.setState({ locaisRealizacao: response.data });
    } catch (error) {
      console.error("Erro ao carregar locais realização:", error);
    }
  };

  fetchAreasConhecimento = async () => {
    try {
      const response = await api.get("areaConhecimento/findAll");
      this.setState({ areasConhecimento: response.data });
    } catch (error) {
      console.error("Erro ao carregar areas conhecimentos:", error);
    }
  };

  fetchActividadesAcademicas = async () => {
    try {
      const response = await api.get("actividadesAcademica/findAll");
      this.setState({ actividadesCientificas: response.data });
    } catch (error) {
      console.error("Erro ao carregar actividade académica:", error);
    }
  };

  fetchRegulamentos = async () => {
    try {
      const response = await api.get("regulamento/findAll");
      this.setState({ regulamentos: response.data });
    } catch (error) {
      console.error("Erro ao carregar regulamentos:", error);
    }
  };

  onEditClick = (e, data) => {
    e.preventDefault();
    this.setState({
      displayDialog: true,
      selectedEntity: this.state.selectedFilter,
      selectedTabela: data,
    });
  };

  onOpenModal = () => {
    this.setState({
      displayDialog: true,
      selectedEntity: this.state.selectedFilter,
    });
  };

  onCloseModal = () => {
    this.setState({
      displayDialog: false,
      selectedEntity: null,
    });
  };

  onFilterChange = (e) => {
    const selectedFilter = e.value;
    const filteredItems =
      selectedFilter === "Curso"
        ? this.state.cursos
        : selectedFilter === "Semestre"
        ? this.state.semestres
        : selectedFilter === "Disciplina"
        ? this.state.disciplinas
        : selectedFilter === "Ano Lectivo"
        ? this.state.anosLectivos
        : selectedFilter === "Universidade"
        ? this.state.universidades
        : selectedFilter === "Local Realização"
        ? this.state.locaisRealizacao
        : selectedFilter === "Área Conhecimento"
        ? this.state.areasConhecimento
        : selectedFilter === "Actividade Académica"
        ? this.state.actividadesCientificas
        : selectedFilter === "Regulamento"
        ? this.state.regulamentos
        : selectedFilter === "Projectos"
        ? this.state.projectos
        : [];

    this.setState({ selectedFilter, filteredItems });
  };

  itemTemplate = (selectedFilter, layout) => {
    if (!selectedFilter) return;

    if (layout === "list") {
      return this.dataviewListItem(selectedFilter);
    } else if (layout === "grid") {
      return this.dataviewGridItem(selectedFilter);
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
            href="##"
            onClick={(e) => this.onEditClick(e, data)}
            className="text-decoration-none"
            style={{
              color: "#333",
              textDecoration: "none",
            }}
          >
            <div className="text-xl mb-2">{data.designacao}</div>
            <div className="text-sm text-muted mb-2">
              {data.descricao && (
                <span className="mr-2">
                  <strong>Descrição: </strong>
                  {data.descricao}
                </span>
              )}
              {data.nivelCurso && (
                <span className="mr-2">
                  <strong>Nível Curso: </strong>
                  {data.nivelCurso}
                </span>
              )}
              {data.codigo && (
                <span className="mr-2">
                  <strong>Código: </strong>
                  {data.codigo}
                </span>
              )}
              {data.dataInicio && (
                <div>
                  <span className="mr-2">
                    <strong>Data Início: </strong>
                    {data.dataInicio}
                  </span>
                </div>
              )}
              {data.dataFim && (
                <div>
                  <span className="mr-2">
                    <strong>Data Fim: </strong>
                    {data.dataFim}
                  </span>
                </div>
              )}
              {data.sigla && (
                <div>
                  <span className="mr-2">
                    <strong>Sigla: </strong>
                    {data.sigla}
                  </span>
                </div>
              )}
              {data.fkCurso && (
                <div>
                  <span className="mr-2">
                    <strong>Curso: </strong>
                    {data.fkCurso?.designacao}
                  </span>
                </div>
              )}
              {data.ficheiro && (
                <div>
                  <span className="mr-2">
                    <strong>Ficheiro: </strong>

                    {data.ficheiro}
                  </span>
                </div>
              )}
              {data.dataActualizacao && (
                <div>
                  <span className="mr-2">
                    <strong>Data Actualização: </strong>
                    {data.dataActualizacao}
                  </span>
                </div>
              )}
              {data.estado && (
                <div>
                  <span className="mr-2">
                    <strong>Estado: </strong>
                    {data.estado}
                  </span>
                </div>
              )}
              {data.convenioCientifico && (
                <div>
                  <span className="mr-2">
                    <strong>Convênio Científico: </strong>
                    {data.convenioCientifico}
                  </span>
                </div>
              )}
              {data.fkActividadesAcademica && (
                <div>
                  <span className="mr-2">
                    <strong>Actividade Académica: </strong>
                    {data.fkActividadesAcademica?.designacao}
                  </span>
                </div>
              )}
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
              (window.location.href = `/${this.state.selectedFilter}/${
                data["pk" + this.state.selectedFilter]
              }`)
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
        {this.state.selectedFilter === "Projectos" && (
          <div>
            <div className="text-900 text-2xl font-bold my-3">
              <a
                href="##
           "
                onClick={(e) => this.onEditClick(e, data)}
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
            <div className="font-italic text-600 mt-3">{data.estado}</div>
          </div>
        )}

        <div className="text-900 text-2xl font-bold my-3">
          <a
            href="##
            "
            onClick={(e) => this.onEditClick(e, data)}
            className="text-900 text-xl font-medium"
            style={{
              color: "#333",
              fontSize: "1.25rem",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            {data.designacao}
          </a>
        </div>
        <div className="font-italic text-600 mt-3">
          <i className="pi pi-info-circle mr-2"></i>
          {this.state.selectedFilter}
        </div>
      </div>
    </div>
  );

  render() {
    const {
      usuarioLogado,
      layout,
      sortOrder,
      sortField,

      filteredItems,
      selectedFilter,
    } = this.state;

    const filterOptions = [
      { label: "Projectos", value: "Projectos" },
      { label: "Curso", value: "Curso" },
      { label: "Semestre", value: "Semestre" },
      { label: "Disciplina", value: "Disciplina" },
      { label: "Ano Lectivo", value: "Ano Lectivo" },
      { label: "Universidade", value: "Universidade" },
      { label: "Regulamento", value: "Regulamento" },
      { label: "Local Realização", value: "Local Realização" },
      { label: "Área Conhecimento", value: "Área Conhecimento" },
      { label: "Actividade Académica", value: "Actividade Académica" },
    ];

    const dataViewHeader = (
      <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
        <Dropdown
          value={selectedFilter}
          optionLabel="label"
          placeholder="Filtrar Por Tabela"
          onChange={this.onFilterChange}
          options={filterOptions}
          style={{ width: "70vw" }}
        />
        <Button
          label="Adicionar Novo"
          className="p-button-outlined"
          style={{ width: "10rem" }}
          onClick={this.onOpenModal}
          //onClick={() => this.setState({ displayDialogTemplate: true })}
        />
        <CustomDataViewLayoutOptions
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
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/tarefa-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Tabelas do Sistema
                  </a>
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
                  value={filteredItems}
                  layout={layout}
                  paginator
                  rows={12}
                  sortOrder={sortOrder}
                  sortField={sortField}
                  itemTemplate={(item) => this.itemTemplate(item, layout)}
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
          header={`Cadastrar ${selectedFilter}`}
          visible={this.state.displayDialog}
          onHide={this.onCloseModal}
          style={{ width: "50vw" }}
          modal
        >
          {this.state.selectedEntity === "Curso" && (
            <Curso
              pkCurso={"pk" + this.state.selectedFilter}
              curso={this.state.selectedTabela}
            />
          )}
          {this.state.selectedEntity === "Disciplina" && (
            <Disciplina
              pkDisciplina={"pk" + this.state.selectedFilter}
              disciplina={this.state.selectedTabela}
            />
          )}
          {this.state.selectedEntity === "Semestre" && (
            <Semestre
              pkSemestre={"pk" + this.state.selectedFilter}
              semestre={this.state.selectedTabela}
            />
          )}
          {this.state.selectedEntity === "Ano Lectivo" && (
            <AnoLectivo
              pkAnoLectivo={"pk" + this.state.selectedFilter}
              AnoLectivo={this.state.selectedTabela}
            />
          )}

          {this.state.selectedEntity === "Universidade" && (
            <Universidade
              pkUniversidade={"pk" + this.state.selectedFilter}
              universidade={this.state.selectedTabela}
            />
          )}
          {this.state.selectedEntity === "Local Realização" && (
            <LocalRealizacao
              pkLocalRealizacao={"pk" + this.state.selectedFilter}
              localRealizacao={this.state.selectedTabela}
            />
          )}
          {this.state.selectedEntity === "Área Conhecimento" && (
            <AreaConhecimento
              pkAreaConhecimento={"pk" + this.state.selectedFilter}
              areaConhecimento={this.state.selectedTabela}
            />
          )}
          {this.state.selectedEntity === "Actividade Académica" && (
            <ActividadeAcademica
              pkActividadeAcademica={"pk" + this.state.selectedFilter}
              actividadeAcademica={this.state.selectedTabela}
            />
          )}

          {this.state.selectedEntity === "Projectos" && (
            <Projecto
              pkProjecto={"pk" + this.state.selectedFilter}
              projecto={this.state.selectedTabela}
            />
          )}

          {this.state.selectedEntity === "Regulamento" && <Regulamento />}
        </Dialog>
      </div>
    );
  }
}

export default TabelasSistema;
