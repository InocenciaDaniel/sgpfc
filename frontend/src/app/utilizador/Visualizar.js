import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import api from "../axiosConfig";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";

class UtilizadorVisualizar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      id: null,
      conta: null,
      utilizador: null,
      numeroFaltas: "",
      turmaEstudante: null,
      turmasEstudante: [],
      projectosEstudante: [],
      temasEstudante: [],
      tipoConta: null,
      showDialog: false,
      mensagem: null,

      projectosOrientador: [],
      temasOrientador: [],

      alterarTurma: false,
      novaTurma: null,
      turmaOptions: [],

      arquivoVisible: false,
      fileContent: null,
    };
  }

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;

      const utilizadorResponse = await api.get(
        `conta/findByFkUtilizador/${id}`
      );

      this.setState({
        id,
        conta: utilizadorResponse.data,
        utilizador: utilizadorResponse.data.fkUtilizador,
        tipoConta: utilizadorResponse.data.fkUtilizador.fkTipoConta,
      });

      //Estudante
      if (utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta === 2) {
        const turmaEstudanteResponse = await api.get(
          `turmaEstudante/findByEstudante/${id}`
        );

        if (turmaEstudanteResponse.data) {
          const numeroFaltasResponse = await api.get(
            `presenca/numeroFaltasFindByFkEstudante/${id}/${turmaEstudanteResponse.data.fkTurma.pkTurma}`
          );
          this.setState({
            turmaEstudante: turmaEstudanteResponse.data.fkTurma,
            numeroFaltas: numeroFaltasResponse.data,
          });
        }
        const turmasEstudanteResponse = await api.get(
          `turmaEstudante/findAllTurmaEstudanteByFkEstudante/${id}`
        );
        this.setState({ turmasEstudante: turmasEstudanteResponse.data });

        const projectosEstudanteResponse = await api.get(
          `projecto/findByFkEstudante/${id}`
        );
        if (projectosEstudanteResponse.data) {
          this.setState({
            projectosEstudante: projectosEstudanteResponse.data,
          });
        }

        const temasEstudanteResponse = await api.get(
          `tema/findByfkEstudanteProposto/${id}`
        );
        if (temasEstudanteResponse.data) {
          this.setState({
            temasEstudante: temasEstudanteResponse.data,
          });
        }

        console.log(this.state.projectosEstudante);
      }

      //Orientador
      if (utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta === 3) {
        const projectosOrientadorResponse = await api.get(
          `projecto/findAllProjectosDoOrientador/${id}`
        );
        if (projectosOrientadorResponse.data) {
          this.setState({
            projectosOrientador: projectosOrientadorResponse.data,
          });
        }

        const temasOrientadorResponse = await api.get(
          `tema/findByEmailOrientador/${this.state.conta.email}`
        );
        if (temasOrientadorResponse.data) {
          this.setState({
            temasOrientador: temasOrientadorResponse.data,
          });
        }
      }
      this.fetchTurmas();
      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }
  fetchTurmas = async () => {
    try {
      const response = await api.get("turma/findAllTurmaAberta");
      this.setState({
        turmaOptions: response.data.map((turma) => ({
          label: `${turma.codigo} - ${turma.fkSemestre.designacao}º -  (${turma.fkAnoLectivo.designacao})`,
          value: turma.pkTurma,
        })),
      });
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  };

  handleDropdownChange = (e) => {
    this.setState({ novaTurma: e.value });
  };

  toggleEditMode = () => {
    this.setState({ alterarTurma: !this.state.alterarTurma });
  };

  confirmarAlterarTurma = async () => {
    try {
      await api.post("turmaEstudante/save", {
        fkTurma: this.state.novaTurma,
        fkEstudante: this.state.utilizador.pkUtilizador,
        estado: "activo",
      });

      window.location.reload();
    } catch (error) {
      console.error("Erro ao atribuir turma:", error);
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
      const response = await api.delete(
        `utilizador/deleteById/${this.state.utilizador.pkUtilizador}/${this.state.usuarioLogado.fkUtilizador.pkUtilizador}`
      );
      this.setState({
        mensagem: "Utilizador desabilitado com sucesso.",
        tipoMensagem: "sucesso",
        showDialog: false,
      });

      console.log("Resposta do servidor:", response.data);

      if (this.props.onDelete) {
        this.props.onDelete(this.state.id);
      }

      window.location.reload();
    } catch (error) {
      console.error("Erro ao desabilitar utilizador:", error);
      this.setState({
        mensagem: "Erro ao desabilitar o utilizador.",
        tipoMensagem: "erro",
        showDialog: false,
      });
    }
  };

  renderFileContent = () => {
    const { fileContent, mimeType } = this.state;
    if (!fileContent) {
      return <p>Carregando arquivo...</p>;
    }
    if (mimeType === "application/pdf") {
      return (
        <object
          data={fileContent}
          type="application/pdf"
          width="100%"
          height="500px"
        >
          <p>
            Seu navegador não suporta exibir PDFs.{" "}
            <a href={fileContent} target="_blank" rel="noopener noreferrer">
              Baixar PDF
            </a>
          </p>
        </object>
      );
    }
    return (
      <div>
        <p>Visualização não disponivel</p>
        <a href={fileContent} download>
          Clique aqui para baixar o arquivo
        </a>
      </div>
    );
  };

  showRelatorioJustificativaDialog = (relatorio) => {
    this.setState({
      arquivoVisible: true,
    });
    this.fetchFile(relatorio);
  };

  fetchFile = (arquivoUrl) => {
    api
      .get(`upload/${arquivoUrl}`, {
        responseType: "blob",
      })
      .then((response) => {
        const mimeType = response.headers["content-type"];
        const fileBlob = response.data;
        const fileURL = URL.createObjectURL(fileBlob);
        this.setState({
          fileContent: fileURL,
          mimeType: mimeType,
        });
      })
      .catch((error) => {
        console.error("Erro ao buscar o arquivo:", error);
      });
  };

  render() {
    const { usuarioLogado, utilizador, tipoConta, conta, arquivoVisible } =
      this.state;
    const { alterarTurma, novaTurma, turmaOptions } = this.state;
    const isCoordenador =
      usuarioLogado && usuarioLogado.fkUtilizador.fkTipoConta.pkTipoConta === 1;

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

    return (
      <div>
        <style>
          {`
      .list-no-style {
        list-style-type: none; 
        padding: 0;           
        color: white;    
      }
      
      .font-medium {
        color: white;
      }
      
      .card-container {
        display: flex;
        flex-wrap: wrap;
      }

      .card-item {
        flex: 1 1 calc(50% - 1rem);
        margin: 0.5rem;
      }
      
      `}
        </style>
        {usuarioLogado ? (
          <div className="p-7">
            <div className="surface-card p-4 shadow-2 border-round">
              <div className="font-medium text-2xl text-900 mb-3">
                <i className="pi pi-user text-500 mr-2 text-xl"></i>
                Informações Gerais do {tipoConta.designacao}
              </div>
              <div className="flex align-items-center text-700 flex-wrap">
                {utilizador.deletedAt === null ? (
                  <></>
                ) : (
                  <Badge
                    value="Conta Desabilitada"
                    style={{ background: "#95a5a6" }}
                  ></Badge>
                )}
              </div>

              <div className="text-500 mb-2">
                <div className="flex align-items-center justify-content-end">
                  <a
                    href={`/utilizador-editar/${this.state.id}`}
                    style={{
                      marginRight: "1rem",
                      marginTop: "-5rem",
                      textDecoration: "none",
                      color: "#123456",
                    }}
                  >
                    Editar
                  </a>
                  {utilizador.deletedAt ? (
                    <></>
                  ) : (
                    <button
                      onClick={this.abrirDialog}
                      style={{
                        textDecoration: "none",
                        color: "#ff0000",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginTop: "-5rem",
                      }}
                    >
                      Desabilitar
                    </button>
                  )}

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
                      Tem certeza que deseja desabilitar este utilizador? <br />
                      Esta acção não pode ser desfeita.
                    </p>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-nogutter border-top-1 surface-border pt-2">
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Nome</div>
                  <div className="text-900">{utilizador.nome}</div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Email</div>
                  <div className="text-900">{conta.email}</div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Telefone</div>
                  <div className="text-900">{utilizador.telefone}</div>
                </div>
                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">Gênero</div>
                  <div className="text-900">{utilizador.fkSexo.designacao}</div>
                </div>
                {tipoConta.pkTipoConta === 2 && (
                  <div className="col-12 md:col-6 p-3">
                    <div className="text-500 font-medium mb-2">
                      Número de Matrícula
                    </div>
                    <div className="text-900">
                      {utilizador.numMatriculaEstudante}
                    </div>
                  </div>
                )}
                {tipoConta.pkTipoConta === 3 && (
                  <div className="col-12 md:col-6 p-3">
                    <div className="text-500 font-medium mb-2">
                      Grau Acadêmico
                    </div>
                    <div className="text-900">
                      {utilizador.grauAcademicoOrientador}
                    </div>
                  </div>
                )}
                {tipoConta.pkTipoConta === 3 && (
                  <div className="col-12 md:col-6 p-3">
                    <div className="text-500 font-medium mb-2">
                      Universidade Onde Leciona
                    </div>
                    <div className="text-900">
                      {utilizador.fkUniversidadeOrientador.designacao}
                    </div>
                  </div>
                )}
                {tipoConta.pkTipoConta === 3 &&
                  utilizador?.curriculumUrl !== null && (
                    <div className="col-12 md:col-6 p-3">
                      <div className="text-500 font-medium mb-2">
                        Curriculum Vitae
                      </div>
                      <Button
                        label={utilizador?.curriculumUrl.split("/").pop()}
                        icon="pi pi-external-link"
                        onClick={() =>
                          this.showRelatorioJustificativaDialog(
                            utilizador?.curriculumUrl
                          )
                        }
                        severity="info"
                        outlined
                      />
                      <Dialog
                        visible={arquivoVisible}
                        style={{ width: "70vw" }}
                        onHide={() => this.setState({ arquivoVisible: false })}
                      >
                        {this.renderFileContent()}
                      </Dialog>
                    </div>
                  )}
                {this.state.turmaEstudante !== null ? (
                  <div className="col-12 md:col-6 p-3">
                    <div className="text-500 font-medium mb-2">Turma</div>
                    <div className="text-900">
                      <a
                        href={`/turma-visualizar/${this.state.turmaEstudante.pkTurma}`}
                        style={{
                          textDecoration: "none",
                          color: "#123456",
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#0D253F")}
                        onMouseLeave={(e) => (e.target.style.color = "#123456")}
                      >
                        {this.state.turmaEstudante.codigo} - {this.state.turmaEstudante.fkDisciplina.designacao}
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    {/**Verifica se o usuario logado é o admin, se for então adiciona a opção para atribuir turma do estudante */}
                    {tipoConta.pkTipoConta === 2 &&
                      usuarioLogado &&
                      isCoordenador && (
                        <div className="col-12 md:col-6 p-3">
                          <div>
                            {alterarTurma ? (
                              <Dropdown
                                value={novaTurma}
                                options={turmaOptions}
                                onChange={this.handleDropdownChange}
                                placeholder="Selecione uma turma"
                                className="w-full mb-2"
                              />
                            ) : (
                              <div className="mb-2 text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                {utilizador.turma
                                  ? utilizador.turma.codigo
                                  : "Nenhuma turma atribuída"}
                              </div>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            {alterarTurma ? (
                              <Button
                                label="Salvar Alterações"
                                className="p-button-outlined"
                                onClick={this.confirmarAlterarTurma}
                              />
                            ) : (
                              <Button
                                label="Inscrever Estudante"
                                disabled={!isCoordenador}
                                className="p-button-outlined"
                                onClick={this.toggleEditMode}
                              />
                            )}
                          </div>
                        </div>
                      )}
                  </>
                )}

                <div className="col-12 md:col-6 p-3">
                  <div className="text-500 font-medium mb-2">
                    Outras informações
                  </div>
                  <div className="text-900 line-height-3">
                    Utilizador cadastrdo por: {utilizador.fkCadastradoPor?.nome}
                    , {new Date(utilizador.dataCriacao).toLocaleDateString()}{" "}
                  </div>
                </div>
              </div>
            </div>

            {tipoConta.pkTipoConta === 2 && (
              <div>
                <div className="mt-2 surface-card p-4 shadow-2 border-round">
                  <div className="mb-3 flex align-items-center justify-content-between">
                    <div className="flex align-items-center">
                      <i className="pi pi-book text-500 mr-2 text-xl"></i>
                      <span className="text-xl font-medium text-900">
                        Histórico Acadêmico
                      </span>
                    </div>
                  </div>
                  <div className="col-12 p-3">
                    <div className="grid">
                      {this.state.turmasEstudante &&
                        Array.isArray(this.state.turmasEstudante) &&
                        this.state.turmasEstudante.length > 0 &&
                        this.state.turmasEstudante.map((turma, index) => (
                          <div className="col-12 md:col-4" key={index}>
                            <div className="surface-card shadow-2 border-round p-3">
                              <div className="flex justify-content-between align-items-start">
                                <div>
                                  <div className="text-xl font-medium text-900 mb-2">
                                    {turma.fkTurma.codigo}
                                  </div>
                                </div>
                              </div>
                              <ul className="list-none m-0 p-0">
                                <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Ano Lectivo:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {turma.fkTurma.fkAnoLectivo.designacao}
                                  </span>
                                </li>
                                <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Semestre:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {turma.fkTurma.fkSemestre.designacao}
                                  </span>
                                </li>
                                <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Coordenador:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {turma.fkTurma?.fkCoodenador.nome}
                                  </span>
                                </li>
                                <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Disciplina:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {turma.fkTurma?.fkDisciplina.designacao}
                                  </span>
                                </li>

                                <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Faltas:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {this.state.numeroFaltas !== null
                                      ? this.state.numeroFaltas
                                      : "0"}{" "}
                                    Falta (s)
                                  </span>
                                </li>
                                <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                  <span className="text-600 font-medium text-sm mr-2">
                                    Estado:
                                  </span>
                                  <span className="text-900 font-medium text-sm">
                                    {turma.estado}
                                  </span>
                                </li>
                              </ul>
                              <Button
                                className="mt-2"
                                label="Ver Detalhes"
                                outlined
                                onClick={() =>
                                  this.props.history.push(
                                    `/turma-visualizar/${turma.fkTurma.pkTurma}`
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 surface-card p-4 shadow-2 border-round">
                  <div className="mb-3 flex align-items-center justify-content-between">
                    <div className="flex align-items-center">
                      <i className="pi pi-briefcase text-500 mr-2 text-xl"></i>
                      <span className="text-xl font-medium text-900">
                        Projectos
                      </span>
                    </div>
                  </div>
                  <div className="grid">
                    {this.state.projectosEstudante &&
                      Array.isArray(this.state.projectosEstudante) &&
                      this.state.projectosEstudante.length > 0 &&
                      this.state.projectosEstudante.map((projecto, index) => (
                        <div className="col-12 md:col-4" key={index}>
                          <div className="surface-card shadow-2 border-round p-3">
                            <div className="flex justify-content-between align-items-start">
                              <div>
                                <div className="text-xl font-medium text-900 mb-2">
                                  {projecto.fkTema.titulo.substring(0, 100)}
                                </div>
                              </div>
                            </div>
                            <ul className="list-none m-0 p-0">
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Orientador:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {projecto.fkOrientador.nome}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Turma:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {projecto.fkTurma.codigo}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Data Inicio:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {projecto.dataInicio}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Estado:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {projecto.estado}
                                </span>
                              </li>
                            </ul>
                            <Button
                              className="mt-2"
                              label="Ver Detalhes"
                              outlined
                              onClick={() =>
                                this.props.history.push(
                                  `/projecto-visualizar/${projecto.pkProjecto}`
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="mt-2 surface-card p-4 shadow-2 border-round">
                  <div className="mb-3 flex align-items-center justify-content-between">
                    <div className="flex align-items-center">
                      <i className="pi pi-briefcase text-500 mr-2 text-xl"></i>
                      <span className="text-xl font-medium text-900">
                        Temas
                      </span>
                    </div>
                  </div>
                  <div className="grid">
                    {this.state.temasEstudante &&
                      Array.isArray(this.state.temasEstudante) &&
                      this.state.temasEstudante.length > 0 &&
                      this.state.temasEstudante.map((tema, index) => (
                        <div className="col-12 md:col-4" key={index}>
                          <div className="surface-card shadow-2 border-round p-3">
                            <div className="flex justify-content-between align-items-start">
                              <div>
                                <div className="text-xl font-medium text-900 mb-2">
                                  {tema.titulo.substring(0, 100)}
                                </div>
                              </div>
                            </div>
                            <ul className="list-none m-0 p-0">
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Email Orientador:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {tema.fkOrientadorPropostoEmail}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Estado:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {tema.estado}
                                </span>
                              </li>
                            </ul>
                            <Button
                              className="mt-2"
                              label="Ver Detalhes"
                              outlined
                              onClick={() =>
                                this.props.history.push(
                                  `/tema-visualizar/${tema.pkTema}`
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {tipoConta.pkTipoConta === 3 && (
              <div>
                <div className="mt-2 surface-card p-4 shadow-2 border-round">
                  <div className="mb-3 flex align-items-center justify-content-between">
                    <div className="flex align-items-center">
                      <i className="pi pi-briefcase text-500 mr-2 text-xl"></i>
                      <span className="text-xl font-medium text-900">
                        Projectos
                      </span>
                    </div>
                  </div>
                  <div className="grid">
                    {this.state.projectosOrientador &&
                      Array.isArray(this.state.projectosOrientador) &&
                      this.state.projectosOrientador.length > 0 &&
                      this.state.projectosOrientador.map((projecto, index) => (
                        <div className="col-12 md:col-4" key={index}>
                          <div className="surface-card shadow-2 border-round p-3">
                            <div className="flex justify-content-between align-items-start">
                              <div>
                                <div className="text-xl font-medium text-900 mb-2">
                                  {projecto.fkTema.titulo.substring(0, 100)}
                                </div>
                              </div>
                            </div>
                            <ul className="list-none m-0 p-0">
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Estudante:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {projecto.fkEstudante.nome}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Turma:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {projecto.fkTurma.codigo}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Data Inicio:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {projecto.dataInicio}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Estado:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {projecto.estado}
                                </span>
                              </li>
                            </ul>
                            <Button
                              className="mt-2"
                              label="Ver Detalhes"
                              outlined
                              onClick={() =>
                                this.props.history.push(
                                  `/projecto-visualizar/${projecto.pkProjecto}`
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-2 surface-card p-4 shadow-2 border-round">
                  <div className="mb-3 flex align-items-center justify-content-between">
                    <div className="flex align-items-center">
                      <i className="pi pi-briefcase text-500 mr-2 text-xl"></i>
                      <span className="text-xl font-medium text-900">
                        Temas
                      </span>
                    </div>
                  </div>
                  <div className="grid">
                    {this.state.temasOrientador &&
                      Array.isArray(this.state.temasOrientador) &&
                      this.state.temasOrientador.length > 0 &&
                      this.state.temasOrientador.map((tema, index) => (
                        <div className="col-12 md:col-4" key={index}>
                          <div className="surface-card shadow-2 border-round p-3">
                            <div className="flex justify-content-between align-items-start">
                              <div>
                                <div className="text-xl font-medium text-900 mb-2">
                                  {tema.titulo}
                                </div>
                              </div>
                            </div>
                            <ul className="list-none m-0 p-0">
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Estudante:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {tema.fkEstudanteProposto?.nome}
                                </span>
                              </li>
                              <li className="px-0 py-2 flex justify-content-between align-items-center border-bottom-1 surface-border">
                                <span className="text-600 font-medium text-sm mr-2">
                                  Estado:
                                </span>
                                <span className="text-900 font-medium text-sm">
                                  {tema?.estado}
                                </span>
                              </li>
                            </ul>
                            <Button
                              className="mt-2"
                              label="Ver Detalhes"
                              outlined
                              onClick={() =>
                                this.props.history.push(
                                  `/tema-visualizar/${tema.pkTema}`
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default withRouter(UtilizadorVisualizar);
