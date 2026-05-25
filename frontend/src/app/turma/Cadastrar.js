import React, { Component } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Link, withRouter } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import api from "../axiosConfig";

class TurmaCadastrar extends Component {
  state = {
    error: null,
    usuarioLogado: null,
    codigo: "",

    coordenador: null,
    estudante: null,

    coordenadorOptions: [],
    estudanteOptions: [],

    anoLectivoOptions: [],
    anoLectivo: null,
    displayDialogAnoLectivo: false,
    novoAnoLectivo: "",
    dataInicioSemestre: "",
    dataFimSemestre: "",

    semestreOptions: [],
    semestre: null,
    displayDialogSemestre: false,
    novoSemestre: "",
    novoSemestreDescricao: "",

    disciplinaOptions: [],
    disciplina: null,
    displayDialogDisciplina: false,
    novaDisciplina: "",
    novaDisciplinaCodigo: "",
    novaDisciplinaCurso: "",

    cursoOptions: [],
    curso: null,
    displayDialogCurso: false,
    novoCursoDesignacao: "",
    novoCursoDescricao: "",
    novoCursoCodigo: "",
    novoCursoNivelCurso: null,
    niveisCursoOptions: [
      { label: "Graduação", value: "Graduação" },
      { label: "Pós-graduação", value: "Pós-graduação" },
      { label: "Extensão", value: "Extensão" },
      { label: "Técnico", value: "Técnico" },
    ],
  };

