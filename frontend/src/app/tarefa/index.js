import React, { Component } from "react";
import api from "../axiosConfig";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import "react-datepicker/dist/react-datepicker.css";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import TarefaFormCadastrar from "../tarefa/FormCadastrar";

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

export class TarefaIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      tarefas: [],
      templates: [],
      layout: "grid",
      sortKey: null,
      sortOrder: null,
      sortField: "",
      globalFilterValue: "",
      filteredTarefas: null,
      selectedDate: new Date(),
      events: [],

      tarefasSelecionadas: [],
      tarefaOptions: [],

      toast: null,
      selectedFilter: "Tarefas",
    };
  }

  fetchData = async () => {
    try {
      const responseTarefas = await api.get("tarefa/findAll");

      const tarefaOptions = responseTarefas.data.map((e) => ({
        label: e.designacao,
        value: e.pkTarefa,
      }));

      this.setState({ tarefaOptions, loading: false });
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      this.setState({ error, loading: false });
    }
  };

  async componentDidMount() {
    this.fetchData();
    await this.fetchTarefas();
    await this.fetchTemplates();

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  fetchTarefas = async () => {
    try {
      const response = await api.get("tarefa/findAll");
      this.setState({
        tarefas: response.data,
        filteredItems: response.data,
      });
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  };

  fetchTemplates = async () => {
    try {
      const response = await api.get("template/findAll");
      this.setState({ templates: response.data });
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
    }
  };

  onFilterChange = (e) => {
    const selectedFilter = e.value;
    const filteredItems =
      selectedFilter === "Tarefas"
        ? this.state.tarefas
        : selectedFilter === "Templates"
        ? this.state.templates
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

  handleDateClick = (date) => {
    //setSelectedDate(date);
    this.setState({ selectedDate: date });
    alert(`Você clicou no dia: ${date.toLocaleDateString()}`);
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
            href={`${this.state.selectedFilter
              .slice(0, -1)
              .toLowerCase()}-visualizar/${
              data["pk" + this.state.selectedFilter.slice(0, -1)]
            }`}
            className="text-decoration-none"
            style={{
              color: "#333",
              textDecoration: "none",
            }}
          >
            <div className="text-xl mb-2">{data.designacao}</div>
            {this.state.selectedFilter === "Tarefas" ? (
              <div className="text-sm text-muted mb-2">
                <span className="mr-2">
                  <strong>Peso:</strong>
                  {data.peso}
                </span>
                <span className="mr-2">
                  <strong>Tipo:</strong>
                  {data.tipoTarefa}
                </span>
                <span className="mr-2">
                  <strong>Criada por:</strong>
                  {data.createdBy.nome}
                </span>
              </div>
            ) : (
              <></>
            )}
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
              (window.location.href = `/tarefa-visualizar/${data.pkTarefa}`)
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
          height: "33vh",
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
            href={`/${this.state.selectedFilter
              .slice(0, -1)
              .toLowerCase()}-visualizar/${
              data["pk" + this.state.selectedFilter.slice(0, -1)]
            }`}
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
          {this.state.selectedFilter.slice(0, -1)}
        </div>
      </div>
    </div>
  );

  handleTemplateSubmit = async (e) => {
    const { designacao } = this.state;

    if (!designacao) {
      this.toast.show({
        severity: "warn",
        summary: "Aviso",
        detail: "Designação é obrigatória.",
        life: 3000,
      });
    }

    e.preventDefault();
    try {
      const templateResponse = await api.post("template/save", {
        designacao,
      });

      const fkTemplate = templateResponse.data.pkTemplate;

      if (
        this.state.tarefasSelecionadas &&
        this.state.tarefasSelecionadas.length > 0
      ) {
        await Promise.all(
          this.state.tarefasSelecionadas.map(async (tarefa, index) => {
            await api.post("templateTarefa/save", {
              fkTemplate,
              fkTarefa: tarefa,
              posicaoTarefaTemplate: index + 1,
            });
          })
        );
      }

      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Template criado com sucesso!",
        life: 3000,
      });
      window.location.reload();
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao criar template.",
        life: 3000,
      });
    }
  };

  render() {
    const {
      usuarioLogado,
      layout,
      sortOrder,
      sortField,
      globalFilterValue,
      tarefasSelecionadas,
      designacao,
      tarefaOptions,
      displayDialogTemplate,

      filteredItems,
      selectedFilter,
    } = this.state;

    const isOrientador =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Orientador";

    const filterOptions = [
      { label: "Tarefas", value: "Tarefas" },
      { label: "Templates", value: "Templates" },
    ];

    const dataViewHeader = (
      <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
        <Dropdown
          value={selectedFilter}
          optionLabel="label"
          placeholder="Filtrar Por"
          onChange={this.onFilterChange}
          options={filterOptions}
        />
        <span className="p-input-icon-left ">
          <InputText
            value={globalFilterValue}
            onChange={this.onFilter}
            placeholder="  Pesquisar por designação"
          />
        </span>
        {isOrientador && (
          <Button
            label="Novo Template"
            className="p-button"
            style={{ width: "15rem" }}
            onClick={() => this.setState({ displayDialogTemplate: true })}
          />
        )}
        {isOrientador && (
          <Link to="/tarefa-cadastrar">
            <Button
              label="Nova Tarefa"
              className="p-button"
              style={{ width: "10rem" }}
            />
          </Link>
        )}

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
                    Tarefas e Templates
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Lista de Tarefas e Templates
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
                  value={filteredItems}
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
          header="Cadastrar Template"
          visible={displayDialogTemplate}
          style={{ width: "60vw" }}
          onHide={() => this.setState({ displayDialogTemplate: false })}
        >
          <form onSubmit={this.handleTemplateSubmit}>
            <div className="surface-section surface-card p-5 border-round flex-auto">
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label htmlFor="designacao">Designação</label>
                  <InputText
                    id="designacao"
                    name="designacao"
                    value={designacao}
                    onChange={(e) =>
                      this.setState({ designacao: e.target.value })
                    }
                    required
                    className="p-inputtext p-component w-full"
                  />
                </div>
              </div>
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
                className="grid"
              >
                <div style={{ flex: 1, marginRight: 5 }} className="col-11">
                  <label htmlFor="tarefas">Tarefas</label>
                  <MultiSelect
                    id="tarefas"
                    value={tarefasSelecionadas}
                    options={tarefaOptions}
                    onChange={(e) =>
                      this.setState({ tarefasSelecionadas: e.value })
                    }
                    filter={true}
                    placeholder="Selecione as tarefas"
                    display="chip"
                    required
                    className="p-inputtext p-component w-full"
                  />
                </div>
                <Button
                  label=""
                  icon="pi pi-plus"
                  className="p-button-label col-1"
                  style={{ marginTop: 5, width: "2rem", height: "2rem" }}
                  onClick={() => this.setState({ displayDialogTarefa: true })}
                />
              </div>

              <Button
                type="submit"
                label="Criar Template"
                className="p-button-outlined mr-2"
              />
            </div>
          </form>

          <Dialog
            header="Adicionar Tarefa"
            visible={this.state.displayDialogTarefa}
            style={{ width: "50vw" }}
            onHide={() => this.setState({ displayDialogTarefa: false })}
          >
            <TarefaFormCadastrar onTarefaSaved={this.fetchData} />
          </Dialog>
        </Dialog>
      </div>
    );
  }
}

export default TarefaIndex;
