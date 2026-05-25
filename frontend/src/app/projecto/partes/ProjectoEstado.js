import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import api from "../../axiosConfig";
import { Dropdown } from "primereact/dropdown";

class ProjectoEstado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projecto: null,
      usuarioLogado: null,

      arquivoVisible: false,
      isCoordenador: false,
      justificativaProjecto: null,
      orientadoresOptions: [],
      novoOrientador: null,
      alterarOrientador: false,
      selectedFicheiro: null,
      
    };
    this.toast = React.createRef();
  }

  async componentDidMount() {
    try {
      const { projecto, usuarioLogado } = this.props;
      this.setState({ projecto: projecto, usuarioLogado: usuarioLogado });

      const response = await api.get(
        `utilizador/isCoordenador/${usuarioLogado?.fkUtilizador?.pkUtilizador}`
      );
      this.setState({ isCoordenador: response.data });

      const orientadoresResponse = await api.get(
        "utilizador/findAllOrientador"
      );
      const orientadoresOptions = orientadoresResponse.data.map((o) => ({
        label: o.nome,
        value: o.pkUtilizador,
      }));
      this.setState({ orientadoresOptions });

      if (
        projecto?.estado === "Desistido" ||
        projecto?.estado === "Reprovado"
      ) {
        const justificativaProjectoResponse = await api.get(
          `justificativaProjecto/findByPkProjecto/${projecto?.pkProjecto}`
        );
        if (justificativaProjectoResponse.data) {
          this.setState({
            justificativaProjecto: justificativaProjectoResponse.data,
          });
        }
      }

      this.setState({ projecto: projecto });
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  showRelatorioJustificativaDialog = (relatorio) => {
    this.setState({
      arquivoVisible: true,
      selectedFicheiro: relatorio,
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

  hideFicheiroDialog = () => {
    this.setState({
      arquivoVisible: false,
      selectedFicheiro: null,
      fileContent: null,
      mimeType: "",
    });
  };

  toggleEditMode = () => {
    this.setState({ alterarOrientador: !this.state.alterarOrientador });
  };

  confirmarAlterarOrientador = async (e) => {
    const { novoOrientador, projecto } = this.state;
    if (novoOrientador) {
      try {
        await api.put(
          `projecto/actualizar/orientador/${novoOrientador?.value}/${projecto?.pkProjecto}`
        );

        window.location.reload();
        setTimeout(() => {
          this.props.history.push(
            `/projecto-visualizar/${projecto?.pkProjecto}`
          );
        }, 500);
      } catch (error) {
        console.error("Erro ao salvar o orientador", error);
      }
      //window.location.reload();
      this.setState(
        {
          orientadorProposto: novoOrientador,
          alterarOrientador: false,
          novoOrientador: null,
        },
        () => {}
      );
    }
  };

  handleDropdownChange = (e) => {
    const orientadorSelecionado = this.state.orientadoresOptions.find(
      (o) => o.value === e.value
    );
    this.setState({ novoOrientador: orientadorSelecionado }, () => {});
  };

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
    if (mimeType.startsWith("image/")) {
      return <img src={fileContent} alt="Imagem" style={{ width: "100%" }} />;
    }
    if (mimeType === "text/plain") {
      return (
        <iframe
          src={fileContent}
          title="Arquivo de texto"
          style={{ width: "100%", height: "500px" }}
        />
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

  render() {
    const {
      projecto,
      arquivoVisible,
      isCoordenador,
      justificativaProjecto,
      alterarOrientador,
      novoOrientador,
      orientadoresOptions,
    } = this.state;

    return (
      <div>
        <ul className="list-none p-0 m-0">
          <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">
              {projecto?.estado === "Desistido"
                ? "Descontinuado"
                : projecto?.estado}{" "}
              por:
            </div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {justificativaProjecto?.fkDesistidoReprovadoPor?.nome} (
              {
                justificativaProjecto?.fkDesistidoReprovadoPor?.fkTipoConta
                  .designacao
              }
              )
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">
              {projecto?.estado} Aos:
            </div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {justificativaProjecto?.data}
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Motivo:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {justificativaProjecto?.motivo}
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">
              Justificativa:
            </div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {justificativaProjecto?.justificativa}
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Validado Por:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {justificativaProjecto?.fkValidadoPor?.nome} - {justificativaProjecto?.fkValidadoPor?.fkTipoConta?.designacao} 
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Validado Aos:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {justificativaProjecto?.dataValidade}
            </div>
          </li>
          <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">
              Relatório de Justificativa:
            </div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              <Button
                label={justificativaProjecto?.relatorio.split("/").pop()}
                icon="pi pi-external-link"
                onClick={() =>
                  this.showRelatorioJustificativaDialog(
                    justificativaProjecto?.relatorio
                  )
                }
                severity="info"
                outlined
              />
            </div>
          </li>
          {justificativaProjecto?.fkDesistidoReprovadoPor?.fkTipoConta
            .designacao === "Orientador" && projecto?.estado === "Desistido" ? (
            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div className="text-500 w-6 md:w-2 font-medium">
                Alterar o Orientador:
              </div>
              <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <div>
                  {alterarOrientador ? (
                    <Dropdown
                      value={novoOrientador?.value}
                      options={orientadoresOptions}
                      onChange={this.handleDropdownChange}
                      placeholder="Selecione um novo orientador"
                      className="w-full"
                    />
                  ) : (
                    <></>
                  )}
                  <br />
                  <br />
                  {alterarOrientador ? (
                    <Button
                      label="Salvar"
                      className="p-button-outlined"
                      onClick={this.confirmarAlterarOrientador}
                    />
                  ) : (
                    <Button
                      label="Atribuir novo orientador ao estudante"
                      disabled={!isCoordenador}
                      className="p-button-outlined"
                      onClick={this.toggleEditMode}
                    />
                  )}
                </div>
              </div>
            </li>
          ) : null}
        </ul>

        <Dialog
          visible={arquivoVisible}
          style={{ width: "70vw" }}
          onHide={this.hideFicheiroDialog}
        >
          {this.renderFileContent()}
        </Dialog>
      </div>
    );
  }
}

export default withRouter(ProjectoEstado);
