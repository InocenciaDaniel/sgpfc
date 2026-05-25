import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import api from "../../axiosConfig";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";

class ProjectoAvaliacoes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      projecto: null,
      periodos: [],
      avaliacao: null,
      comentario: null,
      isCoordenador: false,
      podeAvaliar: false,
      avaliacaoOrientador: null,
    };

    this.toast = React.createRef();
  }

  async componentDidMount() {
    try {
      const { projecto, usuarioLogado } = this.props;

      this.setState({ projecto: projecto, usuarioLogado: usuarioLogado });

      const responsePeriodos = await api.get(`avaliacao/periodo/findAll/`);

      const response = await api.get(
        `utilizador/isCoordenador/${this.state.usuarioLogado.fkUtilizador.pkUtilizador}`,
        {
          withCredentials: true,
        }
      );

      const podeAvaliarresponse = await api.get(
        `avaliacao/orientador/pode/avaliar/${this.state.projecto.pkProjecto}`,
        {
          withCredentials: true,
        }
      );

      this.setState({
        isCoordenador: response.data,
        periodos: responsePeriodos.data,
        podeAvaliar: podeAvaliarresponse.data,
      });

      if (!this.state.podeAvaliar) {
        const avaliacaoOrientadorresponse = await api.get(
          `avaliacao/orientador/findByFkProjecto/${this.state.projecto.pkProjecto}`
        );

        this.setState({
          avaliacaoOrientador: avaliacaoOrientadorresponse.data,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  onSubmitAvaliacao = async () => {
    const { avaliacao, comentario, projecto } = this.state;

    try {
      await api.post("avaliacao/orientador/save", {
        fkProjecto: projecto,
        comentario,
        avaliacao,
      });
      this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Periodo adicionado com sucesso!",
        life: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao criar o periodo.",
        life: 3000,
      });
    }
  };

  render() {
    const { usuarioLogado, projecto, avaliacao, comentario, podeAvaliar } =
      this.state;
    const isEstudante =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Estudante";

    return (
      <div>
        <Toast ref={this.toast} />

        <br />
        {isEstudante && podeAvaliar && projecto.estado === "Em andamento" && (
          <div className="">
            <h2 className="card-title mb-1">
              Escreva uma avaliação do seu orientador
            </h2>
            <form className="p-fluid grid" onSubmit={this.onSubmitAvaliacao}>
              <div className="field col-12">
                <Rating
                  id="avaliacao"
                  value={avaliacao}
                  cancel={false}
                  onChange={(e) => this.setState({ avaliacao: e.value })}
                  stars={5}
                  required
                  tooltip="Clique para avaliar"
                />
              </div>

              <div className="field col-12">
                <label htmlFor="comentario">Deixe um Comentário</label>
                <InputTextarea
                  id="comentario"
                  name="comentario"
                  rows={5}
                  cols={30}
                  placeholder="Escreva aqui..."
                  required
                  value={comentario}
                  onChange={(e) =>
                    this.setState({ comentario: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <Button label="Salvar" type="submit" className="p-button" />
              </div>
            </form>
          </div>
        )}
        {!podeAvaliar && (
          <div className="card p-fluid grid">
            <div className="field col-12">
              <p style={{ textAlign: "justify" }}>
                {this.state.avaliacaoOrientador?.comentario}
              </p>
            </div>
            <div className="field col-12">
              <Rating
                id="avaliacao"
                value={this.state.avaliacaoOrientador?.avaliacao}
                cancel={false}
                stars={5}
                disabled
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(ProjectoAvaliacoes);
