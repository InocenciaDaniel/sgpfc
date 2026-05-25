import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Spinner from "../app/shared/Spinner";
import Navbar from "../app/shared/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./autenticacao/Unauthorized";
import NotFound from "./autenticacao/NotFound";

const Dashboard = lazy(() => import("./dashboard/index"));

const Login = lazy(() => import("./autenticacao/Login"));
const RecuperarSenha = lazy(() => import("./autenticacao/RecuperarSenha"));

const Semestre = lazy(() => import("./outras-tabelas/Semestre"));
const Curso = lazy(() => import("./outras-tabelas/Curso"));
const Disciplina = lazy(() => import("./outras-tabelas/Disciplina"));
const AnoLectivo = lazy(() => import("./outras-tabelas/AnoLectivo"));
const Universidade = lazy(() => import("./outras-tabelas/Universidade"));
const LocalRealizacao = lazy(() => import("./outras-tabelas/LocalRealizacao"));
const ConvenioCientifico = lazy(() =>
  import("./outras-tabelas/ConvenioCientifico")
);
const AreaConhecimento = lazy(() =>
  import("./outras-tabelas/AreaConhecimento")
);
const ActividadesAcademica = lazy(() =>
  import("./outras-tabelas/ActividadesAcademica")
);
const TabelasSistema = lazy(() => import("./outras-tabelas/TabelasSistema"));

const Relatorios = lazy(() => import("./relatorios/index"));

const UtilizadorIndex = lazy(() => import("./utilizador/index"));
const UtilizadorCadastrar = lazy(() => import("./utilizador/Cadastrar"));
const UtilizadorEditar = lazy(() => import("./utilizador/Editar"));
const UtilizadorVisualizar = lazy(() => import("./utilizador/Visualizar"));
const UtilizadorEstudanteFinalista = lazy(() =>
  import("./utilizador/EstudantesFinalistas")
);

const UtilizadorOrientadorIndex = lazy(() =>
  import("./utilizador/Orientador/index")
);
const UtilizadorOrientadoresRejeitadosVisualizar = lazy(() =>
  import("./utilizador/Orientador/VisualizarOrientadorRejeitado")
);
const UtilizadorOrientadoresRejeitadosEditar = lazy(() =>
  import("./utilizador/Orientador/EditarOrientadorRejeitado")
);
const UtilizadorAprovarOrientadorProposto = lazy(() =>
  import("./utilizador/Orientador/AprovarOrientadorProposto")
);

const OrientandosIndex = lazy(() => import("./utilizador/Orientandos"));

const TurmaIndex = lazy(() => import("./turma/index"));
const TurmaCadastrar = lazy(() => import("./turma/Cadastrar"));
const TurmaVisualizar = lazy(() => import("./turma/Visualizar"));

const TemaIndex = lazy(() => import("./tema/index"));
const TemaPropor = lazy(() => import("./tema/Propor"));
const TemaEditar = lazy(() => import("./tema/Editar"));
const TemaVisualizar = lazy(() => import("./tema/Visualizar"));

const ProjectoIndex = lazy(() => import("./projecto/index"));
const ProjectoVisualizar = lazy(() => import("./projecto/Visualizar"));

const PresencaIndex = lazy(() => import("./presenca/index"));
const PresencaMarcar = lazy(() => import("./presenca/Marcar"));
const PresencaVisualizar = lazy(() => import("./presenca/Visualizar"));
const ListaEstudantesPresenca = lazy(() =>
  import("./presenca/ListaEstudantesPresenca")
);

const TarefaIndex = lazy(() => import("./tarefa/index"));
const TarefaCadastrar = lazy(() => import("./tarefa/Cadastrar"));
const TarefaVisualizar = lazy(() => import("./tarefa/Visualizar"));
const TarefaListaEstudanteIndex = lazy(() =>
  import("./tarefa/ListaTarefasEstudanteIndex")
);

const TarefaAtribuidaVisualizar = lazy(() =>
  import("./TarefasAtribuida/Visualizar")
);
const TarefaAtribuidaEditar = lazy(() => import("./TarefasAtribuida/Editar"));

const TemplateVisualizar = lazy(() => import("./template/Visualizar"));
const TemplateEditar = lazy(() => import("./template/Editar"));

const RegulamentoIndex = lazy(() => import("./regulamento/index"));
const RegulamentoActualizar = lazy(() => import("./regulamento/Actualizar"));
const RegulamentoVisualizar = lazy(() => import("./regulamento/Visualizar"));

const AvaliacoesOrientadorIndex = lazy(() =>
  import("./Avaliacoes/Orientador/index")
);

const RepositorioIndex = lazy(() => import("./Repositorio/index"));

const MeuCurso = lazy(() => import("./utilizador/Estudante/MeuCurso"));

const Perfil = lazy(() => import("./utilizador/Perfil"));

