import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import favicon from "../../assets/images/favicon.png";
import { Message } from "primereact/message";
import api from "../axiosConfig";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      senha: "",
      rememberMe: false,
      error: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleCheckboxChange = (e) => {
    this.setState({ rememberMe: e.checked });
  };

  handleLogin = async () => {
    const { email, senha } = this.state;

    try {
      // Fazendo a requisição POST para o backend
      const response = await api.post(
        "login",
        { email, senha },
        {
          withCredentials: true, // Inclui cookies na requisição, caso necessário
        }
      );

      // Verifica a resposta do backend
      if (response.data.pkConta === null) {
        this.setState({
          error: "Credenciais inválidas. Verifique seu email e senha.",
          email: "",
          senha: "",
        });
      } else {
        console.log("authToken", response.data.token);
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("usuario", JSON.stringify(response.data));
        this.props.history.push("/dashboard");
      }
    } catch (error) {
      // Tratamento de erro
      if (error.response) {
        // Se houver erro na resposta da API (como 401 ou 404)
        if (error.response.status === 401) {
          this.setState({
            error: "Credenciais inválidas. Verifique seu email e senha.",
            email: "",
            senha: "",
          });
        } else {
          this.setState({
            error:
              "Erro ao fazer login. Por favor, tente novamente mais tarde.",
            email: "",
            senha: "",
          });
        }
      } else {
        // Se o erro não for da resposta da API (erro de rede ou outro)
        this.setState({
          error: "Erro desconhecido. Tente novamente.",
          email: "",
          senha: "",
        });
      }
    }
  };

  render() {
    const { email, senha, rememberMe, error } = this.state;

    return (
      <div style={{ marginTop: "8rem" }}>
        <div className="flex align-items-center justify-content-center">
          <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
            <div className="text-center mb-5">
              <img src={favicon} alt="hyper" height={100} className="mb-3" />
              <div className="text-900 text-3xl font-medium mb-3">Login</div>
              <span className="text-600 font-medium line-height-3">
                Faça o login para continuar
              </span>
            </div>
            <form
              className="pt-3"
              onSubmit={(e) => {
                e.preventDefault();
                this.handleLogin();
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-900 font-medium mb-2"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={this.handleInputChange}
                  className="w-full mb-3"
                />

                <label
                  htmlFor="senha"
                  className="block text-900 font-medium mb-2"
                >
                  Senha
                </label>
                <InputText
                  id="senha"
                  type="password"
                  name="senha"
                  placeholder="*******"
                  value={senha}
                  onChange={this.handleInputChange}
                  className="w-full mb-3"
                />

                <div className="flex align-items-center justify-content-between mb-6">
                  <div className="flex align-items-center">
                    <Checkbox
                      id="rememberme"
                      className="mr-2"
                      checked={rememberMe}
                      onChange={this.handleCheckboxChange}
                    />
                    <label htmlFor="rememberme">Lembrar-me</label>
                  </div>
                  <a
                    href="recuperar-senha"
                    className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
                  >
                    Recuperar Senha?
                  </a>
                </div>

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
                <Button
                  id="btnLogin"
                  label="Sign In"
                  className="w-full"
                  onClick={this.handleLogin}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
