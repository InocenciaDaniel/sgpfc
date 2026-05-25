import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import favicon from "../../assets/images/favicon.png";
import { Message } from "primereact/message";
import api from "../axiosConfig";

class RedefinirSenha extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      error: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRedefinirSenha = async () => {
    const { email } = this.state;
    try {
      const response = await api.post("redefinir/senha", { email });

      if (response.data.pkConta === null) {
        this.setState({
          error: "Credenciais inválidas. Verifique seu email e senha.",
        });
        this.setState({ email: "", senha: "" });
      } else {
        localStorage.setItem("usuario", JSON.stringify(response.data));
        this.props.history.push("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.setState({
          error: "Credenciais inválidas. Verifique seu email e senha.",
        });
      } else {
        this.setState({
          error: "Erro ao fazer login. Por favor, tente novamente mais tarde.",
        });
      }
      this.setState({ email: "" });
    }
  };

  render() {
    const { email, error } = this.state;

    return (
      <div style={{ marginTop: "8rem" }}>
        <div className="flex align-items-center justify-content-center">
          <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
            <div className="text-center mb-5">
              <img src={favicon} alt="hyper" height={100} className="mb-3" />
              <div className="text-900 text-3xl font-medium mb-3">
                Redefinir Senha
              </div>
              <span className="text-600 font-medium line-height-3">
                Introduza o seu email, enviremos um link de redefinição de senha
              </span>
            </div>
            <form
              className="pt-3"
              onSubmit={(e) => {
                e.preventDefault();
                this.handleRedefinirSenha();
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
                  label="Enviar link de redefinição de senha"
                  className="w-full"
                  onClick={this.handleRedefinirSenha}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(RedefinirSenha);
