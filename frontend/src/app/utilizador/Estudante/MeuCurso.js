import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import api from "../../axiosConfig";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";

class MeuCurso extends Component {
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
        if (
          this.state.usuarioLogado.fkUtilizador.fkTipoConta.designacao ===
            "Estudante" &&
          id != this.state.usuarioLogado.fkUtilizador.pkUtilizador
        ) {
          this.props.history.push("/unauthorized");
        }
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
          label: turma.codigo,
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

  render() {
    const { usuarioLogado, utilizador, tipoConta, conta } = this.state;

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
                Meu Curso
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
                    href={`/perfil/${this.state.id}`}
                    style={{
                      marginRight: "1rem",
                      marginTop: "-5rem",
                      textDecoration: "none",
                      color: "#123456",
                    }}
                  >
                    Editar Informações do Perfil
                  </a>
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

                {this.state.turmaEstudante !== null ? (
                  <div className="col-12 md:col-6 p-3">
                    <div className="text-500 font-medium mb-2">Turma</div>
                    <div className="text-900">
                      {this.state.turmaEstudante.codigo}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
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
                                  {tema.fkEstudanteProposto.nome}
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
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default withRouter(MeuCurso);
