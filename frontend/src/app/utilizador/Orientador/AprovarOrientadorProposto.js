import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import api from "../../axiosConfig";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

class UtilizadorAprovarOrientadorProposto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      id: null,
      pkUtilizador: "",
      universidade: null,
      grauAcademicoOrientador: null,
      sexoOptions: [],
      universidadeOptions: [],

      arquivoVisible: false,
      fileContent: null,
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
      const utilizadorResponse = await api.get(`orientadorProposto/${id}`);
      this.setState({
        id,
        orientadorProposto: utilizadorResponse.data,
        pkUtilizador: utilizadorResponse.data.pkOrientadorProposto,
        sexoOptions,
      });

      const universidadeResponse = await api.get("universidade/findAll");
      const universidadeOptions = universidadeResponse.data.map((u) => ({
        label: u.designacao,
        value: u.pkUniversidade,
      }));

      this.setState({
        universidadeOptions,
        universidade: utilizadorResponse.data.fkUniversidadeOrientador,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
    }
  }

  renderFileContent = () => {
    const { fileContent, mimeType } = this.state;
    if (!fileContent) {
      return <p>Carregando arquivo...</p>;
    }
    if (mimeType === "application/pdf") {
      return (
        <object
          data={fileContent}
          type="application/pdf"
          width="100%"
          height="500px"
        >
          <p>
            Seu navegador não suporta exibir PDFs.{" "}
            <a href={fileContent} target="_blank" rel="noopener noreferrer">
              Baixar PDF
            </a>
          </p>
        </object>
      );
    }
    return (
      <div>
        <p>Visualização não disponivel</p>
        <a href={fileContent} download>
          Clique aqui para baixar o arquivo
        </a>
      </div>
    );
  };

  showCVDialog = (relatorio) => {
    this.setState({
      arquivoVisible: true,
    });
    this.fetchFile(relatorio);
  };

  fetchFile = (arquivoUrl) => {
    api
      .get(`upload/${arquivoUrl}`, {
        responseType: "blob",
      })
      .then((response) => {
        const mimeType = response.headers["content-type"];
        const fileBlob = response.data;
        const fileURL = URL.createObjectURL(fileBlob);
        this.setState({
          fileContent: fileURL,
          mimeType: mimeType,
        });
      })
      .catch((error) => {
        console.error("Erro ao buscar o arquivo:", error);
      });
  };

  aprovar = async () => {
    try {
      const { /*curriculumFile,*/ orientadorProposto, usuarioLogado } =
        this.state;

      try {
        const existsByEmailResponse = await api.get(
          `conta/existsByEmail/${orientadorProposto.email}`
        );
        if (existsByEmailResponse.data) {
          this.setState({ error: "O email já está cadastrado." });
          return;
        }

        const novo = {
          nome: orientadorProposto?.nome,
          email: orientadorProposto?.email,
          telefone: orientadorProposto?.telefone,
          numMatriculaEstudante: null,
          sexo: orientadorProposto?.fkSexo?.pkSexo,
          tipoConta: 3,
          grauAcademicoOrientador: orientadorProposto?.grauAcademicoOrientador,
          universidade:
            orientadorProposto?.fkUniversidadeOrientador?.pkUniversidade,
          cadastradoPor: usuarioLogado?.fkUtilizador?.pkUtilizador,
        };

        const formData = new FormData();
        formData.append(
          "utilizador",
          new Blob([JSON.stringify(novo)], {
            type: "application/json",
          })
        );

        formData.append("curriculumUrl", orientadorProposto.curriculumUrl);

        await api.post("utilizador/save/orientadorProposto", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await api.delete(`orientadorProposto/deleteById/${this.state.id}`);
      } catch (error) {
        console.error("Erro ao salvar utilizador e conta", error);
        alert("Erro ao salvar utilizador e conta.");
        return;
      }

      this.props.history.push("/dashboard");
    } catch (error) {
      console.error("Error ao aprovar orientador", error);
    }
  };

  rejeitar = async () => {
    try {
      await api.put(`orientadorProposto/rejeitar/${this.state.id}`);

      this.props.history.push("/dashboard");
    } catch (error) {
      console.error("Error ao rejeitar", error);
    }
  };

  render() {
    const { orientadorProposto, usuarioLogado, universidade, arquivoVisible } =
      this.state;

    return (
      <div>
        <style>
          {`
              .p-dropdown-label, .p-inputtext{
                  width: 100%;
              }
            `}
        </style>
        {usuarioLogado ? (
          <div className="p-7">
            <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/dashboard"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Utilizadores
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">Mais Detalhes</span>
                </li>
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                  <div className="flex align-items-center text-700 flex-wrap">
                    <div className="mr-5 flex align-items-center mt-3">
                      <span>
                        Formulário para aprovar um orientador proposto de outra
                        universidade
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex align-items-center text-700 flex-wrap">
                  <div className="mt-3 lg:mt-0">
                    <Button
                      label="Aprovar Orientador"
                      className="p-button mr-2"
                      onClick={this.aprovar}
                    />
                  </div>
                  <div className="mt-3 lg:mt-0">
                    <Button
                      label="Rejeitar Orientador"
                      className="p-button-outlined mr-2"
                      onClick={this.rejeitar}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                <div className="surface-section">
                  <div className="grid">
                    <div className="col-11">
                      <div className="font-medium text-3xl text-900 mb-3">
                        Orientador Proposto
                      </div>
                    </div>
                  </div>
                  <ul className="list-none p-0 m-0">
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Nome Completo
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {orientadorProposto?.nome}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Email
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {orientadorProposto?.email}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Telefone
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {orientadorProposto?.telefone}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Gênero
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {orientadorProposto?.fkSexo?.designacao}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Grau Academico do Orientador
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {orientadorProposto?.grauAcademicoOrientador}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Universidade do Orientador
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {universidade?.designacao}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Orientador Proposto Por
                      </div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {orientadorProposto?.fkCadastradoPor?.nome}
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">
                        Curriculum Vitae
                      </div>
                      <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1">
                        <Button
                          label={orientadorProposto?.curriculumUrl
                            .split("/")
                            .pop()}
                          icon="pi pi-external-link"
                          onClick={() =>
                            this.showCVDialog(orientadorProposto?.curriculumUrl)
                          }
                          severity="info"
                          outlined
                        />
                        <Dialog
                          visible={arquivoVisible}
                          style={{ width: "70vw" }}
                          onHide={() =>
                            this.setState({ arquivoVisible: false })
                          }
                        >
                          {this.renderFileContent()}
                        </Dialog>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(UtilizadorAprovarOrientadorProposto);