class AppRoutes extends Component {
  render() {
    const location = window.location.pathname;
    const noNavbarRoutes = [
      "/login",
      "/recuperar-senha",
      "/unauthorized",
      "/not-found",
      "/repositorio-index",
    ];
    const showNavbar = !noNavbarRoutes.includes(location);

    return (
      <>
        {showNavbar && <Navbar />}
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/recuperar-senha" component={RecuperarSenha} />

            <ProtectedRoute
              path="/dashboard"
              component={Dashboard}
              allowedRoles={[
                "admin",
                "Orientador",
                "Estudante",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/regulamento-visualizar"
              component={RegulamentoVisualizar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Estudante",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/semestre"
              component={Semestre}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/Curso/:id"
              component={Curso}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/disciplina"
              component={Disciplina}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/ano-lectivo"
              component={AnoLectivo}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/universidade"
              component={Universidade}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/local-realizacao"
              component={LocalRealizacao}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/convenio-cientifico"
              component={ConvenioCientifico}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/area-conhecimento"
              component={AreaConhecimento}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/actividade-academica"
              component={ActividadesAcademica}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/tabelas-sistema"
              component={TabelasSistema}
              allowedRoles={["admin", "Funcionario DEI", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/relatorios-index"
              component={Relatorios}
              allowedRoles={["Orientador", "Funcionario DEI"]}
            />

            <ProtectedRoute
              path="/utilizador-index"
              component={UtilizadorIndex}
              allowedRoles={["admin"]}
            />

            <ProtectedRoute
              path="/utilizador-cadastrar"
              component={UtilizadorCadastrar}
              allowedRoles={["admin", "Conselho Científico"]}
            />

            <ProtectedRoute
              path="/utilizador-editar/:id"
              component={UtilizadorEditar}
              allowedRoles={["admin", "Conselho Científico"]}
            />

            {/*<Route path="/utilizador-editar/:id" component={UtilizadorEditar} />*/}

            <ProtectedRoute
              path="/utilizador-visualizar/:id"
              component={UtilizadorVisualizar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />
            <Route
              path="/utilizador-estudantes-finalistas"
              component={UtilizadorEstudanteFinalista}
            />
            <ProtectedRoute
              path="/utilizador-orientador-index"
              component={UtilizadorOrientadorIndex}
              allowedRoles={["Conselho Científico"]}
            />

            <ProtectedRoute
              path="/utilizador-orientadores-rejeitados-visualizar"
              component={UtilizadorOrientadoresRejeitadosVisualizar}
              allowedRoles={["Conselho Científico"]}
            />

            <ProtectedRoute
              path="/utilizador-orientadores-rejeitados-editar"
              component={UtilizadorOrientadoresRejeitadosEditar}
              allowedRoles={["Conselho Científico"]}
            />

            <ProtectedRoute
              path="/utilizador-aprovar-orientador-proposto/:id"
              component={UtilizadorAprovarOrientadorProposto}
              allowedRoles={["Conselho Científico"]}
            />

            <ProtectedRoute
              path="/orientandos-index"
              component={OrientandosIndex}
              allowedRoles={["Orientador"]}
            />

            <ProtectedRoute
              path="/turma-index"
              component={TurmaIndex}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/turma-cadastrar"
              component={TurmaCadastrar}
              allowedRoles={["admin"]}
            />

            <ProtectedRoute
              path="/turma-visualizar/:id"
              component={TurmaVisualizar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/tema-index"
              component={TemaIndex}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/tema-propor"
              component={TemaPropor}
              allowedRoles={["Orientador", "Estudante"]}
            />

            <ProtectedRoute
              path="/tema-visualizar/:id"
              component={TemaVisualizar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Estudante",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <Route path="/tema-editar/:id" component={TemaEditar} />

            <ProtectedRoute
              path="/tarefa-index"
              component={TarefaIndex}
              allowedRoles={[
                "admin",
                "Orientador",
                "Estudante",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/tarefa-cadastrar"
              component={TarefaCadastrar}
              allowedRoles={["Orientador", "Funcionario DEI"]}
            />

            <ProtectedRoute
              path="/tarefa-visualizar/:id"
              component={TarefaVisualizar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/tarefa-atribuida-visualizar/:id"
              component={TarefaAtribuidaVisualizar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/tarefa-atribuida-editar/:id"
              component={TarefaAtribuidaEditar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/tarefa-estudante-index"
              component={TarefaListaEstudanteIndex}
              allowedRoles={["Estudante"]}
            />

            <ProtectedRoute
              path="/template-visualizar/:id"
              component={TemplateVisualizar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/template-editar/:id"
              component={TemplateEditar}
              allowedRoles={["Orientador", "Funcionario DEI"]}
            />

            <ProtectedRoute
              path="/projecto-index"
              component={ProjectoIndex}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />
            <ProtectedRoute
              path="/projecto-visualizar/:id"
              component={ProjectoVisualizar}
              allowedRoles={[
                "admin",
                "Orientador",
                "Estudante",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/presenca-index"
              component={PresencaIndex}
              allowedRoles={["Orientador"]}
            />

            <ProtectedRoute
              path="/avaliacoes-orientador-index"
              component={AvaliacoesOrientadorIndex}
              allowedRoles={[
                "admin",
                "Orientador",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <ProtectedRoute
              path="/presenca-marcar/:id"
              component={PresencaMarcar}
              allowedRoles={["Orientador"]}
            />

            <ProtectedRoute
              path="/presenca-visualizar/:id"
              component={PresencaVisualizar}
              allowedRoles={["Orientador"]}
            />

            <Route
              path="/lista-estudantes-presenca/:id"
              component={ListaEstudantesPresenca}
            />

            <Route path="/regulamento-index" component={RegulamentoIndex} />
            <Route
              path="/regulamento-actualizar"
              component={RegulamentoActualizar}
            />

            <Route path="/repositorio-index" component={RepositorioIndex} />

            <Route path="/meu-curso/:id" component={MeuCurso} />

            <Route
              path="/perfil/:id"
              component={Perfil}
              allowedRoles={[
                "admin",
                "Orientador",
                "Estudante",
                "Funcionario DEI",
                "Conselho Científico",
              ]}
            />

            <Route path="/unauthorized" component={Unauthorized} />
            <Route component={NotFound} />
            <Redirect to="/login" />
          </Switch>
        </Suspense>
      </>
    );
  }
}

export default AppRoutes;
