import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import api from "../axiosConfig";


class ProjectoVisualizar extends Component {
    state = {
        usuarioLogado: null,
        data: null,
        error: null,
        id: null,
        presenca: null,
        justificativaFalta: null,
        documentos: {},

        pkEstudante: '',
        tarefas: [],
        entregas: {},
        ficheiros: {},
        visible: false,
    };

    async componentDidMount() {
        try {
            const { id } = this.props.match.params;
            const presencaResponse = await api.get(`presenca/${id}`);
            this.setState({ 
                presenca: presencaResponse.data,
            });

            const justificativaFaltaResponse = await api.get(`justificativaFalta/findByFkPresenca/${this.state.presenca.pkPresenca}`);
            if (justificativaFaltaResponse.data) {
                this.setState({ justificativaFalta: justificativaFaltaResponse.data });
            }

            const documentoJustificativaResponse = await api.get(`documentoJustificativa/findByFkJustificativaFalta/${this.state.justificativaFalta.pkJustificativaFalta}`);
            if (documentoJustificativaResponse.data) {
                this.setState({ documentos: documentoJustificativaResponse.data });
            }
        } catch (error) {
          console.error('Error fetching data', error);
        }

        const usuario = localStorage.getItem('usuario');
        if (usuario) {
            this.setState({ usuarioLogado: JSON.parse(usuario) });
        }
    }

    showDialog = () => {
        this.setState({ visible: true });
    };

    hideDialog = () => {
        this.setState({ visible: false });
    };

    render() {
        const { usuarioLogado, documentos } = this.state;
        //const isOrientador = usuarioLogado && usuarioLogado.fkUtilizador.fkTipoConta.designacao === 'Orientador';
        //const isEstudante = usuarioLogado && usuarioLogado.fkUtilizador.fkTipoConta.designacao === 'Estudante';

        return (
            <div>
                <style>
                    {`
                        .p-tabview .p-tabview-nav,
                        .p-tabview .p-tabview-panels,
                        .p-panel-content {
                            background: none !important;
                        }
                        p {
                            text-align: justify;
                        }

                        .divider {
                            border-bottom: 1px solid #ccc;
                            padding-bottom: 10px;
                            margin-bottom: 10px;
                        }
                    `}
                </style>
                {usuarioLogado ? (
                    <div>
                        <div className="page-header">
                            <h3 className="page-title">Visualzar Presença</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/presenca-index" className='link'>Presença</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">Visualizar</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="row">
                          <div class="col-lg-12 grid-margin stretch-card">
                            <div class="card">
                              <div class="card-body">
                                <div class="table-responsive">
                                  <table class="table">
                                    <thead>
                                      <tr>
                                        <th>Nº Matricula</th>
                                        <th>Nome Estudante</th>
                                        <th>Data</th>
                                        <th>Estado</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>{this.state.presenca.fkEstudante.numMatriculaEstudante}</td>
                                        <td>{this.state.presenca.fkEstudante.nome}</td>
                                        <td>{this.state.presenca.data}</td>
                                        <td>
                                        {this.state.presenca.estado === "Presente" && (
                                          <label class="badge badge-success">Presente</label>
                                        )}
                                        {this.state.presenca.estado === "Ausente" && (
                                          <label class="badge badge-danger">Ausente</label>
                                        )}
                                        {this.state.presenca.estado === "Justificada" && (
                                          <label class="badge badge-warning">Justificada</label>
                                        )}
                                          </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          {this.state.presenca.estado === "Justificada" && (
                            <div class="col-lg-12 grid-margin stretch-card">
                              <div class="card">
                                <div class="card-body">
                                  <h4 className="card-title mb-1">Justificativa</h4><br/>
                                    <div>
                                      <p className="m-0"><b>Descrição: </b>{this.state.justificativaFalta.descricao}</p><br/>
                                      <h5>Arquivos:</h5>

                                      <ul>
                                      {documentos.map((documento, index) => (
                                        <li key={index}>
                                          {documento.arquivoUrl ? (
                                              <a href={`http://localhost:8088/api/upload/${documento.arquivoUrl}`} target="_blank" rel="noopener noreferrer">
                                                  {documento.arquivoUrl.split('/').pop()}
                                              </a>
                                          ) : (
                                              <span>Arquivo não disponível</span>
                                          )}
                                      </li>
                                      ))}

                                      </ul>
                                    </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                    </div>
                ) :null}
            </div>
        )
    }
}

export default withRouter(ProjectoVisualizar);
