import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import "react-datepicker/dist/react-datepicker.css";
import { Toast } from "primereact/toast";

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
      </div>
    );
  }
}

export class ListaTarefasEstudante extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      tarefas: [],
      templates: [],
      layout: "list",
      sortKey: null,
      sortOrder: null,
      sortField: "",
      globalFilterValue: "",
      filteredTarefas: null,
      selectedDate: new Date(),
      events: [],
      projecto: "",

      tarefasSelecionadas: [],
      tarefaOptions: [],

      desabilitarFiltros: false,

      toast: null,
    };
  }

  fetchData = async () => {
    try {
      const usuario = localStorage.getItem("usuario");

      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });
      }

      if (
        JSON.parse(usuario)?.fkUtilizador?.fkTipoConta?.designacao ===
        "Estudante"
      ) {
        const fkTurmaEstudanteMatriculadoResponse = await api.get(
          `turma/findTurmaByEstudante/${
            JSON.parse(usuario)?.fkUtilizador?.pkUtilizador
          }`
        );
        this.setState({
          turmaSelecionada: fkTurmaEstudanteMatriculadoResponse.data,
        });

        const response = await api.get(
          `projecto/findByFkEstudanteProjectoEmAndamento/${
            JSON.parse(localStorage.getItem("usuario"))?.fkUtilizador
              ?.pkUtilizador
          }`
        );

        this.setState({ projecto: response.data });
        if (response.data) {
          const responseTarefasDoEstudanteAtribuidasAoEstudante = await api.get(
            `tarefasAtribuidas/findAllTarefasDoEstudanteAtribuidasAoEstudante/${this.state.projecto?.fkEstudante?.pkUtilizador}/${this.state.projecto?.pkProjecto}`
          );

          const responseTarefasDoEstudanteAtribuidasATurma = await api.get(
            `tarefasAtribuidas/findAllTarefasDoEstudanteAtribuidasATurma/${this.state.turmaSelecionada?.pkTurma}`
          );

          this.setState({
            tarefas: [
              ...responseTarefasDoEstudanteAtribuidasAoEstudante.data,
              ...responseTarefasDoEstudanteAtribuidasATurma.data,
            ],
          });
        } else if (fkTurmaEstudanteMatriculadoResponse.data) {
          const responseTarefasDoEstudanteAtribuidasATurma = await api.get(
            `tarefasAtribuidas/findAllTarefasDoEstudanteAtribuidasATurma/${this.state.turmaSelecionada?.pkTurma}`
          );

          this.setState({
            tarefas: [...responseTarefasDoEstudanteAtribuidasATurma.data],
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      this.setState({ error, loading: false });
    }
  };

  async componentDidMount() {
    this.fetchData();

    if (this.props.desabilitarFiltros) {
      this.setState({ desabilitarFiltros: this.props.desabilitarFiltros });
    }
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  onFilter = (e) => {
    const value = e.target.value.toLowerCase();
    this.setState({ globalFilterValue: value });

    if (!value) {
      this.setState({ filteredTarefas: null });
    } else {
      const filtered = this.state.tarefas.filter((product) =>
        product.designacaoTarefa.toLowerCase().includes(value)
      );
      this.setState({ filteredTarefas: filtered });
    }
  };

  onSortChangeAtribuicao = (event) => {
    const value = event.value;
    this.setState({ sortKey: value });

    let sortedTarefas;
    switch (value) {
      case "Turma":
        sortedTarefas = [...this.state.tarefas].filter(
          (product) => product.tarefaAtribuidaA === "Turma"
        );
        break;
      case "Estudante":
        sortedTarefas = [...this.state.tarefas].filter(
          (product) => product.tarefaAtribuidaA === "Estudante"
        );
        break;
      default:
        sortedTarefas = [...this.state.tarefas];
        break;
    }

    this.setState({
      filteredTarefas: sortedTarefas,
    });
  };

  onSortChangeTipoTarefa = (event) => {
    const value = event.value;
    this.setState({ sortKey: value });

    let sortedTarefas;
    switch (value) {
      case "Apresentação do relatório de progresso":
        sortedTarefas = [...this.state.tarefas].filter(
          (product) =>
            product.tipoTarefa === "Apresentação do relatório de progresso"
        );
        break;
      case "Avaliação dos seminário":
        sortedTarefas = [...this.state.tarefas].filter(
          (product) => product.tipoTarefa === "Avaliação dos seminário"
        );
        break;
      case "Participação":
        sortedTarefas = [...this.state.tarefas].filter(
          (product) => product.tipoTarefa === "Participação"
        );
        break;
      default:
        sortedTarefas = [...this.state.tarefas];
        break;
    }

    this.setState({
      filteredTarefas: sortedTarefas,
    });
  };

  itemTemplate = (tarefa, layout) => {
    if (!tarefa) return;

    if (layout === "list") {
      return this.dataviewListItem(tarefa);
    }
  };

  dataviewListItem = (data) => (
    <div className="col-12 p-1">
      <div
        className="py-3 border-bottom-1 surface-border flex flex-column md:flex-row align-items-center p-3 w-full hover:shadow-2 border-round surface-card transition-all"
        style={{
          padding: "15px",
          cursor: "pointer",
        }}
      >
        <div className="flex-grow-1">
          <a
            href={"##"}
            className="text-decoration-none"
            style={{
              color: "#333",
              textDecoration: "none",
            }}
          >
            <div className=" mb-2">
              {data?.designacaoTarefa.charAt(0).toUpperCase() +
                data?.designacaoTarefa.slice(1).toLowerCase()}
            </div>
          </a>
        </div>
        <div className="ml-3">
          {/*<button
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
          </button>*/}
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
      globalFilterValue,
      sortKey,
      filteredTarefas,
      desabilitarFiltros,
    } = this.state;

    const dataViewHeader = (
      <div>
        {desabilitarFiltros === false && (
          <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown
              value={sortKey}
              options={[
                { label: "Turma", value: "Turma" },
                { label: "Estudante", value: "Estudante" },
              ]}
              optionLabel="label"
              placeholder="Filtrar Por Atribuição da Tarefa"
              onChange={this.onSortChangeAtribuicao}
            />
            <Dropdown
              value={sortKey}
              options={[
                { label: "Participação", value: "Participação" },
                {
                  label: "Avaliação dos seminário",
                  value: "Avaliação dos seminário",
                },
                {
                  label: "Apresentação do relatório de progresso",
                  value: "Apresentação do relatório de progresso",
                },
              ]}
              optionLabel="label"
              placeholder="Filtrar Por Tipo da Tarefa"
              onChange={this.onSortChangeTipoTarefa}
            />
            <span className="p-input-icon-left ">
              <InputText
                value={globalFilterValue}
                onChange={this.onFilter}
                placeholder="  Pesquisar por designação"
              />
            </span>

            <CustomDataViewLayoutOptions
              layout={layout}
              onChange={(e) => this.setState({ layout: e.value })}
            />
          </div>
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
          <div>
            <Toast ref={(el) => (this.toast = el)} />

            <DataView
              value={filteredTarefas || this.state.tarefas}
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
        ) : null}
      </div>
    );
  }
}

export default withRouter(ListaTarefasEstudante);
