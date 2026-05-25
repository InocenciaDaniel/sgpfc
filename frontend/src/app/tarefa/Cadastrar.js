import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import TarefaFormCadastrar from "../tarefa/FormCadastrar";

class TarefaCadastrar extends Component {
  state = {
    error: null,
    usuarioLogado: null,
    toast: null,
  };

  async componentDidMount() {
    try {
      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        this.setState({ usuarioLogado: JSON.parse(usuario) });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  render() {
    const { usuarioLogado } = this.state;

    return (
      <div>
        <style>
          {`
            #pr_id_3_content > div > div > div > span > input { width: 94% }
            .p-dropdown-label, .p-inputtext { width: 100%; }
        `}
        </style>
        {usuarioLogado ? (
          <div>
            <div className="p-7">
              <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
                <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                  <li>
                    <a
                      href="/tarefa-index"
                      className="text-500 no-underline line-height-3 cursor-pointer"
                    >
                      Tarefas
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
                </ul>
                <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                  <div>
                    <div className="flex align-items-center text-700 flex-wrap">
                      <div className="mr-5 flex align-items-center mt-3">
                        <i className="pi pi-users mr-2"></i>
                        <span>
                          Preenche o formulário abaixo para cadastrar uma nova
                          tarefa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <TarefaFormCadastrar />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(TarefaCadastrar);
