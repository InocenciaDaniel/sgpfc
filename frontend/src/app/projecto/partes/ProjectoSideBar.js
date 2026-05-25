import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import api from "../../axiosConfig";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

class ProjectoSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      projecto: null,
      numeroFaltas: null,

      //Actualização do relatorio final
      showUploadRelatorio: false,
      relatorioFinal: null,
      projectoZip: null,
      toast: null,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      nextProps.projecto !== nextState.projecto ||
      nextProps.usuarioLogado !== nextState.usuarioLogado ||
      nextProps.numeroFaltas !== nextState.numeroFaltas
    ) {
      return {
        projecto: nextProps.projecto,
        usuarioLogado: nextProps.usuarioLogado,
        numeroFaltas: nextProps.numeroFaltas,
      };
    }
    return null;
  }

  async componentDidMount() {
    try {
      const { projecto, usuarioLogado, numeroFaltas } = this.props;

      this.setState({
        projecto: projecto,
        usuarioLogado: usuarioLogado,
        numeroFaltas: numeroFaltas,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  actualizarRelatorioModal = () => {
    this.setState((prevState) => ({
      showUploadRelatorio: !prevState.showUploadRelatorio,
    }));
  };

  renderModalActualizarRelatorioFinal = () => {
    return (
      <div>
        <Toast ref={(el) => (this.toast = el)} />
        <div className="surface-0">
          <ul className="list-nrelatorioFinalone p-0 m-0">
            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
              <div className="text-500 w-6 md:w-2 font-medium">
                Relatório Final
              </div>
              <div className="w-6 md:w-10 flex justify-content-end">
                <FileUpload
                  name="relatorioFinal"
                  accept=".docx,.doc,.pdf"
                  onSelect={(e) => {
                    const file = e.files[0];
                    this.setState({ relatorioFinal: file });
                  }}
                  chooseLabel="Fazer o upload do relatório final (.docx, .doc, .pdf)"
                  mode="basic"
                  className="p-d-block"
                  required
                />
              </div>
            </li>
            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
              <div className="text-500 w-6 md:w-2 font-medium">
                Projecto/Código
              </div>
              <div className="w-6 md:w-10 flex justify-content-end">
                <FileUpload
                  name="projectoZip"
                  accept=".zip"
                  onSelect={(e) => {
                    const file = e.files[0];
                    this.setState({ projectoZip: file });
                  }}
                  chooseLabel="Fazer o upload do código/projecto (.zip)"
                  mode="basic"
                  className="p-d-block"
                  required
                />
              </div>
            </li>
          </ul>
        </div>

        <p className="m-0 divider"></p>
        <div className="mt-3">
          <button
            className="p-button p-button-success"
            onClick={this.handleFileRelatorioFinal}
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    );
  };

  handleFileRelatorioFinal = async () => {
    const { relatorioFinal, projectoZip, projecto } = this.state;

    const formData = new FormData();
    if (relatorioFinal) {
      formData.append("relatorioFinal", relatorioFinal);
    }
    if (projectoZip) {
      formData.append("projectoZip", projectoZip);
    }
    formData.append("pkProjecto", projecto?.pkProjecto);

    api
      .put("/projecto/upload/relatorio/final", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        this.setState({ showUploadRelatorio: false });
        this.toast.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Upload do relatório final bem-sucedido!",
          life: 3000,
        });
        window.location.reload();
      })
      .catch((error) => {
        this.toast.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao fazer upload do relatório final.",
          life: 3000,
        });
      });
  };

  render() {
    const { usuarioLogado, projecto, numeroFaltas } = this.state;
    const isEstudante =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Estudante";

    return (
      <div className="col-12 lg:col-3 lg:border-left-1 surface-border">
        <style>
          {`
            .file-container {
              display: flex;
              flex-direction: column;
              gap: 1rem;
              padding: 1rem;
              border-top: 1px solid #e0e0e0;
            }

            .file-item {
              display: flex;
              align-items: center;
              padding: 0.5rem;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              background-color: #f9f9f9;
              transition: background-color 0.3s ease;
            }

            .file-item:hover {
              background-color: #f1f1f1;
            }

            .file-icon {
              font-size: 1.5rem;
              color: #007bff;
              margin-right: 0.5rem;
            }

            .file-link {
              color: #007bff;
              text-decoration: none;
              transition: color 0.3s ease;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 200px; /* Ajuste conforme necessário */
            }

            .file-link:hover {
              color: #0056b3;
            }
        `}
        </style>

        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Estudante: </b>
              {projecto?.fkEstudante?.nome}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Nº Matricula: </b>
              {projecto?.fkEstudante?.numMatriculaEstudante}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Telefone: </b>
              {projecto?.fkEstudante?.telefone}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Nº De Faltas: </b>
              {numeroFaltas !== null ? numeroFaltas : "0"}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Orientador: </b>
              {projecto?.fkOrientador?.nome}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            {isEstudante ? (
              <p>
                <b>Turma: </b>
                {projecto?.fkTurma?.codigo}
              </p>
            ) : (
              <p>
                <b>Turma: </b>
                <a
                  href={`/turma-visualizar/${projecto?.fkTurma?.pkTurma}`}
                  style={{
                    textDecoration: "none",
                    color: "#123456",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#0D253F")}
                  onMouseLeave={(e) => (e.target.style.color = "#123456")}
                >
                  {projecto?.fkTurma?.codigo}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Semestre: </b>
              {projecto?.fkTurma?.fkSemestre?.designacao}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Disciplina: </b>
              {projecto?.fkTurma?.fkDisciplina?.designacao}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Ano Lectivo: </b>
              {projecto?.fkTurma?.fkAnoLectivo?.designacao}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Coordenador da Turma: </b>
              {projecto?.fkTurma?.fkCoodenador?.nome}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Curso: </b>
              {projecto?.fkTurma?.fkDisciplina?.fkCurso?.designacao}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Area Conhecimento: </b>
              {projecto?.fkTema?.fkAreaConhecimento
                ? projecto?.fkTema?.fkAreaConhecimento?.designacao
                : ""}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Local Realização: </b>
              {projecto?.fkTema?.fkLocalRealizacao
                ? projecto.fkTema?.fkLocalRealizacao?.designacao
                : ""}
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-column align-items-start">
            <p>
              <b>Linha Pesquisa: </b>
              {projecto?.fkTema?.fkLinhaPesquisa?.designacao}
            </p>
          </div>
        </div>
        {projecto?.estado === "Concluido" && (
          <div className="flex">
            <div className="flex flex-column align-items-start">
              <p>
                <b>Privacidade: </b>
                {projecto?.privacidade}
              </p>
            </div>
          </div>
        )}

        {isEstudante &&
        projecto?.estado === "Em andamento" &&
        projecto?.fkTurma?.deletedAt === null ? (
          <div>
            <div className="flex pt-4">
              <Button
                label="Actualizar Relatório Final"
                icon="pi pi-upload"
                onClick={this.actualizarRelatorioModal}
                className="p-button-primary"
              />
            </div>
            <br />
          </div>
        ) : (
          <></>
        )}
        <br />

        {projecto?.relatorioFinalUrl !== null && (
          <div className="file-container">
            <div className="file-item">
              <span className="pi pi-file file-icon"></span>
              <a
                href={`http://localhost:3000/relatorios/${projecto?.relatorioFinalUrl}`}
                download={projecto?.relatorioFinalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="file-link"
              >
                {projecto?.relatorioFinalUrl}
              </a>
            </div>
            <div className="file-item">
              <span className="pi pi-file file-icon"></span>
              <a
                href={`http://localhost:3000/relatorios/${projecto?.projectoZipUrl}`}
                download={projecto?.projectoZipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="file-link"
              >
                {projecto?.projectoZipUrl}
              </a>
            </div>
          </div>
        )}

        {/* Modal para upload do relatório */}
        <Dialog
          header="Actualizar Arquivos"
          visible={this.state.showUploadRelatorio}
          style={{ width: "50vw" }}
          onHide={() => this.setState({ showUploadRelatorio: false })}
        >
          {this.renderModalActualizarRelatorioFinal()}
        </Dialog>
      </div>
    );
  }
}
export default withRouter(ProjectoSideBar);
