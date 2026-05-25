import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import api from "../axiosConfig";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Badge } from "primereact/badge";
import AtribuirTarefas from "./AtribuirTarefas";
import { Link } from "react-router-dom";
import { Paginator } from "primereact/paginator";

class TurmaVisualizar extends Component {
  state = {
    usuarioLogado: null,
    id: null,
    turma: null,
    tarefas: [],

    startDate: new Date(),
    codigo: "",
    anoLectivo: null,
    semestre: null,
    disciplina: null,
    coordenador: null,
    estudantes: [],
    semestreOptions: [],
    disciplinaOptions: [],
    coordenadorOptions: [],
    anoLectivoOptions: [],
    dataInicioSemestre: "",
    dataFimSemestre: "",

    modalAddEstudantes: false,
    modalEditTurma: false,
    estudanteOptions: [],
    estudante: null,

    mensagem: null,
    tipoMensagem: null,
    showDialog: false,
    toast: null,

    habilitarTurmaVisible: false,

    firstTurma: 0,
    rowsTurma: 6,
  };

  async componentDidMount() {
    try {
      const semestreResponse = await api.get("semestre/findAll");
      const semestreOptions = semestreResponse.data.map((s) => ({
        label: s.designacao,
        value: s.pkSemestre,
      }));

      const disciplinaResponse = await api.get("disciplina/findAll");
      const disciplinaOptions = disciplinaResponse.data.map((tc) => ({
        label: tc.designacao,
        value: tc.pkDisciplina,
      }));

      const coordenadorResponse = await api.get("utilizador/findAllOrientador");
      const coordenadorOptions = coordenadorResponse.data.map((tc) => ({
        label: tc.nome,
        value: tc.pkUtilizador,
      }));

      const estudanteResponse = await api.get(
        "utilizador/findAllEstudanteSemTurma"
      );
      const estudanteOptions = estudanteResponse.data.map((e) => ({
        label: `${e.nome} - ${e.numMatriculaEstudante}`,
        value: e.pkUtilizador,
      }));

      const anoLectivoResponse = await api.get("anoLectivo/findAll");
      const anoLectivoOptions = anoLectivoResponse.data.map((al) => ({
        label: al.designacao,
        value: al.pkAnoLectivo,
      }));

      const { id } = this.props.match.params;
      const turmaResponse = await api.get(`turma/${id}`);

      const response = await api.get(`turmaEstudante/findByFkTurma/${id}`);
      this.setState({ estudantes: response.data });

      const responseTarefasDoEstudanteAtribuidasATurma = await api.get(
        `tarefasAtribuidas/findAllTarefasDoEstudanteAtribuidasATurma/${turmaResponse.data?.pkTurma}`
      );

      this.setState({
        id,
        turma: turmaResponse.data,
        codigo: turmaResponse.data.codigo,
        semestre: turmaResponse.data.fkSemestre.pkSemestre,
        disciplina: turmaResponse.data.fkDisciplina.pkDisciplina,
        coordenador: turmaResponse.data.fkCoodenador.pkUtilizador,
        anoLectivo: turmaResponse.data.fkAnoLectivo.pkAnoLectivo,
        dataInicioSemestre: new Date(turmaResponse.data.dataInicioSemestre),
        dataFimSemestre: new Date(turmaResponse.data.dataFimSemestre),
        semestreOptions,
        disciplinaOptions,
        coordenadorOptions,
        estudanteOptions,
        anoLectivoOptions,
        tarefas: responseTarefasDoEstudanteAtribuidasATurma.data,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  onPageChangeTurma = (event) => {
    this.setState({
      firstTurma: event.first,
    });
  };

  addEstudantes = async () => {
    const { estudante } = this.state;

    if (!estudante) {
      this.toast.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Por favor, selecione pelo menos 1 estudante.",
        life: 3000,
      });
      return;
    }
    try {
      await Promise.all(
        estudante.map(async (estudante) => {
          await api.post("turmaEstudante/save", {
            fkTurma: this.state.id,
            fkEstudante: estudante,
            estado: "activo",
          });
        })
      );
      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Estudantes adicionados com sucesso!",
        life: 5000,
      });

      const response = await api.get(
        `turmaEstudante/findByFkTurma/${this.state.id}`
      );
      this.setState({ estudantes: response.data, modalAddEstudantes: false });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao adicionar estudantes.",
        life: 3000,
      });
      console.error("Erro ao adicionar estudantes", error);
    }
  };

  removerEstudante = async (pkTurmaEstudante) => {
    try {
      await api.delete(`turmaEstudante/deleteById/${pkTurmaEstudante}`);
      this.setState((prevState) => ({
        estudantes: prevState.estudantes.filter(
          (estudante) => estudante.pkTurmaEstudante !== pkTurmaEstudante
        ),
      }));
      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Estudante removido com sucesso!",
        life: 5000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao remover estudante.",
        life: 5000,
      });
      console.error("Erro ao remover estudante.", error);
    }
  };

  removerTarefa = async (pkTarefasAtribuidas) => {
    try {
      await api.delete(`tarefasAtribuidas/deleteById/${pkTarefasAtribuidas}`);
      this.setState((prevState) => ({
        tarefas: prevState.tarefas.filter(
          (tarefa) => tarefa.pkTarefasAtribuidas !== pkTarefasAtribuidas
        ),
      }));
      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Tarefa removida da turma com sucesso!",
        life: 5000,
      });
      window.location.reload();
    } catch (error) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao remover tarefa.",
        life: 5000,
      });
      console.error("Erro ao remover tarefa.", error);
    }
  };

  abrirDialog = () => {
    this.setState({ showDialog: true });
  };

  fecharDialog = () => {
    this.setState({ showDialog: false });
  };

  handleDelete = async () => {
    try {
      await api.delete(
        `turma/deleteById/${this.state.id}/${this.state.usuarioLogado.fkUtilizador.pkUtilizador}`
      );
      this.setState({
        showDialog: false,
      });

      if (this.props.onDelete) {
        this.props.onDelete(this.state.id);
      }

      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Turma eliminada com sucesso.",
        life: 5000,
      });
      this.props.history.push("/turma-index");
    } catch (error) {
      this.setState({
        showDialog: false,
      });

      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao desabilitar a turma.",
        life: 5000,
      });
    }
  };

  handleUpdateTurma = async (e) => {
    e.preventDefault();
    const {
      id,
      codigo,
      anoLectivo,
      semestre,
      disciplina,
      coordenador,
      estudante,
      dataInicioSemestre,
      dataFimSemestre,
    } = this.state;

    if (new Date(dataInicioSemestre) >= new Date(dataFimSemestre)) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail:
          "A data de início do semestre deve ser inferior à data de fim do semestre.",
        life: 3000,
      });
      return;
    }

    try {
      await api.put(`turma/update/`, {
        pkTurma: id,
        codigo,
        anoLectivo,
        semestre,
        disciplina,
        coordenador,
        estudante,
        dataInicioSemestre,
        dataFimSemestre,
      });
      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Turma actualizada com sucesso!",
        life: 3000,
      });

      window.location.reload();
    } catch (error) {
      console.error("Error updating user data", error);
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao actualizar turma.",
        life: 3000,
      });
    }
  };

  render() {
    const { turma, usuarioLogado, firstTurma, rowsTurma } = this.state;
    const isOrientador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador";
    const isAdmin =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "admin";
    const footer = (
      <div className="border-top-1 surface-border pt-3">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button-text"
          onClick={this.fecharDialog}
        />
        <Button
          label="Desabilitar"
          icon="pi pi-check"
          className="p-button-danger"
          onClick={this.handleDelete}
        />
      </div>
    );

    const estudantesToShow = this.state.estudantes.slice(
      firstTurma,
      firstTurma + rowsTurma
    );

    return (
      <div>
        {usuarioLogado ? (
          <div className="p-7">
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-card p-4 shadow-2 border-round">
              <div className="font-medium text-2xl text-900 mb-3">
                <div className="flex justify-content-between align-items-center">
                  <span>
                    {" "}
                    <i className="pi pi-book text-500 mr-2 text-xl"></i>
                    Informações Gerais da Turma
                  </span>
                  {isOrientador &&
                  new Date(this.state.turma?.dataFimSemestre) > new Date() ? (
                    <Link to={`/presenca-marcar/${turma.pkTurma}`}>
                      <Button label="Fazer Chamada" className="p-button mr-2" />
                    </Link>
                  ) : null}
                  {isAdmin && (
                    <div>
                      {turma.deletedAt === null ? (
                        <div>
                          <button
                            onClick={() =>
                              this.setState({ modalEditTurma: true })
                            }
                            style={{
                              marginTop: "0.5rem",
                              textDecoration: "none",
                              color: "#000",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                            }}
                          >
                            Editar
                          </button>

                          <button
                            onClick={this.abrirDialog}
                            style={{
                              marginTop: "0.5rem",
                              textDecoration: "none",
                              color: "#ff0000",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                            }}
                          >
                            Desabilitar
                          </button>
                        </div>
                      ) : (
                        <div>
                          {/*<button
                            onClick={() =>
                              this.setState({ habilitarTurmaVisible: true })
                            }
                            style={{
                              marginTop: "0.5rem",
                              textDecoration: "none",
                              color: "#000",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                            }}
                          >
                            Habilitar
                          </button>*/}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex align-items-center text-700 flex-wrap">
                {this.state.turma.deletedAt === null ? (
                  <></>
                ) : (
                  <Badge
                    value="Desabilitada"
                    style={{ background: "#95a5a6" }}
                  ></Badge>
                )}
              </div>
              <div className="grid grid-nogutter border-top-1 surface-border pt-2">
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">
                    Código da Turma
                  </div>
                  <div className="text-900">{turma.codigo}</div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Ano Lectivo</div>
                  <div className="text-900">
                    {turma.fkAnoLectivo.designacao}
                  </div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Semestre</div>
                  <div className="text-900">{turma.fkSemestre.designacao}</div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Disciplina</div>
                  <div className="text-900">
                    {" "}
                    {turma.fkDisciplina.designacao}
                  </div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Curso</div>
                  <div className="text-900">
                    {turma.fkDisciplina.fkCurso.designacao}
                  </div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Coordendor</div>
                  <div className="text-900">{turma.fkCoodenador.nome}</div>
                </div>

                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">
                    Data Inicio do Semestre
                  </div>
                  <div className="text-900">{turma.dataInicioSemestre}</div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">
                    Data Fim do Semestre
                  </div>
                  <div className="text-900">{turma.dataFimSemestre}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-2 surface-card p-4 shadow-2 border-round">
                <div className="mb-3 flex align-items-center justify-content-between">
                  <div className="flex align-items-center">
                    <i className="pi pi-users text-500 mr-2 text-xl"></i>
                    <span className="text-xl font-medium text-900">
                      Estudantes Inscritos
                    </span>
                  </div>

                  {isAdmin &&
                  turma.deletedAt === null &&
                  new Date(turma?.dataFimSemestre) > new Date() ? (
                    <div className="col-2">
                      <Button
                        label="Adicionar Estudantes"
                        style={{
                          marginTop: 10,
                          marginRight: -10,
                        }}
                        onClick={() =>
                          this.setState({
                            modalAddEstudantes: true,
                          })
                        }
                      />
                      <Dialog
                        header="Adicionar Estudantes"
                        visible={this.state.modalAddEstudantes}
                        style={{ width: "50vw" }}
                        onHide={() =>
                          this.setState({ modalAddEstudantes: false })
                        }
                      >
                        <div>
                          <div class="grid">
                            <div class="col-12">
                              {this.state.mensagem && (
                                <h4
                                  style={{
                                    color: "red",
                                    marginTop: "1rem",
                                  }}
                                >
                                  {this.state.mensagem}
                                </h4>
                              )}
                              <div
                                class="field"
                                style={{ marginBottom: "2rem" }}
                              >
                                <label htmlFor="novaDisciplinaCurso">
                                  Lista de Estudantes
                                </label>
                                <MultiSelect
                                  className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                  required
                                  id="estudante"
                                  value={this.state.estudante}
                                  options={this.state.estudanteOptions}
                                  display="chip"
                                  onChange={(e) =>
                                    this.setState({
                                      estudante: e.value,
                                    })
                                  }
                                  filter={true}
                                />
                              </div>
                            </div>
                            <div
                              class="col-12"
                              style={{ display: "grid", gap: "1rem" }}
                            >
                              <Button
                                label="Adicionar"
                                onClick={this.addEstudantes}
                              />
                            </div>
                          </div>
                        </div>
                      </Dialog>
                    </div>
                  ) : null}
                </div>
                <div className="col-12 p-3">
                  <div className="grid">
                    {this.state.estudantes &&
                      Array.isArray(this.state.estudantes) &&
                      this.state.estudantes.length > 0 &&
                      estudantesToShow.map((estudante, index) => (
                        <div className="col-12 md:col-4" key={index}>
                          <div className="surface-card shadow-2 border-round p-3">
                            <div className="flex justify-content-between align-items-start">
                              <div>
                                <div className="text-xl font-medium text-900 mb-2"></div>
                              </div>
                            </div>
                            <ul className="list-none m-0 p-0">
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Nome do Estudante:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {estudante.fkEstudante.nome}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Número de Matrícula:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {estudante.fkEstudante.numMatriculaEstudante}
                                </span>
                              </li>
                            </ul>
                            <div className="flex justify-content-between mt-2">
                              {isAdmin ? (
                                <Button
                                  label="Visualizar"
                                  outlined
                                  onClick={() =>
                                    this.props.history.push(
                                      `/utilizador-visualizar/${estudante.fkEstudante.pkUtilizador}`
                                    )
                                  }
                                />
                              ) : null}
                              {isAdmin &&
                              turma.deletedAt === null &&
                              new Date(turma?.dataFimSemestre) > new Date() ? (
                                <Button
                                  label="Remover"
                                  outlined
                                  severity="danger"
                                  aria-label="Cancel"
                                  onClick={() =>
                                    this.removerEstudante(
                                      estudante.pkTurmaEstudante
                                    )
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <Paginator
                    first={firstTurma}
                    rows={rowsTurma}
                    totalRecords={this.state.estudantes.length}
                    onPageChange={this.onPageChangeTurma}
                    className="p-mt-4"
                  />
                </div>
              </div>
              {turma.deletedAt === null && isOrientador ? (
                <div className="mt-2 surface-card p-4 shadow-2 border-round">
                  <div className="mb-3 flex align-items-center justify-content-between">
                    <div className="flex align-items-center">
                      <i className="pi pi-briefcase text-500 mr-2 text-xl"></i>
                      <span className="text-xl font-medium text-900">
                        Tarefas
                      </span>
                    </div>
                  </div>

                  <div className="col-12 p-3">
                    <div className="grid">
                      {this.state.tarefas &&
                        Array.isArray(this.state.tarefas) &&
                        this.state.tarefas.length > 0 &&
                        this.state.tarefas.map((tarefa, index) => (
                          <div className="col-12 md:col-4" key={index}>
                            <div className="surface-card shadow-2 border-round p-3">
                              <div className="flex justify-content-between align-items-start">
                                <div>
                                  <div className="text-xl font-medium text-900 mb-2"></div>
                                </div>
                              </div>
                              <ul className="list-none m-0 p-0">
                                <li className="px-0 py-2 flex justify-content-between align-items-justify border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Designação:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {tarefa.designacaoTarefa}
                                  </span>
                                </li>
                                <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Tipo de Tarefa:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {tarefa.tipoTarefa}
                                  </span>
                                </li>
                                <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Peso da Tarefa:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {tarefa.pesoTarefa} %
                                  </span>
                                </li>
                              </ul>
                              <div className="flex justify-content-between mt-2">
                                <Button
                                  label="Visualizar"
                                  outlined
                                  onClick={() =>
                                    this.props.history.push(
                                      `/tarefa-atribuida-visualizar/${tarefa.pkTarefasAtribuidas}`
                                    )
                                  }
                                />
                                <Button
                                  label="Remover"
                                  outlined
                                  severity="danger"
                                  aria-label="Cancel"
                                  onClick={() =>
                                    this.removerTarefa(
                                      tarefa.pkTarefasAtribuidas
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <AtribuirTarefas
                    id={this.state.id}
                    tabela="turma"
                    usuarioLogado={usuarioLogado.fkUtilizador.pkUtilizador}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Modal */}
        <Dialog
          header="Editar Turma"
          visible={this.state.modalEditTurma}
          style={{ width: "50vw" }}
          onHide={() => this.setState({ modalEditTurma: false })}
          modal
        >
          <form onSubmit={this.handleUpdateTurma}>
            <div className="p-fluid grid">
              <div className="field col-12">
                <label htmlFor="codigo">Código</label>
                <InputText
                  id="codigo"
                  type="text"
                  value={this.state.codigo}
                  onChange={(e) => this.setState({ codigo: e.target.value })}
                />
              </div>
              <div className="field col-12">
                <label htmlFor="semestre">Semestre</label>
                <Dropdown
                  required
                  id="semestre"
                  value={this.state.semestre}
                  options={this.state.semestreOptions}
                  onChange={(e) => this.setState({ semestre: e.value })}
                  className="form-control"
                />
              </div>
              <div className="field col-12">
                <label htmlFor="disciplina">Disciplina</label>
                <Dropdown
                  required
                  id="disciplina"
                  value={this.state.disciplina}
                  options={this.state.disciplinaOptions}
                  onChange={(e) => this.setState({ disciplina: e.value })}
                  className="form-control"
                />
              </div>
              <div className="field col-12">
                <label htmlFor="coordenador">Coordenador</label>
                <Dropdown
                  required
                  id="coordenador"
                  value={this.state.coordenador}
                  options={this.state.coordenadorOptions}
                  onChange={(e) => this.setState({ coordenador: e.value })}
                  className="form-control"
                />
              </div>
              <div className="field col-12">
                <label htmlFor="anoLectivo">Ano Lectivo</label>
                <Dropdown
                  required
                  id="anoLectivo"
                  value={this.state.anoLectivo}
                  options={this.state.anoLectivoOptions}
                  onChange={(e) => this.setState({ anoLectivo: e.value })}
                  className="form-control"
                />
              </div>

              <div className="field col-6">
                <label htmlFor="dataInicioSemestre">
                  Data Inicio do Semestre
                </label>
                <Calendar
                  required
                  id="dataInicioSemestre"
                  name="dataInicioSemestre"
                  className="form-control data"
                  onChange={(e) =>
                    this.setState({
                      dataInicioSemestre: e.target.value,
                    })
                  }
                  showIcon
                  value={this.state.dataInicioSemestre}
                />
              </div>
              <div className="field col-6">
                <label htmlFor="dataFimSemestre">Data Fim do Semestre</label>
                <Calendar
                  required
                  id="dataFimSemestre"
                  name="dataFimSemestre"
                  className="form-control data"
                  onChange={(e) =>
                    this.setState({
                      dataFimSemestre: e.target.value,
                    })
                  }
                  showIcon
                  value={this.state.dataFimSemestre}
                />{" "}
              </div>
            </div>
            <Button label="Salvar" icon="pi pi-save" type="submit" />
          </form>
        </Dialog>

        <Dialog
          header={
            <div className="flex align-items-center">
              <span
                className="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle"
                style={{ width: "32px", height: "32px" }}
              >
                <i className="pi pi-info text-lg"></i>
              </span>
              <span className="font-medium text-2xl text-900">
                Desabilitar!
              </span>
            </div>
          }
          visible={this.state.showDialog}
          style={{ width: "40vw" }}
          footer={footer}
          onHide={this.fecharDialog}
          modal
        >
          <p className="line-height-3 p-0 m-0">
            Tem certeza que deseja desabilitar essa turma? <br />
            Esta acção não pode ser desfeita.
          </p>
        </Dialog>

        <Dialog
          header="Habilitar Turma"
          visible={this.state.habilitarTurmaVisible}
          style={{ width: "40vw" }}
          onHide={() => this.setState({ habilitarTurmaVisible: false })}
        ></Dialog>
      </div>
    );
  }
}

export default withRouter(TurmaVisualizar);
