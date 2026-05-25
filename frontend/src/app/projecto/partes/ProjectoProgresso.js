import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import api from "../../axiosConfig";

class ProjectoProgresso extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      tarefas: [],
      templates: [],
      filteredTarefas: null,
      selectedDate: new Date(),
      events: [],
      projecto: null,

      tarefasSelecionadas: [],
      tarefaOptions: [],
    };
  }

  async componentDidMount() {
    try {
      const { projecto, usuarioLogado } = this.props;

      this.setState({ projecto: projecto, usuarioLogado: usuarioLogado });

      console.log("Projecto:", this.state.projecto);

      const responseTarefasDoEstudanteAtribuidasAoEstudante = await api.get(
        `tarefasAtribuidas/findLastTarefa/${projecto?.fkEstudante?.pkUtilizador}/${projecto?.pkProjecto}/${projecto?.fkTurma?.pkTurma}`
      );
      this.setState({
        tarefas: 
          responseTarefasDoEstudanteAtribuidasAoEstudante.data,
      });
      console.log(
        "Tarefas do estudante atribuidas ao estudante:",
        this.state.tarefas
      );
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  render() {
    const { projecto, porcentagemConcluida } = this.state;

    return (
      <div>
        {projecto?.progresso}
        <div
          className="surface-300 w-full mt-2"
          style={{ height: "7px", borderRadius: "4px" }}
        >
          <div
            className="bg-orange-500 h-full"
            style={{ width: `${projecto?.progresso}%`, borderRadius: "4px" }}
          ></div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProjectoProgresso);
