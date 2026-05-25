import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { SpeedDial } from "primereact/speeddial";
import api from "../axiosConfig";
import { NavLink } from "react-router-dom";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      usuarioLogado: null,
      perfil: null,
      hasTema: false,
      coordenador: false,
      utilizadorMenuOpen: false,
      turmaMenuOpen: false,
      outrasPagesMenuOpen: false,
      temasMenuOpen: false,
      projectoMenuOpen: false,
      presencaMenuOpen: false,
      tarefaMenuOpen: false,
      regulamentoMenuOpen: false,
      items: [
        {
          label: "Perfil",
          icon: "pi pi-user",
          command: this.handlePerfilClick,
        },
        {
          label: "Configurações",
          icon: "pi pi-cog",
          command: this.handleDefinicoesClick,
        },
        { label: "Sair", icon: "pi pi-power-off", command: this.handleLogout },
      ],
    };
  }

  async componentDidUpdate() {
    this.setState({
      hasTema: await this.checkIsEstudanteTemTema(),
      coordenador: await this.checkIsCoordenador(),
    });
  }

  componentDidMount() {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      this.setState({ usuarioLogado: JSON.parse(storedUser), loading: false });

      const pkTipoConta =
        JSON.parse(storedUser).fkUtilizador.fkTipoConta.designacao;
      this.setState({ perfil: pkTipoConta });
    } else {
      this.setState({ loading: false });
    }
  }

  checkIsEstudanteTemTema = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      try {
        const response = await api.get(
          `tema/checkIsEstudanteTemTema/${usuario.fkUtilizador.pkUtilizador}`
        );
        return response.data;
      } catch (error) {
        //console.error("Erro ao verificar se o tema foi proposto:", error);
        return false;
      }
    }
    return false;
  };

  checkIsCoordenador = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      try {
        const response = await api.get(
          `utilizador/isCoordenador/${usuario.fkUtilizador.pkUtilizador}`
        );
        return response.data;
      } catch (error) {
        //console.error("Erro ao verificar se é coordenador:", error);
        return false;
      }
    }
    return false;
  };

  handlePerfilClick = () => {
    const { usuarioLogado } = this.state;
    if (usuarioLogado && usuarioLogado.fkUtilizador.pkUtilizador) {
      this.props.history.push(
        `/perfil/${usuarioLogado.fkUtilizador.pkUtilizador}`
      );
    }
  };

  handleDefinicoesClick = () => {
    const { usuarioLogado } = this.state;
    if (
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "admin"
    ) {
      this.props.history.push(`/tabelas-sistema/`);
    } else if (
      (usuarioLogado &&
        usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador" &&
        this.state.coordenador) ||
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Funcionario DEI"
    ) {
      this.props.history.push(`/relatorios-index/`);
    } else if (
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Estudante"
    ) {
      this.props.history.push(
        `/meu-curso/${usuarioLogado.fkUtilizador.pkUtilizador}`
      );
    }
  };

  handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });

      localStorage.removeItem("usuario");

      this.props.history.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  render() {
    const { loading, perfil, coordenador } = this.state;

    if (loading) {
      return <div>Carregando...</div>;
    }

    return (
      <div style={{ margin: "-5px" }}>
        <style>
          {`
            .navbar-container {
              background-color: #1c1c1e;
            }
            
            .navbar-menu {
              background-color: transparent;
            }
            
            .navbar-list .navbar-item {
              margin: 0 1rem;
              padding: 0.5rem 0;
            }
            
            .navbar-link {
              color: #757575;
              text-decoration: none;
              position: relative;
              font-weight: bold;
              transition: all 0.3s ease-in-out;
            }
            
            .navbar-link:hover {
              color: #1e90ff;
            }
            
            .navbar-link::after {
              content: '';
              position: absolute;
              width: 0;
              height: 3px;
              bottom: -2px;
              left: 0;
              background-color: #1e90ff;
              transition: width 0.3s;
            }

            .active {
              color: #007bff;
              border-bottom: 2px solid #007bff;
              font-weight: bold; 
              background-color: #f0f8ff;
            }
            
            .navbar-link:hover::after {
              width: 100%;
            }
            
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
            
            .p-badge-dot {
              background-color: red;
            }
            
            .p-ripple {
              position: relative;
              overflow: hidden;
            }
            
            .p-ripple::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              width: 0;
              height: 0;
              background: rgba(255, 255, 255, 0.5);
              border-radius: 50%;
              transform: translate(-50%, -50%);
              transition: width 0.5s ease, height 0.5s ease;
            }
            
            .p-ripple:hover::before {
              width: 120%;
              height: 120%;
            }
            `}
        </style>
        <div className="navbar-container">
          <div
            className="surface-overlay px-6 shadow-2 flex justify-content-between relative lg:static"
            style={{ minHeight: "8px" }}
          >
            <img
              src={require("../../assets/images/logo.png")}
              alt="logo"
              height="40"
              className="mr-0 lg:mr-6 align-self-center"
            />
            <a
              href="##"
              className="p-ripple cursor-pointer block lg:hidden align-self-center text-700"
            >
              <i className="pi pi-bars text-4xl"></i>
              <span
                role="presentation"
                className="p-ink"
                style={{ height: "0px", width: "0px" }}
              ></span>
            </a>
            <div className="navbar-menu flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full surface-overlay left-0 top-100 z-1 shadow-2 lg:shadow-none">
              <ul className="navbar-list list-none p-0 m-0 flex select-none flex-column lg:flex-row">
                <li className="navbar-item">
                  <NavLink
                    to="/dashboard"
                    className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                      this.isPathActive("/dashboard") ? "active" : ""
                    }`}
                  >
                    <i className="pi pi-home mr-2"></i>
                    <span>Início</span>
                  </NavLink>
                </li>
                {perfil === "admin" && (
                  <li className="navbar-item">
                    <NavLink
                      to="/utilizador-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/utilizador") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-user mr-2"></i>
                      <span>Utilizadores</span>
                    </NavLink>
                  </li>
                )}
                {perfil === "Conselho Científico" && (
                  <li className="navbar-item">
                    <NavLink
                      to="/utilizador-orientador-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/utilizador") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-user mr-2"></i>
                      <span>Orientadores</span>
                    </NavLink>
                  </li>
                )}
                {(perfil !== "Estudante" && perfil !== "Orientador") ||
                coordenador ? (
                  <li className="navbar-item">
                    <NavLink
                      to="/turma-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/turma") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-briefcase mr-2"></i>
                      <span>Turmas</span>
                    </NavLink>
                  </li>
                ) : null}

                {perfil !== "Estudante" &&
                perfil === "Orientador" &&
                !coordenador ? (
                  <li className="navbar-item">
                    <NavLink
                      to="/orientandos-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/utilizador") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-user mr-2"></i>
                      <span>Orientandos</span>
                    </NavLink>
                  </li>
                ) : null}

                {perfil !== "Estudante" ? (
                  <li className="navbar-item">
                    <NavLink
                      to="/tema-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/tema") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-book mr-2"></i>
                      <span>Temas</span>
                    </NavLink>
                  </li>
                ) : null}
                {(perfil !== "Estudante" && perfil !== "Orientador") ||
                coordenador ? (
                  <li className="navbar-item">
                    <NavLink
                      to="/projecto-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/projecto") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-folder mr-2"></i>
                      <span>Projectos</span>
                    </NavLink>
                  </li>
                ) : null}
                {perfil === "Orientador" && (
                  <li className="navbar-item">
                    <NavLink
                      to="/presenca-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/presenca") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-calendar-clock mr-2"></i>
                      <span>Presenças</span>
                    </NavLink>
                  </li>
                )}
                {perfil !== "Estudante" && perfil !== "Funcionario DEI" && (
                  <li className="navbar-item">
                    <NavLink
                      to="/tarefa-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/tarefa") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-list mr-2"></i>
                      <span>Templates & Tarefas</span>
                    </NavLink>
                  </li>
                )}
                {perfil === "Estudante" && (
                  <li className="navbar-item">
                    <NavLink
                      to="/tarefa-estudante-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/tarefa") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-list mr-2"></i>
                      <span>Lista de Tarefas</span>
                    </NavLink>
                  </li>
                )}
                {perfil !== "Estudante" && (
                  <li className="navbar-item">
                    <NavLink
                      to="/avaliacoes-orientador-index"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/avaliacoes") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-star mr-2"></i>
                      <span>Avaliações</span>
                    </NavLink>
                  </li>
                )}

                {perfil === "Estudante" && (
                  <li className="navbar-item">
                    <NavLink
                      to="/regulamento-visualizar"
                      className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                        this.isPathActive("/regulamento") ? "active" : ""
                      }`}
                    >
                      <i className="pi pi-book mr-2"></i>
                      <span>Ver O Regulamento</span>
                    </NavLink>
                  </li>
                )}

                <li className="navbar-item">
                  <NavLink
                    to="/repositorio-index"
                    className={`navbar-link p-ripple flex p-3 h-full lg:py-2 align-items-center ${
                      this.isPathActive("/repositorio") ? "active" : ""
                    }`}
                  >
                    <i className="pi pi-github mr-2"></i>{" "}
                    <span>Repositório</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            {this.state.usuarioLogado && (
              <div className="p-ripple flex p-3 h-full lg:py-2 align-items-center">
                <span>
                  {this.state.usuarioLogado.fkUtilizador.nome} (
                  {coordenador
                    ? "Coordenador"
                    : this.state.usuarioLogado.fkUtilizador.fkTipoConta
                        .designacao}
                  )
                </span>
              </div>
            )}
          </div>
        </div>
        <div
          className="flex justify-content-end align-items-center"
          style={{
            position: "fixed",
            top: "84vh",
            right: "1rem",
            zIndex: 1000,
          }}
        >
          <SpeedDial model={this.state.items} direction="up" />
        </div>
      </div>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Navbar);
