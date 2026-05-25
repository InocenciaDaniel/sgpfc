import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import api from "../../axiosConfig";
import AtribuirTarefas from "../../turma/AtribuirTarefas";
import jsPDF from "jspdf";
import { Toast } from "primereact/toast";
import "jspdf-autotable";

class ProjectoBotoesRodape extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogado: null,
      data: null,
      error: null,
      id: null,
      projecto: null,
      turmaEstudante: null,
      pkEstudante: "",
      tarefas: [],
      entregas: {},
      ficheiros: {},
      visible: false,
      numeroFaltas: null,
      arquivoVisible: false,
      fileContent: null,
      mimeType: "",
      avaliarVisible: false,
      comentarios: "",
      pontuacao: null,
      selectedFicheiro: null,
      presencas: [],
      podeDesistir: true,
      isCoordenador: false,
      solicitarAlteracoes: false,

      justificativa: "",
      relatorio: null,
      justificativaRelatorioFicheiro: null,
      justificativaProjecto: null,
      irregularidadeVerificada: null,

      //Reprovar O Projecto
      reprovarProjectoModalVisible: false,

      emitirDeclaracaoAptidao: false,

      //Desistir Do Projecto
      desistirModalVisible: false,

      //Irregularidade
      comunicarIrregularidadeModalVisible: false,
      irregularidade: "",

      displayAnexarDeclaracaoptidao: false,
      file: null,

      motivoOptions: [
        { label: "Plágio", value: "Plagio" },
        {
          label: "Irregularidades Verificadas",
          value: "Irregularidades Verificadas",
        },
        { label: "Faltas", value: "Faltas" },
        { label: "Outro", value: "Outro" },
      ],
      motivo: null,

      showUploadField: false,
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
        pkEstudante: projectoResponse.data.fkEstudante.pkUtilizador,
        tituloTema: projectoResponse.data.fkTema.titulo,
        projecto: projectoResponse.data,
      });

      if (
        projecto?.estado === "Desistido" ||
        projecto?.estado === "Reprovado"
      ) {
        const justificativaProjectoResponse = await api.get(
          `justificativaProjecto/findByPkProjecto/${this.state.projecto.pkProjecto}`
        );
        if (justificativaProjectoResponse.data) {
          this.setState({
            justificativaProjecto: justificativaProjectoResponse.data,
          });
        }
      }

      const irregularidadeProjectoResponse = await api.get(
        `irregularidadeProjecto/findByFkProjecto/${this.state.projecto.pkProjecto}`
      );
      if (irregularidadeProjectoResponse.data) {
        this.setState({
          irregularidadeVerificada: irregularidadeProjectoResponse.data,
        });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.setState({ usuarioLogado: JSON.parse(usuario) });
      try {
        const response = await api.get(
          `utilizador/isCoordenador/${
            JSON.parse(usuario).fkUtilizador.pkUtilizador
          }`
        );
        this.setState({ isCoordenador: response.data });
      } catch (error) {
        //console.error("Erro ao verificar se é coordenador:", error);
        return false;
      }
    }

    const diferencaDias = Math.floor(
      (new Date() -
        new Date(this.state.projecto?.fkTurma?.dataInicioSemestre)) /
        (1000 * 60 * 60 * 24)
    );

    if (
      this.state.projecto?.estado === "Desistido" ||
      this.state.projecto?.estado === "Reprovado"
    ) {
      this.setState({ podeDesistir: false });
    }
    if (diferencaDias > 31) {
      this.setState({ podeDesistir: false });
    }
  }

  handleEmitirDeclaracaoAptidao = async () => {
    const { projecto } = this.state;

    if (projecto.estado === "Em andamento") {
      try {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("UNIVERSIDADE CATÓLICA DE ANGOLA", 64, 20);
        doc.setFontSize(14);
        doc.text("FACULDADE DE ENGENHARIA", 76, 27);
        doc.setFontSize(14);
        doc.text("DECLARAÇÃO DE APTIDÃO", 80, 35);

        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 60);
        doc.text(
          `Eu, ${
            projecto.fkOrientador.nome || "[NOME DO ORIENTADOR]"
          }, professor(a) orientador(a), do curso de Engenharia da universidade ${
            projecto.fkOrientador.fkUniversidadeOrientador.designacao
          }; declaro para os devidos fins que o(a) estudante:`,
          20,
          80,
          { maxWidth: 170, align: "justify" }
        );

        doc.setFont("helvetica", "bold");
        doc.text(
          `${projecto.fkEstudante.nome || "[NOME DO ESTUDANTE]"}`,
          20,
          90
        );
        doc.setFont("helvetica", "normal");
        doc.text(
          `portador(a) do número de matrícula ${
            projecto.fkEstudante.numMatriculaEstudante ||
            "[NÚMERO DE MATRÍCULA]"
          }, está apto(a) a proceder à defesa pública do seu Projeto Final de Curso, intitulado:`,
          20,
          95,
          { maxWidth: 170, align: "justify" }
        );

        doc.setFont("helvetica", "bold");
        doc.text(
          `"${projecto.fkTema.titulo || "[TÍTULO DO PROJETO]"}.`,
          20,
          105
        );
        doc.setFont("helvetica", "normal");

        doc.text(
          "A presente declaração é emitida após análise do trabalho em questão, considerando que o mesmo cumpre os requisitos acadêmicos e técnicos exigidos pela instituição.",
          20,
          115,
          { maxWidth: 170, align: "justify" }
        );

        doc.text("_________________________", 20, 150);
        doc.text("Assinatura do(a) Orientador(a)", 20, 160);

        doc.text("_________________________", 120, 150);
        doc.text("Assinatura do(a) Coordenador(a)", 120, 160);

        doc.setFontSize(10);
        doc.text(
          "Declaração gerada automaticamente pelo sistema [SGPFC - UCAN]",
          14,
          doc.internal.pageSize.height - 10
        );
        const date = new Date().toLocaleDateString();
        const textWidth = doc.getTextWidth(date);
        doc.text(
          date,
          doc.internal.pageSize.width - textWidth - 14,
          doc.internal.pageSize.height - 10
        );

        const fileName = `Declaracao_Aptidao_${
          projecto.pk_projecto || "Projeto"
        }.pdf`;
        doc.save(fileName);

        await api.put("projecto/emitir/declaracao/aptidao", {
          pkProjecto: projecto.pkProjecto,
        });

        this.setState({ emitirDeclaracaoAptidao: false });

        window.location.reload();
      } catch (error) {
        console.error("Erro ao gerar o PDF: ", error);
        this.setState({
          error: "Ocorreu um erro ao emitir a declaração de aptidão.",
        });
      }
    } else {
      this.setState({
        error:
          "Este Projecto não apresenta os requisitos necessarios para emitir uma declaração de aptidão.",
      });
    }
  };

  renderModalContent = () => {
    return (
      <div>
        <form className="forms-sample" onSubmit={this.handleSubmitReprovar}>
          <div className="col-md-12">
            <br />
            <div className="p-field">
              <label htmlFor="motivo">Motivo</label>
              <Dropdown
                required
                id="motivo"
                value={this.state.motivo}
                options={this.state.motivoOptions}
                onChange={(e) => this.setState({ motivo: e.value })}
                placeholder="Selecione um motivo"
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              />
              <br />
            </div>
            <br />
            <div className="p-field">
              <label htmlFor="justificativa">Justificativa</label>
              <InputTextarea
                required
                id="justificativa"
                name="justificativa"
                placeholder="Escreve uma justificativa"
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={this.state.justificativa}
                onChange={(e) =>
                  this.setState({ justificativa: e.target.value })
                }
              />
            </div>
            <br />
            <div className="p-field">
              <FileUpload
                name=""
                accept=".pdf,.doc,.docx"
                onSelect={(e) => {
                  const file = e.files[0];
                  this.setState({ relatorio: file });
                }}
                chooseLabel="Fazer o upload do relatório de reprovação (.docx, .doc, .pdf)"
                mode="basic"
                className="p-d-block"
              />
            </div>
            <br />
          </div>
          <Button type="submit" label="Salvar" outlined className="mr-2" />
          <br />
        </form>
      </div>
    );
  };

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
              <InputTextarea
                required
                id="irregularidade"
                name="irregularidade"
                placeholder="Descreve as irregularidades existentes no processo de orientação
                desse projecto"
                style={{ width: "47vw" }}
                className="form-control"
                value={this.state.irregularidade}
                onChange={(e) =>
                  this.setState({ irregularidade: e.target.value })
                }
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
          <br />
        </form>
      </div>
    );
  };

  handleSubmitReprovar = async (e) => {
    e.preventDefault();
    const { justificativa, relatorio, projecto, motivo } = this.state;

    if (!relatorio) {
      this.toast.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, carregue o relatório de reprovação.",
        life: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("justificativa", justificativa);
      formData.append("relatorio", relatorio);
      formData.append("fkProjecto", projecto.pkProjecto);
      formData.append("motivo", motivo);
      formData.append(
        "fkDesistidoPor",
        this.state.usuarioLogado.fkUtilizador.pkUtilizador
      );
      if (this.state.reprovarProjectoModalVisible === true) {
        formData.append("estado", "Reprovado");
      } else {
        formData.append("estado", "Desistido");
      }

      await api.post("justificativaProjecto/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.setState({
        justificativa: "",
        relatorio: null,
        reprovarProjectoModalVisible: false,
        desistirModalVisible: false,
      });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar a justificativa do projecto", error);
    }
  };

  handleComunicarIrregularidadeSubmitAccao = async (e) => {
    e.preventDefault();
    const { irregularidade } = this.state;

    try {
      const formData = new FormData();
      formData.append("irregularidade", irregularidade);
      formData.append("estado", "comunicado");
      formData.append("fkProjecto", this.state.projecto.pkProjecto);

      await api.post("irregularidadeProjecto/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.setState({
        irregularidade: "",
        comunicarIrregularidadeModalVisible: false,
      });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao comunicar irregularidade", error);
    }
  };

  handleValidarRelatorioDesistencia = async (e) => {
    e.preventDefault();
    const { usuarioLogado, justificativaProjecto } = this.state;
    try {
      const formData = new FormData();
      formData.append("validadoPor", usuarioLogado.fkUtilizador.pkUtilizador);
      formData.append(
        "pkJustificativaProjecto",
        justificativaProjecto.pkJustificativaProjecto
      );

      await api.put("justificativaProjecto/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.setState({ justificativa: "", relatorio: null });
      this.hideDesistirModal();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar a justificativa do projecto", error);
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  //Model para mostrar o ficheiro
  showFicheiroDialog = (ficheiro) => {
    this.setState({
      arquivoVisible: true,
      selectedFicheiro: ficheiro.arquivoUrl,
    });
    this.fetchFile(ficheiro.arquivoUrl);
  };

  showRelatorioJustificativaDialog = (relatorio) => {
    this.setState({
      arquivoVisible: true,
      selectedFicheiro: relatorio,
    });
    this.fetchFile(relatorio);
  };

  hideFicheiroDialog = () => {
    this.setState({
      arquivoVisible: false,
      selectedFicheiro: null,
      fileContent: null,
      mimeType: "",
    });
    // this.setState({ arquivoVisible: false, fileContent: null, mimeType: '' });
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

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    this.setState({ file });
  };

  handleSubmitFile = async () => {
    const { file } = this.state;

    if (!file) {
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, selecione um arquivo para enviar.",
        life: 5000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fk_projecto", this.state.projecto.pkProjecto);

    try {
      await api.put("projecto/anexar/declaracao/aptidao", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Arquivo enviado com sucesso!",
        life: 5000,
      });
      this.setState({ displayAnexarDeclaracaoptidao: false });
      window.location.reload();
    } catch (error) {
      console.error("Erro:", error);
      this.toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Houve um erro ao tentar enviar o arquivo. Tente novamente.",
        life: 5000,
      });
      return;
    }
  };

  render() {
    const { usuarioLogado, isCoordenador, projecto, podeDesistir } = this.state;
    const isOrientador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Orientador";
    const isEstudante =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Estudante";
    const isAdministrador =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "admin";
    const isFuncionarioDei =
      usuarioLogado &&
      usuarioLogado.fkUtilizador.fkTipoConta.designacao === "Funcionario DEI";

    return (
      <div>
        <Toast ref={this.toast} />
        <div className="flex items-center gap-4">
          {projecto?.fkOrientador?.pkUtilizador ===
            usuarioLogado?.fkUtilizador?.pkUtilizador &&
          projecto?.estado === "Em andamento" ? (
            <div>
              <Button
                label="Atribuir Tarefas"
                className="botao-novo"
                onClick={() => this.setState({ atribuirTarefasVisible: true })}
                icon="pi pi-pencil"
                raised
              />
              <Dialog
                header="Atrbuir Tarefas"
                visible={this.state.atribuirTarefasVisible}
                style={{ width: "50vw" }}
                onHide={() => this.setState({ atribuirTarefasVisible: false })}
              >
                <AtribuirTarefas
                  id={this.state.projecto.fkEstudante.pkUtilizador}
                  tabela="estudante"
                  usuarioLogado={usuarioLogado.fkUtilizador.pkUtilizador}
                  projecto={this.state.projecto.pkProjecto}
                />
              </Dialog>
            </div>
          ) : null}
          {!isEstudante &&
          !isAdministrador &&
          !isFuncionarioDei &&
          projecto?.fkOrientador?.pkUtilizador ===
            usuarioLogado?.fkUtilizador?.pkUtilizador ? (
            <div>
              {projecto?.estado === "Em andamento" ? (
                <div>
                  <Link to="#" className="link">
                    <Button
                      onClick={() =>
                        this.setState({
                          reprovarProjectoModalVisible: true,
                        })
                      }
                      label="Reprovar Projecto"
                      icon="pi pi-times"
                      severity="danger"
                      raised
                    />
                  </Link>

                  <Dialog
                    header="Reprovar o projecto"
                    visible={this.state.reprovarProjectoModalVisible}
                    style={{ width: "50vw" }}
                    onHide={() =>
                      this.setState({
                        reprovarProjectoModalVisible: false,
                      })
                    }
                  >
                    {this.renderModalContent()}
                  </Dialog>
                </div>
              ) : null}
            </div>
          ) : null}
          {(isOrientador && !isCoordenador) ||
          projecto?.fkOrientador?.pkUtilizador ===
            usuarioLogado?.fkUtilizador?.pkUtilizador ? (
            <div>
              {projecto?.estado === "Em andamento" ? (
                <Button
                  onClick={() =>
                    this.setState({
                      comunicarIrregularidadeModalVisible: true,
                    })
                  }
                  type="submit"
                  label="Comunicar Irregularidade"
                  icon="pi pi-exclamation-triangle"
                  severity="warning"
                  raised
                />
              ) : null}
            </div>
          ) : null}

          {!isAdministrador && !isFuncionarioDei ? (
            <div>
              {projecto?.fkOrientador?.pkUtilizador ===
                usuarioLogado?.fkUtilizador?.pkUtilizador || isEstudante ? (
                podeDesistir ? (
                  <Button
                    onClick={() =>
                      this.setState({
                        desistirModalVisible: true,
                      })
                    }
                    type="submit"
                    label="Desistir do Projecto"
                    icon="pi pi-trash"
                    severity="secondary"
                    raised
                  />
                ) : null
              ) : null}
              <Dialog
                header="Desistir Do Projecto"
                visible={this.state.desistirModalVisible}
                style={{ width: "50vw" }}
                onHide={() => this.setState({ desistirModalVisible: false })}
              >
                {this.renderModalContent()}
              </Dialog>
            </div>
          ) : null}
          {projecto?.fkOrientador?.pkUtilizador ===
            usuarioLogado?.fkUtilizador?.pkUtilizador &&
          projecto?.estado === "Em andamento" &&
          projecto.progresso === 100 &&
          projecto.notaAvaliacaoContinua > 50 &&
          projecto?.relatorioFinalUrl !== null ? (
            <div>
              <Button
                onClick={() =>
                  this.setState({
                    emitirDeclaracaoAptidao: true,
                  })
                }
                type="submit"
                label="Emitir Declaração de Aptidão"
                icon="pi pi-check"
                severity="success"
                raised
              />
            </div>
          ) : isOrientador &&
            projecto?.fkOrientador?.pkUtilizador ===
              usuarioLogado?.fkUtilizador?.pkUtilizador &&
            projecto.estado === "Concluido" &&
            projecto.declaracaoAptidaoUrl === null ? (
            <div>
              <Button
                label="Anexar Declaração de Aptidão Assinada"
                onClick={() =>
                  this.setState({
                    displayAnexarDeclaracaoptidao: true,
                  })
                }
                severity="info"
                outlined
              />
              <Dialog
                visible={this.state.displayAnexarDeclaracaoptidao}
                style={{ width: "50vw" }}
                header="Anexar Declaração de Aptidão Assinada"
                modal
                onHide={() =>
                  this.setState({ displayAnexarDeclaracaoptidao: false })
                }
              >
                <div style={{ marginTop: "15px" }}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={this.handleFileUpload}
                  />
                  <br />
                  <br />
                  <Button
                    label="Enviar Documento"
                    onClick={this.handleSubmitFile}
                    severity="success"
                  />
                </div>
              </Dialog>
            </div>
          ) : isFuncionarioDei &&
            projecto.estado === "Concluido" &&
            projecto.declaracaoAptidaoUrl !== null &&
            projecto.dataDefesa === null ? (
            <div>
              <Button
                label="Adicionar Ficha da Defesa do Projecto"
                onClick={() =>
                  this.setState({
                    displayAnexarDeclaracaoptidao: true,
                  })
                }
                severity="info"
                outlined
              />
            </div>
          ) : null}

          <Dialog
            header="Comunicar Irregularidade no Projecto"
            visible={this.state.comunicarIrregularidadeModalVisible}
            style={{ width: "50vw" }}
            onHide={() =>
              this.setState({
                comunicarIrregularidadeModalVisible: false,
              })
            }
          >
            {this.renderComunicarIrregularidadeModalContent()}
          </Dialog>

          <Dialog
            header="Emitir Declaração de Aptidão"
            visible={this.state.emitirDeclaracaoAptidao}
            style={{ width: "30vw" }}
            onHide={() =>
              this.setState({
                emitirDeclaracaoAptidao: false,
              })
            }
          >
            <p style={{ textAlign: "justify" }}>
              Confirma que o trabalho tem o nível que justifique a sua defesa?
              <br />
              Foram atingidos os objectivos pretendidos, e se confirma que o
              estudante aprovou a todas as disciplinas do plano de estudos?
              <br />
              <div className="p-d-flex p-jc-between p-mt-3">
                <br />
                <Button
                  label="Emitir Declaração"
                  icon="pi pi-check"
                  className="p-button-success"
                  onClick={() => this.handleEmitirDeclaracaoAptidao()}
                />
              </div>
            </p>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default withRouter(ProjectoBotoesRodape);
