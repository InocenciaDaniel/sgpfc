import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import api from "../axiosConfig";

class RegulamentoVisualizar extends Component {
  state = {
    usuarioLogado: null,
    data: null,
    loading: true,
    error: null,
    fileContent: null,
    mimeType: "",
    isCoordenador: false,
  };

  fetchData = async () => {
    try {
      const response = await api.get("regulamento/estado/em%20vigor", {
        withCredentials: true, // Inclui cookies na requisição, caso necessário
      });

      api
        .get(
          `upload/${response.data.ficheiro}`,
          {
            responseType: "blob",
          },
          {
            withCredentials: true, // Inclui cookies na requisição, caso necessário
          }
        )
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

      this.setState({
        data: response.data,
        loading: false,
      });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  async componentDidMount() {
    this.fetchData();

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
          height="700px"
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
  };

  render() {
    const { usuarioLogado, loading, error } = this.state;

    if (loading) {
      return <div>Carregando...</div>;
    }
    if (error) {
      return <div>Erro ao carregar os dados: {error.message}</div>;
    }

    return (
      <div>
        {usuarioLogado ? (
          <div className="p-7">
            <div className="surface-section px-4 py-3 md:px-6 lg:px-8">
              <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                <li>
                  <a
                    href="/regulamento-visualizar"
                    className="text-500 no-underline line-height-3 cursor-pointer"
                  >
                    Regulamento
                  </a>
                </li>
                <li className="px-2">
                  <i className="pi pi-angle-right text-500 line-height-3"></i>
                </li>
                <li>
                  <span className="text-900 line-height-3">
                    Visualizar Regulamento
                  </span>
                </li>
              </ul>
              <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                <div>
                  <div className="flex align-items-center text-700 flex-wrap">
                    <div className="mr-5 flex align-items-center"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-fluid" style={{ marginTop: "1px" }}>
              <div className="surface-section surface-card p-5 border-round flex-auto">
                {this.renderFileContent()}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(RegulamentoVisualizar);
