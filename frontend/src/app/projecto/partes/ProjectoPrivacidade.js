import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import api from "../../axiosConfig";
import { Toast } from "primereact/toast";
import "jspdf-autotable";

class ProjectoPrivacidade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      error: null,
      id: null,
      projecto: null,
      pkProjecto: null,
      privacidadeVisible: false,
      privacidade: "",
      privacidadeOptions: [
        { label: "Público", value: "Público" },
        {
          label: "Privado",
          value: "Privado",
        },
      ],
    };
    this.toast = React.createRef();
  }

  async componentDidMount() {
    try {
      const { projecto, usuarioLogado } = this.props;
      this.setState({ projecto: projecto, usuarioLogado: usuarioLogado });

      const { id } = this.props.match.params;
      const projectoResponse = await api.get(`projecto/${id}`);
      this.setState({
        pkProjecto: projectoResponse.data.pkProjecto,
        privacidade: projectoResponse.data.privacidade,
        projecto: projectoResponse.data,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  renderComunicarIrregularidadeModalContent = () => {
    return (
      <div>
        <form
          className="forms-sample"
          onSubmit={this.handleComunicarIrregularidadeSubmitAccao}
        >
          <div className="col-md-12">
            <br />
            <div className="p-field">
              <Dropdown
                required
                id="privacidade"
                value={this.state.privacidade}
                options={this.state.privacidadeOptions}
                onChange={(e) => this.setState({ privacidade: e.value })}
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              />
            </div>
            <br />
          </div>

          <Button
            severity="info"
            raised
            type="submit"
            label="Salvar"
            className="mr-2"
          />
        </form>
      </div>
    );
  };

  handleComunicarIrregularidadeSubmitAccao = async (e) => {
    e.preventDefault();
    const { privacidade, pkProjecto } = this.state;

    try {
      const formData = new FormData();
      formData.append("privacidade", privacidade);
      formData.append("pkProjecto", pkProjecto);

      await api.post("projecto/alterar/privacidade", formData);

      this.setState({
        privacidadeVisible: false,
      });
        this.toast.current.show({
            severity: "success",
            summary: "Sucesso",
            detail: "Privacidade do projecto alterada com sucesso",
            life: 3000,
        });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao alterar a privacidade do projecro", error);
        this.toast.current.show({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao alterar a privacidade do projecto",
            life: 3000,
        });
    }
  };

  render() {

    return (
      <div>
        <Toast ref={this.toast} />
        <div className="flex items-center gap-4">
          <div>
            <Button
              label="Alterar Privacidade do Projecto"
              className="botao-novo"
              onClick={() => this.setState({ privacidadeVisible: true })}
              icon="pi pi-pencil"
              raised
            />
            <Dialog
              header="Alterar Privacidade do Projecto"
              visible={this.state.privacidadeVisible}
              style={{ width: "40vw" }}
              onHide={() => this.setState({ privacidadeVisible: false })}
            >
              {this.renderComunicarIrregularidadeModalContent()}
            </Dialog>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProjectoPrivacidade);
