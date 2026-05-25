import React, { Component } from "react";
import Navbar from "./Navbar";
import api from "../axiosConfig";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";

class RepositorioIndex extends Component {
  state = {
    usuarioLogado: null,
    projectos: [],
    arquivoVisible: false,
    fileContent: null,
    mimeType: "",
    first: 0,
    rows: 3,
  };

  async componentDidMount() {
    const projectosPublicosResponse = await api.get(
      "projecto/findAllProjectoConcluidosComPrivacidadePublica"
    );

    const projectosTodosResponse = await api.get(
      "projecto/findAllProjectoConcluidos"
    );

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({
        usuarioLogado: JSON.parse(usuario),
        projectos: projectosTodosResponse.data,
      });
    } else {
      this.setState({ projectos: projectosPublicosResponse.data });
    }
  }

  hideFicheiroDialog = () => {
    this.setState({
      arquivoVisible: false,
      fileContent: null,
      mimeType: "",
    });
  };

  showFicheiroDialog = (ficheiro) => {
    console.log(ficheiro);
    this.setState({
      arquivoVisible: true,
    });
    this.fetchFile(ficheiro.relatorioFinalUrl);
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

    return (
      <div>
        <p>Visualização não disponivel</p>
        <a href={fileContent} download>
          Clique aqui para baixar o arquivo
        </a>
      </div>
    );
  };

  handleBack = () => {
    this.props.history.goBack();
  };

  fetchFile = (arquivoUrl) => {
    api
      .get(`upload/relatorios/${arquivoUrl}`, {
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

  onPageChange = (event) => {
    this.setState({
      first: event.first,
    });
  };

  renderCapa(projecto) {
    return (
      <div
        key={projecto.pkProjecto}
        style={{
          border: "2px solid #d9d9d9",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          maxWidth: "300px",
          minHeight: "400px",
        }}
      >
        <div
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            height: "100%",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            {projecto?.fkTema?.titulo}
          </div>
          <br />

          {projecto.fkEstudante && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              {projecto?.fkEstudante?.nome}
            </div>
          )}

          <div
            style={{
              fontSize: "12px",
              color: "#888",
              textAlign: "center",
            }}
          >
            {`Orientador: ${projecto?.fkOrientador?.nome}`}
          </div>
          <br />
          <br />
          {projecto.fkTurma && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              {projecto?.fkTurma?.fkAnoLectivo?.designacao}
            </div>
          )}
        </div>

        <div className="flex space-x-2 w-full justify-center">
          <Button
            label="Visualizar"
            className="btn btn-primary w-1/2 text-center"
            style={{
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "#fff",
              borderRadius: "4px",
              textDecoration: "none",
              marginRight: "5px",
            }}
            onClick={() => this.showFicheiroDialog(projecto)}
          />
          <a
            href={`http://localhost:3000/relatorios/${projecto?.relatorioFinalUrl}`}
            download={projecto?.relatorioFinalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-1/2 text-center"
            style={{
              padding: "10px",
              backgroundColor: "#28A745",
              color: "#fff",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            Download
          </a>
        </div>
      </div>
    );
  }

  render() {
    const { projectos, first, rows, usuarioLogado } = this.state;

    const projectsToShow = projectos.slice(first, first + rows);

    return (
      <div className="p-d-flex">
        <div style={{ flex: 1, padding: "20px" }}>
          <Navbar />
          <br />
          <div className="p-fluid" style={{ marginTop: "1px" }}>
            <div className="surface-section surface-card p-5 border-round flex-auto">
              <div className="col-12 p-1">
                {usuarioLogado ? (
                  <div
                    className="text-900 font-medium text-1xl mb-3"
                    style={{ textAlign: "right" }}
                  >
                    Olá, {usuarioLogado.fkUtilizador.nome}!
                  </div>
                ) : null}
                <div
                  className="py-3 border-bottom-1 surface-border flex flex-column md:flex-row align-items-center p-3 w-full border-round surface-card"
                  style={{
                    padding: "15px",
                    cursor: "pointer",
                    minHeight: "450px",
                  }}
                >
                  <div className="col-12 p-1">
                    {projectsToShow.map((projecto, fileIdx) => (
                      <div key={fileIdx}>
                        <br />
                        <div
                          className="flex flex-column md:flex-row align-items-center p-3 w-full hover:shadow-2 border-round surface-card transition-all"
                          style={{
                            border: "1px solid #d9d9d9",
                            padding: "15px",
                            cursor: "pointer",
                            minHeight: "450px", // Aumentando a altura das grids
                          }}
                        >
                          <div
                            className="flex-grow-1 md:w-2/3"
                            style={{ marginRight: "4em" }}
                          >
                            <a
                              href={`/repositorio-visualizar-projecto/${projecto.pkProjecto}`}
                              className="text-decoration-none"
                              style={{
                                color: "#333",
                                textDecoration: "none",
                              }}
                            >
                              <div className="font-bold text-xl mb-2">
                                {projecto?.fkTema?.titulo
                                  .charAt(0)
                                  .toUpperCase() +
                                  projecto?.fkTema?.titulo
                                    .slice(1)
                                    .toLowerCase()}
                              </div>
                              <div className="text-sm text-ellipsis overflow-hidden mb-0">
                                <p style={{ textAlign: "justify" }}>
                                  <strong>Descrição: </strong>
                                  {projecto?.fkTema?.descricao}
                                </p>
                              </div>
                              <div className="text-sm text-ellipsis overflow-hidden mb-0">
                                <p style={{ textAlign: "justify" }}>
                                  <strong>Justificativa: </strong>
                                  {projecto?.fkTema?.justificativa}
                                </p>
                              </div>
                              <div className="text-sm text-ellipsis overflow-hidden mb-0">
                                <p style={{ textAlign: "justify" }}>
                                  <strong>Diferencial: </strong>
                                  {projecto?.fkTema?.diferencial}
                                </p>
                              </div>
                              <div className="text-sm text-ellipsis overflow-hidden mb-0">
                                <p style={{ textAlign: "justify" }}>
                                  <strong>Linha de Pesquisa: </strong>
                                  {
                                    projecto?.fkTema?.fkLinhaPesquisa
                                      ?.designacao
                                  }
                                </p>
                              </div>
                              <div className="text-sm text-ellipsis overflow-hidden mb-0">
                                <p style={{ textAlign: "justify" }}>
                                  <strong>Curso: </strong>
                                  {
                                    projecto?.fkTurma?.fkDisciplina?.fkCurso
                                      ?.designacao
                                  }
                                </p>
                              </div>
                              <div className="text-sm text-ellipsis overflow-hidden mb-0">
                                <p style={{ textAlign: "justify" }}>
                                  <strong>Linha de Pesquisa: </strong>
                                  {
                                    projecto?.fkTema?.fkLocalRealizacao
                                      ?.designacao
                                  }
                                </p>
                              </div>
                            </a>
                          </div>

                          <div className="md:w-1/3 flex flex-col items-center">
                            {this.renderCapa(projecto)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paginador */}
          <Paginator
            first={first}
            rows={rows}
            totalRecords={projectos.length}
            onPageChange={this.onPageChange}
            className="p-mt-4"
          />

          {/* Botão de Voltar */}
          <div
            className="back-button"
            style={{ marginTop: "40px", textAlign: "right" }}
          >
            <Button
              label="Voltar"
              icon="pi pi-arrow-left"
              className="p-button-outlined"
              onClick={this.handleBack}
              style={{ backgroundColor: "#007bff", color: "#fff" }}
            />
          </div>
        </div>

        <Dialog
          visible={this.state.arquivoVisible}
          style={{ width: "70vw" }}
          onHide={this.hideFicheiroDialog}
        >
          {this.renderFileContent()}
        </Dialog>
      </div>
    );
  }
}

export default RepositorioIndex;
