import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Badge } from "primereact/badge";
import api from "../../axiosConfig";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";

class ProjectoTarefas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      projecto: null,
      tarefas: [],
      expandedRows: null,
      displayDialog: false,
      tarefaSelecionada: null,
      uploadedFiles: [],
      entregasEstudante: {},
      entregas: {},
      ficheirosEntrega: {},
      ficheiros: {},
      pontuacao: null,

      avaliarVisible: false,

      solicitarAlteracoes: false,
      comentarios: "",

      arquivoVisible: false,
      selectedFicheiro: null,
      fileContent: null,
      mimeType: "",

      progresso: 0,
    };

    this.toast = React.createRef();
  }

  async componentDidMount() {
    try {
      const { projecto, usuarioLogado } = this.props;

      this.setState({ projecto: projecto, usuarioLogado: usuarioLogado });

      const responseTarefasDoEstudanteAtribuidasAoEstudante = await api.get(
        `tarefasAtribuidas/findAllTarefasDoEstudanteAtribuidasAoEstudante/${projecto?.fkEstudante?.pkUtilizador}/${projecto?.pkProjecto}`
      );
      const responseTarefasDoEstudanteAtribuidasATurma = await api.get(
        `tarefasAtribuidas/findAllTarefasDoEstudanteAtribuidasATurma/${projecto?.fkTurma?.pkTurma}`
      );

      this.setState({
        tarefas: [
          ...responseTarefasDoEstudanteAtribuidasAoEstudante.data,
          ...responseTarefasDoEstudanteAtribuidasATurma.data,
        ],
      });

      let entregasEstudante = {};
      for (let tarefa of this.state.tarefas) {
        const entregasResponse = await api.get(
          `tarefasEntregasEstudante/findByFkProjectoAndTarefaAtribuida/${projecto?.pkProjecto}/${tarefa?.pkTarefasAtribuidas}`
        );
        const pkTarefasEntregasEstudante =
          entregasResponse.data.pkTarefasEntregasEstudante;
        if (!pkTarefasEntregasEstudante) {
          continue;
        }
        entregasEstudante[tarefa.pkTarefasAtribuidas] = entregasResponse.data;

        const ficheirosResponse = await api.get(
          `upload/findByFkTarefasEntregasEstudante/${pkTarefasEntregasEstudante}`
        );

        this.setState((prevState) => {
          const ficheirosEntrega = prevState.ficheirosEntrega || {};

          ficheirosEntrega[pkTarefasEntregasEstudante] = ficheirosEntrega[
            pkTarefasEntregasEstudante
          ]
            ? [
                ...ficheirosEntrega[pkTarefasEntregasEstudante],
                ...ficheirosResponse.data,
              ]
            : ficheirosResponse.data;

          return { ficheirosEntrega };
        });
      }

      /*const responseTarefasAtribuidasAoEstudante = await api.get(
        `tarefasAtribuidas/findLastTarefa/${this.state.projecto?.fkEstudante?.pkUtilizador}/${this.state.projecto?.pkProjecto}/${this.state.projecto?.fkTurma?.pkTurma}`
      );
      this.setState({
        progresso:
          ((this.state.projecto.progresso * 100) /
          responseTarefasAtribuidasAoEstudante.data.length).toFixed(1),
      });*/

      this.setState({ entregasEstudante });
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  handleCompletarTarefa = (tarefa) => {
    this.setState({
      displayDialog: true,
      tarefaSelecionada: tarefa,
    });
  };

  handleAvaliarTarefa = (tarefa) => {
    this.setState({
      avaliarVisible: true,
      tarefaSelecionada: tarefa,
    });
  };

  handleRemoverTarefa = async (tarefa) => {
    this.setState({
      tarefaSelecionada: tarefa,
    });

    try {
      await api.delete(
        `tarefasAtribuidas/deleteById/${tarefa.pkTarefasAtribuidas}`
      );
      this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Tarefa removida com sucesso!",
        life: 3000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao remover a tarefa.",
        life: 3000,
      });
    }
    this.setState({
      tarefaSelecionada: null,
    });
  };

  handleSolicitarAlteracoesChange = (e) => {
    this.setState({ solicitarAlteracoes: e.checked });
  };

  hideDialog = () => {
    this.setState({ displayDialog: false });
  };

  onFileUpload = (e) => {
    this.setState({ uploadedFiles: e.files });
  };

  showAvaliarDialog = () => {
    this.setState({ avaliarVisible: true });
  };

  hideAvaliarDialog = () => {
    this.setState({ avaliarVisible: false });
  };

  onRowExpand = (event) => {
    this.toast.current.show({
      severity: "info",
      summary: "Tarefa Expandida",
      detail: event.data.designacaoTarefa,
      life: 3000,
    });
  };

  onSubmitAvaliacao = async () => {
    const {
      comentarios,
      pontuacao,
      tarefaSelecionada,
      solicitarAlteracoes,
      projecto,
    } = this.state;

    if (!comentarios) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, deixe um comentário.",
        life: 3000,
      });
      return;
    }

    try {
      await api.put("tarefasEntregasEstudante/avaliar", {
        pkProjecto: projecto.pkProjecto,
        pkTarefa: tarefaSelecionada.pkTarefasAtribuidas,
        comentarios,
        pontuacao,
        solicitarAlteracoes,
      });
      this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Avaliação feita com sucesso!",
        life: 3000,
      });
      window.location.reload();
    } catch (error) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao enviar a avaliação.",
        life: 3000,
      });
    }

    this.hideAvaliarDialog();
  };

  showFicheiroDialog = (ficheiro) => {
    console.log(ficheiro);
    this.setState({
      arquivoVisible: true,
      selectedFicheiro: ficheiro.arquivoUrl,
    });
    this.fetchFile(ficheiro.arquivoUrl);
  };

  hideFicheiroDialog = () => {
    this.setState({
      arquivoVisible: false,
      selectedFicheiro: null,
      fileContent: null,
      mimeType: "",
    });
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

  rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <span>
          <strong>Descrição: </strong> {data.descricaoTarefa}
        </span>
        <br />
        <span>
          <strong>Tipo Tarefa: </strong> {data.tipoTarefa}
        </span>
        <br />
        <span>
          <strong>Tarefa atribuida a (o): </strong> {data.tarefaAtribuidaA}
        </span>
        <br />
        {/*<span>
          <strong>Tarefa Atualizada aos: </strong>{" "}
          {data.dataActualizacaoTarefaEntregaEstudante}
        </span>
        <br />*/}
        <span>
          <strong>Peso: </strong> {data.pesoTarefa}%
        </span>
        <br />
        <span>
          <strong>Obrigatório Fazer o Upload de Ficheiros? </strong>{" "}
          {data.uploadObrigatorioTarefa ? "Sim" : "Não"}
        </span>
        <br />
        <span>
          <strong>Observações: </strong> {data.observacoesTarefa}
        </span>
        <br />
        <br />
        <p className="divider"></p>

        {this.state.entregasEstudante[data.pkTarefasAtribuidas]
          .dataActualizacaoTarefaEntregaEstudante && (
          <span>
            <strong>Data Tarefa Realizada: </strong>
            {
              this.state.entregasEstudante[data.pkTarefasAtribuidas]
                ?.dataActualizacaoTarefaEntregaEstudante
            }
            {
              this.state.entregasEstudante[data.pkTarefasAtribuidas]
                ?.dataActualizacaoTarefaEntregaEstudante
            }
          </span>
        )}
        <br />
        {this.state.entregasEstudante[data.pkTarefasAtribuidas].pontuacao && (
          <span>
            <strong>Pontuação: </strong>{" "}
            {this.state.entregasEstudante[data.pkTarefasAtribuidas].pontuacao}{" "}
            pontos
          </span>
        )}
        <br />
        {this.state.entregasEstudante[data.pkTarefasAtribuidas]
          .observacoesDoOrientador && (
          <span>
            <strong>Observações do Orientador: </strong>
            {
              this.state.entregasEstudante[data.pkTarefasAtribuidas]
                .observacoesDoOrientador
            }
          </span>
        )}
        <br />
        <p className="divider"></p>
        {this.state.entregasEstudante[data.pkTarefasAtribuidas]
          .pkTarefasEntregasEstudante && (
          <div>
            <DataTable
              value={
                this.state.entregasEstudante[data.pkTarefasAtribuidas]
                  ? this.state.ficheirosEntrega[
                      this.state.entregasEstudante[data.pkTarefasAtribuidas]
                        ?.pkTarefasEntregasEstudante
                    ]
                  : []
              }
            >
              <Column
                field="arquivoUrl"
                header="Ficheiros Entregues"
                body={(rowData) => (
                  <div>
                    {rowData?.arquivoUrl ? (
                      <div>
                        <Button
                          className="p-button p-component mb-5 md:mb-0"
                          style={{
                            border: "none",
                            boxShadow: "none",
                            backgroundColor: "transparent",
                            color: "inherit",
                          }}
                          label={rowData?.arquivoUrl.split("/").pop()}
                          icon="pi pi-external-link"
                          onClick={() => this.showFicheiroDialog(rowData)}
                        />
                        {this.state.entregasEstudante[data.pkTarefasAtribuidas]
                          ?.estadoTarefaEntregaEstudante !== "Concluída" &&
                        new Date(
                          this.state.entregasEstudante[
                            data.pkTarefasAtribuidas
                          ]?.dataActualizacaoTarefaEntregaEstudante
                        )
                          .toISOString()
                          .split("T")[0] ===
                          new Date(rowData?.dataUpload)
                            .toISOString()
                            .split("T")[0] ? (
                          <Badge
                            value="Novo"
                            style={{ background: "#95a5a6" }}
                          ></Badge>
                        ) : (
                          <></>
                        )}
                      </div>
                    ) : (
                      <div>Nenhum arquivo entregue</div>
                    )}
                  </div>
                )}
              />
            </DataTable>
          </div>
        )}
      </div>
    );
  };

  handleCompletarTarefaSemUpload = async () => {
    const { tarefaSelecionada, projecto } = this.state;

    await api
      .post("upload/atualizarEstado", null, {
        params: {
          fk_projecto: projecto.pkProjecto,
          fk_tarefa: tarefaSelecionada.pkTarefasAtribuidas,
        },
      })
      .then((response) => {
        console.log("Resposta do servidor:", response);
        this.toast.current.show({
          severity: "success",
          summary: "Tarefa Completa",
          detail: `A tarefa ${tarefaSelecionada.designacaoTarefa} foi completada sem upload de arquivos.`,
          life: 3000,
        });

        this.setState({ displayDialog: false });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);

        this.toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao marcar a tarefa como completa.",
          life: 3000,
        });
        console.error("Erro ao marcar tarefa como completa:", error);
      });
  };

  render() {
    const {
      usuarioLogado,
      tarefas,
      expandedRows,
      displayDialog,
      tarefaSelecionada,
      uploadedFiles,
      projecto,
      arquivoVisible,
    } = this.state;
    const isEstudante =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Estudante";
    const isOrientadorDoProjecto =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Orientador" &&
      projecto?.fkOrientador?.pkUtilizador ===
        usuarioLogado?.fkUtilizador?.pkUtilizador;

    return (
      <div className="card">
        <Toast ref={this.toast} />
        <DataTable
          value={tarefas}
          expandedRows={expandedRows}
          onRowToggle={(e) => this.setState({ expandedRows: e.data })}
          onRowExpand={this.onRowExpand}
          rowExpansionTemplate={this.rowExpansionTemplate}
          dataKey="pkTarefasAtribuidas"
          tableStyle={{ minWidth: "60rem" }}
        >
          <Column expander style={{ width: "5rem" }} />
          <Column field="designacaoTarefa" header="Tarefa" sortable />
          <Column
            field="dataEntregaTarefa"
            header="Prazo de Entrega"
            sortable
          />
          <Column
            field="estadoTarefaEstudante"
            header="Estado"
            sortable
            body={(rowData) => {
              const tarefaId = rowData.pkTarefasAtribuidas;
              const entrega = this.state.entregasEstudante[tarefaId];

              const estadoTarefa = entrega
                ? entrega.estadoTarefaEntregaEstudante
                : "Novo";

              return <span>{estadoTarefa}</span>;
            }}
          />
          <Column
            header="Ações"
            body={(rowData) => {
              const tarefaId = rowData.pkTarefasAtribuidas;
              const entrega = this.state.entregasEstudante[tarefaId];
              return (
                <div className="p-d-flex p-flex-column">
                  {isEstudante &&
                    projecto?.estado === "Em andamento" &&
                    (entrega === null ||
                      entrega === undefined ||
                      entrega?.estadoTarefaEntregaEstudante === "Novo" ||
                      entrega?.estadoTarefaEntregaEstudante ===
                        "Alterações Solicitadas") &&
                    projecto?.fkTurma?.deletedAt === null && (
                      <Button
                        label="Completar"
                        icon="pi pi-check"
                        className="p-button-success p-mb-2"
                        onClick={() => this.handleCompletarTarefa(rowData)}
                      />
                    )}
                  {isOrientadorDoProjecto &&
                    projecto?.estado === "Em andamento" &&
                    entrega?.estadoTarefaEntregaEstudante === "Em Revisão" &&
                    projecto?.fkTurma?.deletedAt === null && (
                      <Button
                        label="Avaliar"
                        icon="pi pi-star"
                        className="p-button-warning"
                        onClick={() => this.handleAvaliarTarefa(rowData)}
                      />
                    )}
                  {isOrientadorDoProjecto &&
                    projecto?.estado === "Em andamento" &&
                    (entrega === null ||
                      entrega === undefined ||
                      entrega?.estadoTarefaEntregaEstudante === "Novo") &&
                    projecto?.fkTurma?.deletedAt === null && (
                      <Button
                        label="Remover"
                        icon="pi pi-trash"
                        className="p-button-danger p-mb-2"
                        onClick={() => this.handleRemoverTarefa(rowData)}
                      />
                    )}
                </div>
              );
            }}
          />

          <Column
            header=""
            body={(rowData) => (
              <div className="p-d-flex p-flex-column">
                {isEstudante &&
                  projecto?.estado === "Em andamento" &&
                  (rowData.estadoTarefaEstudante === "Novo" ||
                    rowData.estadoTarefaEstudante ===
                      "Alterações Solicitadas") &&
                  projecto?.fkTurma?.deletedAt === null && (
                    <Button
                      id="completar-tarefa"
                      label="Completar"
                      icon="pi pi-check"
                      className="p-button-success p-mb-2"
                      onClick={() => this.handleCompletarTarefa(rowData)}
                    />
                  )}
                {isOrientadorDoProjecto &&
                  projecto?.estado === "Em andamento" &&
                  rowData.estadoTarefaEstudante === "Em Revisão" &&
                  projecto?.fkTurma?.deletedAt === null && (
                    <Button
                      label="Avaliar"
                      icon="pi pi-star"
                      className="p-button-warning"
                      onClick={() => this.handleAvaliarTarefa(rowData)}
                    />

                    //Implementar a função handleAvaliarTarefa
                  )}
              </div>
            )}
          />
        </DataTable>

        <Dialog
          visible={displayDialog}
          style={{ width: "50vw" }}
          header="Completar Tarefa"
          modal
          onHide={this.hideDialog}
        >
          {tarefaSelecionada && (
            <div>
              <h5>{tarefaSelecionada.designacaoTarefa}</h5>
              <p>{tarefaSelecionada.descricaoTarefa}</p>

              <FileUpload
                name="file"
                url="upload/save"
                multiple
                accept="*"
                customUpload
                uploadHandler={(event) => {
                  const formData = new FormData();
                  event.files.forEach((file) => {
                    formData.append("files", file);
                  });
                  formData.append(
                    "fk_projecto",
                    this.state.projecto.pkProjecto
                  );
                  formData.append(
                    "fk_tarefa",
                    tarefaSelecionada.pkTarefasAtribuidas
                  );

                  api
                    .post("upload/save", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    })
                    .then((response) => {
                      this.toast.current.show({
                        severity: "success",
                        summary: "Tarefa Completa",
                        detail: `A tarefa ${tarefaSelecionada.designacaoTarefa} foi completada com sucesso.`,
                        life: 3000,
                      });
                      console.log(response.data);
                      window.location.reload();
                    })
                    .catch((error) => {
                      this.toast.current.show({
                        severity: "error",
                        summary: "Erro",
                        detail: "Não foi possível completar a tarefa.",
                        life: 3000,
                      });
                      console.error("Erro ao fazer upload:", error);
                    });
                }}
                emptyTemplate={
                  <p
                    className="m-0 p-3 border-dashed border-2 border-round-xl text-center"
                    style={{
                      color: "#6B7280",
                      backgroundColor: "#F3F4F6",
                      borderColor: "#D1D5DB",
                      fontSize: "1rem",
                    }}
                  >
                    Arraste e solte os arquivos aqui para fazer upload
                  </p>
                }
                severity="info"
                outlined="true"
                onUpload={(e) => console.log("Upload concluído:", e)}
                onError={(e) => console.error("Erro no upload:", e)}
                chooseLabel="Seleccionar Ficheiro (s)"
                uploadLabel="Enviar"
                cancelLabel="Cancelar"
                style={{
                  border: "2px solid #D1D5DB",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                headerClassName="p-3 text-center"
                chooseOptions={{
                  className:
                    "p-button-primary p-button-rounded p-button-outlined",
                }}
                uploadOptions={{
                  className:
                    "p-button-success p-button-rounded p-button-outlined",
                }}
                cancelOptions={{
                  className:
                    "p-button-danger p-button-rounded p-button-outlined",
                }}
              />

              {tarefaSelecionada.uploadObrigatorioTarefa &&
                uploadedFiles.length === 0 && (
                  <small style={{ color: "red" }}>
                    É obrigatório fazer o upload de pelo menos um ficheiro.
                  </small>
                )}

              {!tarefaSelecionada.uploadObrigatorioTarefa && (
                <div className="p-d-flex p-jc-between p-mt-3">
                  <br />
                  <Button
                    outlined="true"
                    label="Marcar Tarefa Como Completa"
                    icon="pi pi-check"
                    className="p-button-success"
                    onClick={() => this.handleCompletarTarefaSemUpload()}
                  />
                </div>
              )}
            </div>
          )}
        </Dialog>

        <Dialog
          header="Avaliar Tarefa"
          visible={this.state.avaliarVisible}
          style={{ width: "50vw" }}
          onHide={this.hideAvaliarDialog}
          footer={
            <div className="flex items-center gap-4">
              <Button
                label="Enviar Avaliação"
                onClick={() => this.onSubmitAvaliacao(tarefaSelecionada)}
                autoFocus
                severity="info"
                raised
              />
            </div>
          }
        >
          <br />
          <div className="p-field">
            <InputTextarea
              id="comentarios"
              style={{ width: "47vw" }}
              value={this.state.comentarios}
              onChange={(e) =>
                this.setState({
                  comentarios: e.target.value,
                })
              }
              placeholder="Escreva seus comentários aqui..."
              required
            />
          </div>
          <br />
          <div className="p-field">
            <InputText
              id="pontuacao"
              name="pontuacao"
              value={this.state.pontuacao}
              style={{ width: "47vw" }}
              onChange={(e) =>
                this.setState({
                  pontuacao: e.target.value,
                })
              }
              type="number"
              mode="decimal"
              min={0}
              max={100}
              placeholder="Atribua uma nota (0 a 100)"
              //required
            />
          </div>
          <br />
          <div className="p-field">
            <label htmlFor="solicitarAlteracoes">Solicitando Alterações </label>
            <Checkbox
              id="solicitarAlteracoes"
              checked={this.state.solicitarAlteracoes}
              onChange={this.handleSolicitarAlteracoesChange}
              className="form-control"
            />
          </div>

          <p className="m-0 divider"></p>
        </Dialog>

        <Dialog
          visible={arquivoVisible}
          style={{ width: "70vw" }}
          onHide={this.hideFicheiroDialog}
        >
          {this.renderFileContent()}
        </Dialog>

        <br />
        <br />
        <ul className="list-none p-0 m-0">
          {!isEstudante && (
            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div className="text-500 w-6 md:w-2 font-medium">
                Nota das Avaliações
              </div>
              <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                {projecto?.notaAvaliacaoContinua} %
              </div>
            </li>
          )}

          <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Progresso</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              {projecto?.progresso} %
              <div
                className="surface-300 w-full mt-2"
                style={{ height: "7px", borderRadius: "4px" }}
              >
                <div
                  className="bg-indigo-500 h-full"
                  style={{
                    width: `${projecto?.progresso}%`,
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(ProjectoTarefas);
