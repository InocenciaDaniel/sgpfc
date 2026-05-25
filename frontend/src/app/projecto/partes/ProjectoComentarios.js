import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import api from "../../axiosConfig";
import { InputTextarea } from "primereact/inputtextarea";

class ProjectoComentarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      projecto: null,
      comentarios: [],

      novoComentario: "",
      displayNovoComentario: false,
      expandedRows: true,

      respostasComentarios: {},
      responderComentario: null,
      respostaTexto: "",
    };

    this.toast = React.createRef();
  }

  async componentDidMount() {
    try {
      const { projecto, usuarioLogado } = this.props;

      this.setState({ projecto: projecto, usuarioLogado: usuarioLogado });

      const responseComentariosProjecto = await api.get(
        `comentarios/findAllByProjecto/${projecto?.pkProjecto}`
      );

      const expandedRows = {};
      responseComentariosProjecto.data.forEach((comentario) => {
        expandedRows[comentario.pkComentario] = true;
      });

      this.setState({
        comentarios: responseComentariosProjecto.data,
        expandedRows: expandedRows,
      });

      console.log(this.state.comentarios);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  deletarComentario = async (pkComentario) => {
    try {
      await api.delete(`comentarios/deleteById/${pkComentario}`);
      this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Comentário eliminado com sucesso!",
        life: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível eliminar o comentário.",
        life: 3000,
      });
    }
  };

  onSubmitComentario = async () => {
    const { novoComentario, projecto, usuarioLogado } = this.state;

    if (!novoComentario) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, escreve um comentário.",
        life: 3000,
      });
      return;
    }

    try {
      await api.post("comentarios/save", {
        conteudo: novoComentario,
        fkProjecto: projecto,
        fkAutor: usuarioLogado.fkUtilizador,
      });
      this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Comentário adicionado com sucesso!",
        life: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao enviar a avaliação.",
        life: 3000,
      });
    }
  };

  buscarRespostasComentario = async (pkComentario) => {
    try {
      const response = await api.get(`/comentarios/respostas/${pkComentario}`);
      this.setState((prevState) => ({
        respostasComentarios: {
          ...prevState.respostasComentarios,
          [pkComentario]: response.data,
        },
      }));
    } catch (error) {
      console.error("Erro ao buscar respostas do comentário:", error);
    }
  };

  rowExpansionTemplate = (comentario) => {
    const { usuarioLogado, projecto } = this.state;
    const isEstudante =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Estudante";
    const isOrientadorDoProjecto =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Orientador" &&
      this.state.projecto?.fkOrientador?.pkUtilizador ===
        usuarioLogado?.fkUtilizador?.pkUtilizador;

    return (
      <div className="p-3">
        {comentario.respostas && comentario.respostas.length > 0 && (
          <div>
            {comentario.respostas.map((resposta, index) => (
              <div className="col-12 p-1" key={index}>
                <div
                  className="py-3 border-bottom-1 surface-border flex flex-column md:flex-row align-items-center p-3 w-full border-round surface-card"
                  style={{ padding: "15px" }}
                >
                  <div className="flex-grow-1">
                    <strong>
                      {resposta?.conteudo.charAt(0).toUpperCase() +
                        resposta?.conteudo.slice(1).toLowerCase()}
                    </strong>
                  </div>
                  <div className="text-secondary mb-2">
                    <span className="mr-2">
                      <span style={{ fontSize: "0.85em", color: "#888" }}>
                        {resposta?.autorNome} - {resposta.dataCriacao}
                      </span>
                    </span>
                  </div>

                  {(isEstudante &&
                    usuarioLogado.fkUtilizador.pkUtilizador ===
                      projecto.fkEstudante.pkUtilizador) ||
                  (isOrientadorDoProjecto &&
                    usuarioLogado.fkUtilizador.pkUtilizador ===
                      projecto.fkOrientador.pkUtilizador)
                    ? index === comentario.respostas.length - 1 && (
                        <span>
                          <Button
                            label="Eliminar"
                            icon="pi pi-trash"
                            className="p-button-danger p-button-text p-button-sm"
                            onClick={() => this.deletarComentario(resposta.id)}
                          />
                        </span>
                      )
                    : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  render() {
    const { usuarioLogado, comentarios, projecto, expandedRows } = this.state;
    const isEstudante =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Estudante";
    const isOrientadorDoProjecto =
      usuarioLogado?.fkUtilizador?.fkTipoConta?.designacao === "Orientador" &&
      this.state.projecto?.fkOrientador?.pkUtilizador ===
        usuarioLogado?.fkUtilizador?.pkUtilizador;

    return (
      <div className="card">
        <Toast ref={this.toast} />

        <DataTable
          value={comentarios}
          expandedRows={expandedRows}
          onRowExpand={this.onRowExpand}
          rowExpansionTemplate={this.rowExpansionTemplate}
          dataKey="pkComentario"
          tableStyle={{ minWidth: "65rem" }}
        >
          <Column field="conteudo" header="Comentários" />

          <Column
            header=""
            body={(rowData) => (
              <div
                style={{
                  fontSize: "0.85em",
                  color: "#888",
                  textAlign: "right",
                }}
              >
                <div>
                  {rowData.autorNome} - {rowData.dataCriacao}
                </div>
                {(isEstudante || isOrientadorDoProjecto) && (
                  <div>
                    <Button
                      label="Responder"
                      icon="pi pi-reply"
                      className="p-button-text p-button-sm"
                      style={{ marginTop: "0.5rem" }}
                      onClick={() =>
                        this.setState({
                          responderComentario: rowData.id,
                          respostaTexto: "",
                        })
                      }
                    />

                    {(isEstudante &&
                      usuarioLogado?.fkUtilizador?.pkUtilizador ===
                        projecto?.fkEstudante?.pkUtilizador) ||
                      (isOrientadorDoProjecto &&
                        usuarioLogado.fkUtilizador.pkUtilizador ===
                          projecto.fkOrientador.pkUtilizador && (
                          <span>
                            {(!rowData.respostas ||
                              rowData.respostas.length === 0 ||
                              rowData.fkComentarioPai) && (
                              <Button
                                label="Eliminar"
                                icon="pi pi-trash"
                                className="p-button-danger p-button-text p-button-sm mt-2"
                                onClick={() =>
                                  this.deletarComentario(rowData.id)
                                }
                              />
                            )}
                          </span>
                        ))}

                    {this.state.responderComentario === rowData.id && (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          await api.post("comentarios/responder", {
                            conteudo: this.state.respostaTexto,
                            fkProjecto: this.state.projecto,
                            fkAutor: this.state.usuarioLogado?.fkUtilizador,
                            fkComentarioPai: rowData.id,
                          });
                          this.setState({
                            responderComentario: null,
                            respostaTexto: "",
                          });
                          window.location.reload();
                        }}
                      >
                        <InputTextarea
                          autoFocus
                          value={this.state.respostaTexto}
                          onChange={(e) =>
                            this.setState({ respostaTexto: e.target.value })
                          }
                          rows={2}
                          className="w-full mt-2"
                          placeholder="Escreva sua resposta..."
                          required
                        />
                        <Button
                          label="Enviar"
                          icon="pi pi-send"
                          className="p-button-sm p-button-success mt-2"
                          type="submit"
                        />
                        <Button
                          label="Cancelar"
                          className="p-button-text p-button-sm mt-2 ml-2"
                          type="button"
                          onClick={() =>
                            this.setState({
                              responderComentario: null,
                              respostaTexto: "",
                            })
                          }
                        />
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
            bodyStyle={{ textAlign: "right", verticalAlign: "top" }}
          />
        </DataTable>

        <br />
        <br />
        {this.state.projecto?.estado !== "Desistido" &&
        this.state.projecto?.estado !== "Reprovado" &&
        this.state.projecto?.estado !== "Concluido" ? (
          <div>
            {(isEstudante || isOrientadorDoProjecto) && (
              <form className="grid" onSubmit={this.onSubmitComentario}>
                <div class="field col-12 md:col-12">
                  <label htmlFor="novoComentario">
                    Escrever Novo Comentário
                  </label>
                  <InputTextarea
                    required
                    id="novoComentario"
                    type="text"
                    name="novoComentario"
                    value={this.state.novoComentario}
                    onChange={(e) =>
                      this.setState({ novoComentario: e.target.value })
                    }
                    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                  />
                </div>

                <Button
                  label="Adicionar Novo Comentário"
                  type="submit"
                  icon="pi pi-plus"
                  className="p-button-outlined"
                />
              </form>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(ProjectoComentarios);
