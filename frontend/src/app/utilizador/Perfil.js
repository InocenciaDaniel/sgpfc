import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { withRouter } from "react-router-dom";
import { Toast } from "primereact/toast";
import api from "../axiosConfig";
import { Dialog } from "primereact/dialog";

class Perfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      id: null,
      pkUtilizador: "",
      conta: "",
      nome: "",
      email: "",
      telefone: "",
      sexo: null,
      tipoConta: null,
      universidade: null,
      grauAcademicoOrientador: null,
      turmaEstudante: null,
      estado: "",
      numMatriculaEstudante: "",
      sexoOptions: [],
      universidadeOptions: [],
      grauAcademicoOrientadorOptions: [
        { label: "Professor Auxiliar", value: "Professor Auxiliar" },
        { label: "Mestre", value: "Mestre" },
        { label: "Licenciado", value: "Licenciado" },
        { label: "Assistente", value: "Assistente" },
      ],
      alterarSenhaVisible: false,
      senhaAntiga: "",
      novaSenha: "",
      confirmarSenha: "",
      toast: null,
    };
  }

  async componentDidMount() {
    try {
      const sexoResponse = await api.get("sexo/findAll");
      let sexoOptions = sexoResponse.data.map((s) => ({
        label: s.designacao,
        value: s.pkSexo,
      }));

      const { id } = this.props.match.params;

      console.log("id ".id);
      const utilizadorResponse = await api.get(
        `conta/findByFkUtilizador/${id}`
      );
      this.setState({
        id,
        pkUtilizador: utilizadorResponse.data.fkUtilizador.pkUtilizador,
        conta: utilizadorResponse.data.pkConta,
        nome: utilizadorResponse.data.fkUtilizador.nome,
        email: utilizadorResponse.data.email,
        telefone: utilizadorResponse.data.fkUtilizador.telefone,
        sexo: utilizadorResponse.data.fkUtilizador.fkSexo.pkSexo,
        estado: utilizadorResponse.data.fkUtilizador.estado,
        tipoConta: utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta,
        numMatriculaEstudante:
          utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta === 2
            ? utilizadorResponse.data.fkUtilizador.numMatriculaEstudante
            : "",
        sexoOptions,
      });

      if (utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta === 2) {
        const turmaEstudanteResponse = await api.get(
          `turmaEstudante/findByEstudante/${this.state.pkUtilizador}`
        );
        if (turmaEstudanteResponse.data) {
          this.setState({
            turmaEstudante: turmaEstudanteResponse.data.fkTurma,
          });
        }
      }

      if (utilizadorResponse.data.fkUtilizador.fkTipoConta.pkTipoConta === 3) {
        const universidadeResponse = await api.get("universidade/findAll");
        const universidadeOptions = universidadeResponse.data.map((u) => ({
          label: u.designacao,
          value: u.pkUniversidade,
        }));

        this.setState({
          universidadeOptions,
          universidade:
            utilizadorResponse.data.fkUtilizador.fkUniversidadeOrientador
              .pkUniversidade,
          grauAcademicoOrientador:
            utilizadorResponse.data.fkUtilizador.grauAcademicoOrientador,
        });
      }

      console.log(this.state.turmaEstudante);
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
      if (this.state.id != this.state.usuarioLogado.fkUtilizador.pkUtilizador) {
        this.props.history.push("/unauthorized");
      }
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSexoChange = (e) => {
    this.setState({ sexo: e.value });
  };

  handleGrauAcademicoOrientadorChange = (e) => {
    this.setState({ grauAcademicoOrientador: e.value });
  };

  handleUniversidadeChange = (e) => {
    this.setState({ universidade: e.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        /*usuarioLogado,*/
        pkUtilizador,
        conta,
        nome,
        email,
        telefone,
        sexo,
        tipoConta,
        numMatriculaEstudante,
        universidade,
        grauAcademicoOrientador,
      } = this.state;

      await api.put(`utilizador/update/${pkUtilizador}`, {
        pkUtilizador,
        conta,
        nome,
        email,
        telefone,
        numMatriculaEstudante: tipoConta === 2 ? numMatriculaEstudante : null,
        sexo,
        tipoConta,
        grauAcademicoOrientador:
          tipoConta === 3 ? grauAcademicoOrientador : null,
        universidade: tipoConta === 3 ? universidade : null,
      });

      this.toast.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Informações actualizadas com sucesso!",
        life: 3000,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  handleSubmitAltarSenha = async (e) => {
    e.preventDefault();
    const { senhaAntiga, novaSenha, confirmarSenha } = this.state;

    if (novaSenha !== confirmarSenha) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "As senhas não coincidem!",
        life: 3000,
      });
      return;
    }
    try {
      const response = await api.put(`conta/update/senha/${this.state.conta}`, {
        senhaAntiga,
        novaSenha,
      });

      if (response.status === 200) {
        this.toast.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Senha alterada com sucesso!",
          life: 3000,
        });
      }

      this.setState({ alterarSenhaVisible: false });
    } catch (error) {
      if (error.response) {
        this.toast.show({
          severity: "error",
          summary: "Erro",
          detail: `Erro ao alterar a senha: ${error.response.data}`,
          life: 3000,
        });
      } else {
        console.error("Error updating password", error);
        this.toast.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao alterar a senha!",
          life: 3000,
        });
      }
    }
  };

  render() {
    const {
      usuarioLogado,
      sexoOptions,
      sexo,
      numMatriculaEstudante,
      turmaEstudante,
      grauAcademicoOrientadorOptions,
      grauAcademicoOrientador,
      universidadeOptions,
      universidade,
    } = this.state;

    const isConselhoCientifico =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao ===
        "Conselho Científico";

    return (
      <div>
        <style>
          {`
              .p-dropdown-label, .p-inputtext{
                  width: 100%;
              }

            .divider {
              border-bottom: 1px solid #ccc;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            `}
        </style>
        {usuarioLogado ? (
          <div>
            <Toast ref={(el) => (this.toast = el)} />
            <form className="p-7" onSubmit={this.handleSubmit}>
              <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
                <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                  <li>
                    <a
                      href={
                        isConselhoCientifico
                          ? "/utilizador-orientador-index"
                          : "/utilizador-index"
                      }
                      className="text-500 no-underline line-height-3 cursor-pointer"
                    >
                      Meu Perfil
                    </a>
                  </li>
                  <li className="px-2">
                    <i className="pi pi-angle-right text-500 line-height-3"></i>
                  </li>
                  <li>
                    <span className="text-900 line-height-3">Editar</span>
                  </li>
                </ul>
                <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                  <div>
                    <div className="flex align-items-center text-700 flex-wrap"></div>
                  </div>
                  <div className="mt-3 lg:mt-0">
                    <Button
                      type="submit"
                      label="Salvar Alterações"
                      className="p-button-outlined mr-2"
                    />
                  </div>
                </div>
              </div>

              <div className="p-fluid" style={{ marginTop: "1px" }}>
                <div className="surface-section surface-card p-5 border-round flex-auto">
                  <div>
                    <div className="field">
                      <label for="nome">Nome Completo</label>
                      <InputText
                        required
                        id="nome"
                        type="text"
                        name="nome"
                        value={this.state.nome}
                        onChange={this.handleChange}
                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                      />
                    </div>

                    <div className="formgrid grid">
                      <div className="field col">
                        <label for="email">Email</label>
                        <InputText
                          required
                          id="email"
                          type="email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                      <div className="field col">
                        <label for="telefone">Telefone</label>
                        <InputText
                          required
                          id="telefone"
                          type="text"
                          name="telefone"
                          value={this.state.telefone}
                          onChange={this.handleChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                    </div>
                    <div className="formgrid grid">
                      <div className="field col">
                        <label for="sexo">Genero</label>
                        <Dropdown
                          required
                          id="sexo"
                          value={sexo}
                          options={sexoOptions}
                          onChange={this.handleSexoChange}
                          className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                        />
                      </div>
                    </div>
                    {this.state.tipoConta === 2 && (
                      <div>
                        <div className="field">
                          <label for="numMatriculaEstudante">
                            Número de Matrícula do Estudante
                          </label>
                          <InputText
                            required
                            id="numMatriculaEstudante"
                            type="text"
                            name="numMatriculaEstudante"
                            value={numMatriculaEstudante}
                            onChange={this.handleChange}
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          />
                        </div>
                        {turmaEstudante ? (
                          <div className="field">
                            <label for="turma">Turma</label>
                            <InputText
                              id="turma"
                              value={`${turmaEstudante.codigo} `}
                              disabled
                              className="w-full text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round outline-none focus:border-primary"
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    )}
                    {this.state.tipoConta === 3 && (
                      <div>
                        <div className="field">
                          <label for="grauAcademicoOrientador">
                            Grau Academico do Orientador
                          </label>
                          <Dropdown
                            required
                            id="grauAcademicoOrientador"
                            value={grauAcademicoOrientador}
                            options={grauAcademicoOrientadorOptions}
                            onChange={this.handleGrauAcademicoOrientadorChange}
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          />
                        </div>
                        <div className="field">
                          <label for="universidade">
                            Universidade Onde Leciona
                          </label>
                          <Dropdown
                            required
                            id="universidade"
                            value={universidade}
                            options={universidadeOptions}
                            onChange={this.handleUniversidadeChange}
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                          />
                        </div>
                      </div>
                    )}
                    <br />
                    <p className="divider"></p>
                    <br />
                    <div className="formgrid grid">
                      <div className="field col-2">
                        <Button
                          type="button"
                          label="Alterar Senha"
                          className="p-button-outlined mr-2"
                          onClick={() =>
                            this.setState({ alterarSenhaVisible: true })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div>
              <Dialog
                header="Alterar Senha"
                visible={this.state.alterarSenhaVisible}
                style={{ width: "40vw" }}
                onHide={() => this.setState({ alterarSenhaVisible: false })}
              >
                <form onSubmit={this.handleSubmitAltarSenha}>
                  <div className="field">
                    <label for="senhaAntiga">Senha Antiga</label>
                    <InputText
                      required
                      id="senhaAntiga"
                      type="password"
                      name="senhaAntiga"
                      value={this.state.senhaAntiga}
                      onChange={this.handleChange}
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                  </div>

                  <div className="field">
                    <label for="novaSenha">Nova Senha</label>
                    <InputText
                      required
                      id="novaSenha"
                      type="password"
                      name="novaSenha"
                      value={this.state.novaSenha}
                      onChange={this.handleChange}
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                  </div>

                  <div className="field">
                    <label for="confirmarSenha">Confirmar Senha</label>
                    <InputText
                      required
                      id="confirmarSenha"
                      type="password"
                      name="confirmarSenha"
                      value={this.state.confirmarSenha}
                      onChange={this.handleChange}
                      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      label="Salvar"
                      className="p-button-outlined mr-2"
                    />
                  </div>
                </form>
              </Dialog>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default withRouter(Perfil);
