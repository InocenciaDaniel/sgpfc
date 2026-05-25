import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Toast } from "primereact/toast";
import ListaTarefasEstudante from "./ListaTarefasEstudante";

export class TarefaListaEstudanteIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      toast: null,
      turmaSelecionada: null,
    };
  }

  async componentDidMount() {
    const usuario = localStorage.getItem("usuario");

    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  render() {
    const { usuarioLogado } = this.state;

    return (
      <div>
        <style>
          {`
            .p-dataview .p-dataview-header{
              background: #ffffff;
              border: none;
            }
          `}
        </style>

        {usuarioLogado ? (
          <div className="p-7">
            <Toast ref={(el) => (this.toast = el)} />
            <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
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
                    Lista de Tarefas Atribuidas
                  </span>
                </li>
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                  <div className="flex align-items-center text-700 flex-wrap">
                    <div className="mr-5 flex align-items-center"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                <ListaTarefasEstudante/>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default TarefaListaEstudanteIndex;