  async componentDidMount() {
    try {
      const semestreResponse = await api.get("semestre/findAll");
      const semestreOptions = semestreResponse.data.map((s) => ({
        label: s.designacao,
        value: s.pkSemestre,
      }));

      const disciplinaResponse = await api.get("disciplina/findAll");
      const disciplinaOptions = disciplinaResponse.data.map((d) => ({
        label: `${d.designacao} (${d.fkCurso.designacao})`,
        value: d.pkDisciplina,
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
        label: e.nome,
        value: e.pkUtilizador,
      }));

      const cursoResponse = await api.get("curso/findAll");
      const cursoOptions = cursoResponse.data.map((c) => ({
        label: c.designacao,
        value: c.pkCurso,
      }));

      this.carregarAnosLectivos();
      this.setState({
        semestreOptions,
        disciplinaOptions,
        coordenadorOptions,
        estudanteOptions,
        cursoOptions,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  carregarAnosLectivos = async () => {
    try {
      const response = await api.get("anoLectivo/findAll"); // Rota do backend
      const anosLectivos = response.data.map((ano) => ({
        label: ano.designacao,
        value: ano.pkAnoLectivo,
      }));
      this.setState({ anoLectivoOptions: anosLectivos });
    } catch (error) {
      console.error("Erro ao carregar anos letivos:", error);
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  adicionarAnoLectivo = async () => {
    const { novoAnoLectivo, dataInicioSemestre, dataFimSemestre } = this.state;

    if (!novoAnoLectivo || !dataInicioSemestre || !dataFimSemestre) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novoAno = {
      designacao: novoAnoLectivo,
      dataInicio: dataInicioSemestre,
      dataFim: dataFimSemestre,
    };

    try {
      const response = await api.post("anoLectivo/save", novoAno);

      const anoAdicionado = response.data;
      this.setState((prevState) => ({
        anoLectivoOptions: [
          ...prevState.anoLectivoOptions,
          {
            label: anoAdicionado.designacao,
            value: anoAdicionado.pkAnoLectivo,
          },
        ],
        displayDialogAnoLectivo: false,
        novoAnoLectivo: "",
        dataInicioSemestre: null,
        dataFimSemestre: null,
      }));
    } catch (error) {
      console.error("Erro ao adicionar ano letivo:", error);
      alert("Erro ao salvar o ano letivo. Tente novamente.");
    }
  };

  adicionarSemestre = async () => {
    const { novoSemestre, novoSemestreDescricao } = this.state;

    if (!novoSemestre || !novoSemestreDescricao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novo = {
      designacao: novoSemestre,
      descricao: novoSemestreDescricao,
    };

    try {
      const response = await api.post("semestre/save", novo);

      const semestreAdicionado = response.data;
      this.setState((prevState) => ({
        semestreOptions: [
          ...prevState.semestreOptions,
          {
            label: semestreAdicionado.designacao,
            value: semestreAdicionado.pkSemestre,
          },
        ],
        displayDialogSemestre: false,
        novoSemestre: "",
        novoSemestreDescricao: "",
      }));
    } catch (error) {
      console.error("Erro ao adicionar semestre:", error);
    }
  };

  adicionarDisciplina = async () => {
    const {
      novaDisciplina,
      novaDisciplinaCodigo,
      novaDisciplinaDescricao,
      novaDisciplinaCurso,
    } = this.state;

    if (
      !novaDisciplina ||
      !novaDisciplinaCodigo ||
      !novaDisciplinaDescricao ||
      !novaDisciplinaCurso
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novo = {
      designacao: novaDisciplina,
      descricao: novaDisciplinaDescricao,
      codigo: novaDisciplinaCodigo,
      fkCurso: novaDisciplinaCurso,
    };

    try {
      const response = await api.post("disciplina/save", novo);

      const disciplinaAdicionado = response.data;
      this.setState((prevState) => ({
        disciplinaOptions: [
          ...prevState.disciplinaOptions,
          {
            label: disciplinaAdicionado.designacao,
            value: disciplinaAdicionado.pkDisciplina,
          },
        ],
        displayDialogDisciplina: false,
        novaDisciplina: "",
        novaDisciplinaCodigo: "",
        novaDisciplinaDescricao: "",
      }));
    } catch (error) {
      console.error("Erro ao adicionar disciplina:", error);
      alert("Erro ao salvar disciplina. Tente novamente.");
    }
  };

  adicionarCurso = async () => {
    const {
      novoCursoCodigo,
      novoCursoDesignacao,
      novoCursoDescricao,
      novoCursoNivelCurso,
    } = this.state;

    if (
      !novoCursoCodigo ||
      !novoCursoDesignacao ||
      !novoCursoDescricao ||
      !novoCursoNivelCurso
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novo = {
      designacao: novoCursoDesignacao,
      descricao: novoCursoDescricao,
      codigo: novoCursoCodigo,
      nivelCurso: novoCursoNivelCurso,
    };

    try {
      const response = await api.post("curso/save", novo);

      const cursoAdicionado = response.data;
      this.setState((prevState) => ({
        cursoOptions: [
          ...prevState.cursoOptions,
          { label: cursoAdicionado.designacao, value: cursoAdicionado.pkCurso },
        ],
        displayDialogCurso: false,
        novoCursoCodigo: "",
        novoCursoDesignacao: "",
        novoCursoDescricao: "",
      }));
    } catch (error) {
      console.error("Erro ao adicionar curso:", error);
      this.setState({
        error: "Erro ao salvar curso. Tente novamente.",
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
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
      this.setState({
        error:
          "A data de início do semestre deve ser inferior à data de fim do semestre.",
      });
      return;
    }

    try {
      const turmaResponse = await api.post("turma/save", {
        codigo,
        anoLectivo,
        semestre,
        disciplina,
        coordenador,
        dataInicioSemestre,
        dataFimSemestre,
      });

      const turmaId = turmaResponse.data.pkTurma;

      if (estudante && estudante.length > 0) {
        await Promise.all(
          estudante.map(async (estudante) => {
            await api.post("turmaEstudante/save", {
              fkTurma: turmaId,
              fkEstudante: estudante,
              estado: "activo",
            });
          })
        );
      }

      this.props.history.push("/turma-index");
    } catch (error) {
      const errorMessage =
        error.message || error.toString() || "Erro desconhecido.";
      this.setState({ error: `Erro ao saltar a turma: ${errorMessage}` });
    }
  };

  render() {
    const {
      usuarioLogado,
      semestreOptions,
      disciplinaOptions,
      coordenadorOptions,
      estudanteOptions,
      anoLectivoOptions,
      error,
    } = this.state;

    return (
      <div>
        <style>
          {`
            #pr_id_3_content > div > div > div > span > input { width: 94% }
            .p-dropdown-label, .p-inputtext { width: 100%; }
            `}
        </style>

        {usuarioLogado ? (
          <form className="p-7" onSubmit={this.handleSubmit}>
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
                    Formulário de Cadastro
                  </span>
                </li>
                <li className="ml-auto">
                <Button
                    type="submit"
                    label="Salvar Alterações"
                    className="p-button mr-2"
                  />
                </li>
              </ul>
            </div>

            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                {error && (
                  <div className="alert alert-danger">
                    <Message
                      style={{
                        border: "solid #832226",
                        borderWidth: "0 0 0 6px",
                        color: "#832226",
                      }}
                      c
                      className="border-danger w-full justify-content-start"
                      severity="error"
                      content={error}
                    />
                  </div>
                )}
                <br />
                <div
                  style={{
                    marginBottom: "1rem",
                    gridColumn: "span 12 / span 6",
                  }}
                >
                  <label
                    htmlFor="codigo"
                    style={{ fontWeight: "500", color: "#1a202c" }}
                  >
                    Código da Turma
                  </label>
                  <InputText
                    required
                    id="codigo"
                    name="codigo"
                    type="text"
                    className="form-control"
                    onChange={this.handleChange}
                  />
                </div>

                <div
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1, marginRight: 20 }}>
                    <label htmlFor="anoLectivo">Ano Lectivo</label>
                    <Dropdown
                      required
                      id="anoLectivo"
                      value={this.state.anoLectivo}
                      options={anoLectivoOptions}
                      onChange={(e) => this.setState({ anoLectivo: e.value })}
                      className="form-control"
                    />
                  </div>
                  <Link to="#">
                    <Button
                      label=""
                      icon="pi pi-plus"
                      className="p-button-label"
                      style={{ marginTop: 10 }}
                      onClick={() =>
                        this.setState({ displayDialogAnoLectivo: true })
                      }
                    />
                  </Link>
                  <Dialog
                    header="Adicionar Ano Lectivo"
                    visible={this.state.displayDialogAnoLectivo}
                    style={{ width: "50vw" }}
                    onHide={() =>
                      this.setState({ displayDialogAnoLectivo: false })
                    }
                  >
                    <div
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "1rem",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div class="grid">
                        <div class="col-12" style={{ marginBottom: "1rem" }}>
                          <div class="field">
                            <label htmlFor="novoAnoLectivo">Designação</label>
                            <InputText
                              id="novoAnoLectivo"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({
                                  novoAnoLectivo: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div class="col-6" style={{ marginBottom: "1rem" }}>
                          <div class="field">
                            <label htmlFor="dataInicioSemestre">
                              Data Inicio do Semestre
                            </label>
                            <Calendar
                              required
                              id="dataInicioSemestre"
                              name="dataInicioSemestre"
                              onChange={(e) =>
                                this.setState({
                                  dataInicioSemestre: e.target.value,
                                })
                              }
                              showIcon
                            />
                          </div>
                        </div>
                        <div class="col-6" style={{ marginBottom: "1rem" }}>
                          <div class="field">
                            <label htmlFor="dataFimSemestre">
                              Data Fim do Semestre
                            </label>
                            <Calendar
                              required
                              id="dataFimSemestre"
                              name="dataInicioSemestre"
                              onChange={(e) =>
                                this.setState({
                                  dataFimSemestre: e.target.value,
                                })
                              }
                              showIcon
                            />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gap: "1rem" }}>
                        <Button
                          label="Adicionar"
                          onClick={this.adicionarAnoLectivo}
                        />
                      </div>
                    </div>
                  </Dialog>
                </div>

                <div
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1, marginRight: 20 }}>
                    <label htmlFor="semestre">Semestre</label>
                    <Dropdown
                      required
                      id="semestre"
                      value={this.state.semestre}
                      options={semestreOptions}
                      onChange={(e) => this.setState({ semestre: e.value })}
                      className="form-control"
                    />
                  </div>
                  <Link to="#">
                    <Button
                      label=""
                      icon="pi pi-plus"
                      className="p-button-label"
                      style={{ marginTop: 10 }}
                      onClick={() =>
                        this.setState({ displayDialogSemestre: true })
                      }
                    />
                  </Link>
                  <Dialog
                    header="Adicionar Semestre"
                    visible={this.state.displayDialogSemestre}
                    style={{ width: "50vw" }}
                    onHide={() =>
                      this.setState({ displayDialogSemestre: false })
                    }
                  >
                    <div
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "1rem",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div class="grid">
                        <div class="col-12">
                          <div class="field" style={{ marginBottom: "2rem" }}>
                            <label htmlFor="novoSemestre">Designação</label>
                            <InputText
                              id="novoSemestre"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({ novoSemestre: e.target.value })
                              }
                            />
                          </div>
                          <div class="field" style={{ marginBottom: "2rem" }}>
                            <label htmlFor="novoSemestreDescricao">
                              Descrição
                            </label>
                            <InputTextarea
                              id="novoSemestreDescricao"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({
                                  novoSemestreDescricao: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div style={{ display: "grid", gap: "1rem" }}>
                            <Button
                              label="Adicionar"
                              onClick={this.adicionarSemestre}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                </div>

                <div
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1, marginRight: 20 }}>
                    <label htmlFor="disciplina">Disciplina</label>
                    <Dropdown
                      required
                      id="disciplina"
                      value={this.state.disciplina}
                      options={disciplinaOptions}
                      onChange={(e) => this.setState({ disciplina: e.value })}
                    />
                  </div>
                  <Link to="#">
                    <Button
                      label=""
                      icon="pi pi-plus"
                      className="p-button-label"
                      style={{ marginTop: 10 }}
                      onClick={() =>
                        this.setState({ displayDialogDisciplina: true })
                      }
                    />
                  </Link>
                  <Dialog
                    header="Adicionar Disciplina"
                    visible={this.state.displayDialogDisciplina}
                    style={{ width: "50vw" }}
                    onHide={() =>
                      this.setState({ displayDialogDisciplina: false })
                    }
                  >
                    <div
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "1rem",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div class="grid">
                        <div class="col-6">
                          <div class="field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="novaDisciplinaCodigo">Código</label>
                            <InputText
                              id="novaDisciplinaCodigo"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({
                                  novaDisciplinaCodigo: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="novaDisciplina">Designação</label>
                            <InputText
                              id="novaDisciplina"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({
                                  novaDisciplina: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="novaDisciplinaDescricao">
                              Descrição
                            </label>
                            <InputTextarea
                              id="novaDisciplinaDescricao"
                              type="text"
                              style={{
                                display: "block",
                                width: "100%",
                                borderRadius: "0.25rem",
                                border: "1px solid var(--border-color)",
                              }}
                              onChange={(e) =>
                                this.setState({
                                  novaDisciplinaDescricao: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div class="col-12">
                          <div
                            style={{
                              marginBottom: "2rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ flex: 1, marginRight: 20 }}>
                              <label htmlFor="novaDisciplinaCurso">Curso</label>
                              <Dropdown
                                required
                                id="novaDisciplinaCurso"
                                value={this.state.novaDisciplinaCurso}
                                options={this.state.cursoOptions}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  borderRadius: "0.25rem",
                                  border: "1px solid var(--border-color)",
                                }}
                                onChange={(e) =>
                                  this.setState({
                                    novaDisciplinaCurso: e.value,
                                  })
                                }
                              />
                            </div>
                            <Link to="#">
                              <Button
                                label=""
                                icon="pi pi-plus"
                                className="p-button-label"
                                style={{ marginTop: 10 }}
                                onClick={() =>
                                  this.setState({ displayDialogCurso: true })
                                }
                              />
                            </Link>
                            <Dialog
                              header="Adicionar Curso"
                              visible={this.state.displayDialogCurso}
                              style={{ width: "40vw" }}
                              onHide={() =>
                                this.setState({ displayDialogCurso: false })
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  padding: "1rem",
                                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                                  borderRadius: "0.5rem",
                                }}
                              >
                                <div class="grid">
                                  <div class="col-6">
                                    <div
                                      class="field"
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      <label htmlFor="novoCursoCodigo">
                                        Código
                                      </label>
                                      <InputText
                                        id="novoCursoCodigo"
                                        type="text"
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          borderRadius: "0.25rem",
                                          border:
                                            "1px solid var(--border-color)",
                                        }}
                                        onChange={(e) =>
                                          this.setState({
                                            novoCursoCodigo: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div class="col-6">
                                    <div
                                      class="field"
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      <label htmlFor="novoCursoDesignacao">
                                        Designação
                                      </label>
                                      <InputText
                                        id="novoCursoDesignacao"
                                        type="text"
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          borderRadius: "0.25rem",
                                          border:
                                            "1px solid var(--border-color)",
                                        }}
                                        onChange={(e) =>
                                          this.setState({
                                            novoCursoDesignacao: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div class="col-12">
                                    <div
                                      class="field"
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      <label htmlFor="novoCursoNivelCurso">
                                        Nível do Curso
                                      </label>
                                      <Dropdown
                                        required
                                        id="novoCursoNivelCurso"
                                        value={this.state.novoCursoNivelCurso}
                                        options={this.state.niveisCursoOptions}
                                        onChange={(e) =>
                                          this.setState({
                                            novoCursoNivelCurso: e.value,
                                          })
                                        }
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          borderRadius: "0.25rem",
                                          border:
                                            "1px solid var(--border-color)",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div class="col-12">
                                    <div
                                      class="field"
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      <label htmlFor="novaDisciplinaDescricao">
                                        Descrição
                                      </label>
                                      <InputTextarea
                                        id="novaDisciplinaDescricao"
                                        type="text"
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          borderRadius: "0.25rem",
                                          border:
                                            "1px solid var(--border-color)",
                                        }}
                                        onChange={(e) =>
                                          this.setState({
                                            novoCursoDescricao: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: "grid", gap: "1rem" }}>
                                  <Button
                                    label="Adicionar"
                                    onClick={this.adicionarCurso}
                                  />
                                </div>
                              </div>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gap: "1rem" }}>
                        <Button
                          label="Adicionar"
                          onClick={this.adicionarDisciplina}
                        />
                      </div>
                    </div>
                  </Dialog>
                </div>

                <div
                  style={{
                    marginBottom: "1rem",
                    gridColumn: "span 12 / span 6",
                  }}
                >
                  <label htmlFor="coordenador">Coordenador</label>
                  <Dropdown
                    required
                    id="coordenador"
                    value={this.state.coordenador}
                    options={coordenadorOptions}
                    onChange={(e) => this.setState({ coordenador: e.value })}
                    className="form-control"
                  />
                </div>
                <div
                  style={{
                    marginBottom: "1rem",
                    gridColumn: "span 12 / span 6",
                  }}
                >
                  <label htmlFor="estudante">Lista de Estudantes</label>
                  <MultiSelect
                    required
                    id="estudante"
                    value={this.state.estudante}
                    options={estudanteOptions}
                    onChange={(e) => this.setState({ estudante: e.value })}
                    filter={true}
                    display="chip"
                    className="form-control"
                  />
                </div>

                <div
                  style={{
                    marginBottom: "1rem",
                    gridColumn: "span 12 / span 6",
                  }}
                >
                  <label htmlFor="dataInicioSemestre">
                    Data Inicio do Semestre
                  </label>
                  <Calendar
                    required
                    id="dataInicioSemestre"
                    name="dataInicioSemestre"
                    className="form-control data"
                    onChange={this.handleChange}
                    showIcon
                  />
                </div>
                <div
                  style={{
                    marginBottom: "1rem",
                    gridColumn: "span 12 / span 6",
                  }}
                >
                  <label htmlFor="dataFimSemestre">Data Fim do Semestre</label>
                  <Calendar
                    required
                    id="dataFimSemestre"
                    name="dataFimSemestre"
                    className="form-control data"
                    onChange={this.handleChange}
                    showIcon
                  />{" "}
                </div>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    );
  }
}

export default withRouter(TurmaCadastrar);
