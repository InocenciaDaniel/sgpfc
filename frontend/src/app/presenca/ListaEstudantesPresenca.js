import React, { Component } from "react";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import moment from "moment";
import { InputText } from "primereact/inputtext"; // Importando InputText para filtro

export class ListaEstudantesPresenca extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      loading: true,
      error: null,
      turma: "",
      groupedData: {},
      expandedRows: {},
      searchDate: "",
    };
    this.toast = React.createRef();
  }

  fetchData = async () => {
    try {
      const usuario = localStorage.getItem("usuario");

      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });
      }
      const usuarioLogado = JSON.parse(usuario).fkUtilizador;

      const { id } = this.props.match.params;
      console.log(id, usuarioLogado);
      const response = await api.get(
        `presenca/findPresencaEstudantesComProjectoEmAndamentoNaTurma/${id}`
      );

      const turmaResponse = await api.get(`turma/${id}`);

      // Agrupando por data
      const groupedData = this.groupByDate(response.data);

      this.setState({
        loading: false,
        groupedData,
        turma: turmaResponse.data,
      });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  // Função para agrupar os dados por data
  groupByDate = (data) => {
    return data.reduce((acc, curr) => {
      const date = moment(curr.data).format("DD/MM/YYYY");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      return acc;
    }, {});
  };

  // Função para filtrar as datas com base no campo de pesquisa
  handleDateSearch = (event) => {
    this.setState({ searchDate: event.target.value });
  };

  componentDidMount() {
    this.fetchData();
  }

  alterarEstado = async (pkPresenca, estadoAtual) => {
    try {
      const novoEstado = estadoAtual === "Presente" ? "Ausente" : "Presente";

      const response = await api.put(`presenca/alterarEstado`, null, {
        params: {
          pkPresenca: pkPresenca,
          estado: novoEstado,
        },
      });

      const updatedGroupedData = { ...this.state.groupedData };
      Object.keys(updatedGroupedData).forEach((date) => {
        updatedGroupedData[date] = updatedGroupedData[date].map((presenca) =>
          presenca.pkPresenca === pkPresenca
            ? { ...presenca, estado: novoEstado }
            : presenca
        );
      });

      this.setState({ groupedData: updatedGroupedData });

      // Mostrar mensagem de sucesso
      this.toast.current.show({
        severity: "success",
        summary: "Alteração Concluída",
        detail: response.data,
        life: 3000,
      });
    } catch (error) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível alterar o estado.",
        life: 3000,
      });
    }
  };

  renderActionButton = (rowData) => {
    return (
      <Button
        label={
          rowData.estado === "Presente" ? "Marcar Ausente" : "Marcar Presente"
        }
        className={`p-button-${
          rowData.estado === "Presente" ? "danger" : "success"
        }`}
        onClick={() => this.alterarEstado(rowData.pkPresenca, rowData.estado)}
      />
    );
  };

  render() {
    const { usuarioLogado, error, groupedData, turma, searchDate } = this.state;

    const filteredData = Object.keys(groupedData).filter((date) =>
      date.includes(searchDate)
    );

    const isOrientador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador";

    if (error) {
      return <div>Erro ao carregar os dados: {error.message}</div>;
    }

    return (
      <div>
        <Toast ref={this.toast} />
        {usuarioLogado ? (
          <div className="p-7">
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
                    Lista de Estudantes
                  </span>
                </li>
              </ul>

              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div className="flex align-items-center text-700 flex-wrap">
                  <div className="">
                    <InputText
                      value={searchDate}
                      onChange={this.handleDateSearch}
                      placeholder="Pesquise por data (DD/MM/YYYY)"
                      style={{ width: "62em" }}
                    />
                  </div>
                </div>
                <div className="mt-3 lg:mt-0">
                  {isOrientador ? (
                    <Link to={`/presenca-marcar/${turma.pkTurma}`}>
                      <Button
                        label="Fazer Chamada"
                        className="p-button mr-2"
                      />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                <div className="grid">
                  <div className="col-12 lg:col lg:px-5">
                    <div className="overflow-x-auto">
                      <div className="p-datatable p-component p-datatable-hoverable-rows p-datatable-scrollable p-datatable-responsive-scroll border border-gray-300 rounded-md shadow-sm">
                        <Accordion>
                          {filteredData.map((date) => (
                            <AccordionTab key={date} header={date}>
                              <DataTable
                                value={groupedData[date]}
                                className="table-custom"
                                dataKey="fkEstudante.pkUtilizador"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} para {last} de {totalRecords} utilizadores"
                                responsiveLayout="scroll"
                              >
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
                                <Column
                                  field="data"
                                  sortable
                                  header="Data"
                                ></Column>
                                <Column
                                  field="estado"
                                  sortable
                                  header="Estado"
                                ></Column>
                                {isOrientador && (
                                  <Column
                                    header="Ações"
                                    body={this.renderActionButton}
                                  ></Column>
                                )}
                              </DataTable>
                            </AccordionTab>
                          ))}
                        </Accordion>
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
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default ListaEstudantesPresenca;
