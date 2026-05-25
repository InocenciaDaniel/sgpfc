import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import api from "../axiosConfig";
import { Calendar } from "primereact/calendar";

export class PresencaMarcar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: [],
      error: null,
      loading: true,
      estudantesPresentes: [],
      turma: "",
      dataPresenca: null,
    };
  }

  fetchData = async () => {
    try {
      const usuario = localStorage.getItem("usuario");
      const idUtilizador = JSON.parse(usuario).fkUtilizador.pkUtilizador;

      const { id } = this.props.match.params;

      const url = `turmaEstudante/findTurmaByOrientadorAndTurmaMarcarPresenca/${idUtilizador}/${id}`;
      const response = await api.get(url);

      const turmaResponse = await api.get(`turma/${id}`);

      this.setState({
        data: response.data,
        loading: false,
        turma: turmaResponse.data,
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

  onSelectionChange = (e) => {
    this.setState({ estudantesPresentes: e.value });
  };

  salvar = async (e) => {
    e.preventDefault();
    const { estudantesPresentes, data, turma, dataPresenca } = this.state;
    if (!dataPresenca) {
      this.toast.show({
        severity: "warn",
        summary: "Aviso",
        detail: "Por favor, selecione uma data para a marcação da presença.",
        life: 5000,
      });
      return;
    }

    const presencaData = data.map((estudante) => {
      const isPresente = estudantesPresentes.some(
        (presente) =>
          presente.fkEstudante.pkUtilizador ===
          estudante.fkEstudante.pkUtilizador
      );

      return {
        fkEstudante: estudante.fkEstudante.pkUtilizador,
        data: dataPresenca,
        estado: isPresente ? "Presente" : "Ausente",
        fkTurma: this.state.turma.pkTurma,
      };
    });

    try {
      // Enviando para o backend
      const response = await api.post("presenca/save", presencaData);
      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Presenças marcadas com sucesso!",
        life: 5000,
      });
      console.log(response.data);

      // Redirecionar após salvar
      this.props.history.push(`/lista-estudantes-presenca/${turma.pkTurma}`);
    } catch (error) {
      console.error("Erro ao salvar presenças:", error);
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao marcar presenças. Tente novamente.",
        life: 5000,
      });
    }
  };

  render() {
    const {
      usuarioLogado,
      data,
      error,
      estudantesPresentes,
      turma,
      dataPresenca,
    } = this.state;

    if (error) {
      return <div>Erro ao carregar os dados: {error.message}</div>;
    }

    return (
      <div>
        {usuarioLogado ? (
          <div className="p-7">
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/presenca-index"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Presenças
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Fazer Chamada
                  </span>
                </li>
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <Calendar
                  value={dataPresenca}
                  onChange={(e) => this.setState({ dataPresenca: e.value })}
                  maxDate={new Date()}
                  showIcon
                  dateFormat="dd/mm/yy"
                  placeholder="Selecione a data"
                  className="mr-3 w-full"
                />
                <div className="flex align-items-center text-700 flex-wrap"></div>
                <div className="mt-3 lg:mt-0">
                  <Link to="/presenca-marcar">
                    <Button
                      icon="pi pi-save"
                      label="Salvar"
                      className="p-button mr-2"
                      onClick={this.salvar}
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="surface-section">
              <div className="grid">
                <div className="col-12 lg:col lg:px-5">
                  <div className="overflow-x-auto">
                    <div
                      className="p-datatable p-component p-datatable-hoverable-rows p-datatable-scrollable p-datatable-responsive-scroll border border-gray-300 rounded-md shadow-sm"
                      style={{ minWidth: "60rem" }}
                      data-scrollselectors=".p-datatable-wrapper"
                      pr_id_1=""
                    >
                      {" "}
                      <DataTable
                        value={data}
                        className="table-custom"
                        dataKey="fkEstudante.pkUtilizador"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        selectionMode="checkbox" // Configura para seleção com checkboxes
                        selection={estudantesPresentes}
                        onSelectionChange={this.onSelectionChange}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} para {last} de {totalRecords} utilizadores"
                        responsiveLayout="scroll"
                      >
                        <Column
                          selectionMode="multiple"
                          headerStyle={{ width: "3rem" }}
                        ></Column>
                        <Column
                          field="fkEstudante.numMatriculaEstudante"
                          sortable
                          header="Nº Matricula"
                        ></Column>
                        <Column
                          field="fkEstudante.nome"
                          sortable
                          header="Nome Estudante"
                        ></Column>
                      </DataTable>
                    </div>
                  </div>
                </div>
                <div className="col-12 lg:col-3 lg:border-left-1 surface-border">
                  <div className="p-3">
                    <span className="text-900 font-medium text-xl block mb-5">
                      {turma.codigo}
                    </span>
                    <div className="flex">
                      <div className="flex flex-column align-items-start">
                        <p>
                          <b>Curso: </b>
                          {turma.fkDisciplina?.fkCurso?.designacao}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex flex-column align-items-start">
                        <p>
                          <b>Coordenador: </b>
                          {turma.fkCoodenador?.nome}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex flex-column align-items-start">
                        <p>
                          <b>Disciplina: </b>
                          {turma.fkDisciplina?.designacao}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex flex-column align-items-start">
                        <p>
                          <b>Semestre: </b>
                          {turma.fkSemestre?.designacao}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex flex-column align-items-start">
                        <p>
                          <b>Ano Lectivo: </b>
                          {turma.fkAnoLectivo?.designacao}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex flex-column align-items-start">
                        <p>
                          <b>Data Inicio Semestre: : </b>
                          {turma.dataInicioSemestre}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex flex-column align-items-start">
                        <p>
                          <b>Data Fim Semestre: : </b>
                          {turma.dataFimSemestre}
                        </p>
                      </div>
                    </div>
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

export default PresencaMarcar;
