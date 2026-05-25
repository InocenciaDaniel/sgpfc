import { test, expect } from "@playwright/test";

/*test("Login do usuário", async ({ page }) => {
  await page.locator("body").click();
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("alex@gmail.com");
  await page.getByRole("textbox", { name: "Senha" }).click();
  await page.getByRole("textbox", { name: "Senha" }).fill("al1234");
  await page.getByRole("textbox", { name: "Senha" }).press("Enter");
  await page.getByRole("button", { name: "Sign In" }).click();
});

test("Propor tema", async ({ page }) => {
  await page.locator("body").click();
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("jose@ucan.edu");
  await page.getByRole("textbox", { name: "Senha" }).click();
  await page.getByRole("textbox", { name: "Senha" }).fill("Kh1234");
  await page.getByRole("textbox", { name: "Senha" }).press("Enter");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "Propor Novo Tema" }).click();
  await page.getByRole("textbox", { name: "Titulo do Tema" }).click();
  await page.getByRole("textbox", { name: "Descrição Justificativa" }).click();
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .fill("npx playwright codegen");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ControlOrMeta+z");
  await page.getByRole("textbox", { name: "Descrição Justificativa" }).click();
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .fill(
      "Otimização do acesso a serviços de saúde e aprimoramento\nda experiência do usuário no contexto dos estabelecimentos de saúde. O projeto\nbusca enfrentar os desafios relacionados ao acesso da informação, oferecendo uma\nplataforma intuitiva e eficiente para a busca de clínicas e unidades de saúde, com base\nem suas especialidades médicas, oferecendo informações relativas ao atendimento e\nmédicos, além da localização. O sistema foi desenvolvido com o apoio de tecnologias\nmodernas, tais comoReact.js, Node.js e MongoDB, a aplicação prioriza a usabilidade\ne a praticidade, proporcionando uma interação amigável e acessível. Além disso, a\nplataforma visa contribuir para a organização e gestão eficaz das clínicas, promovendo\num ambiente mais eficiente e colaborativo. Ao abordar a interseção entre tecnologia e\nsaúde, o Health Clinic representa uma inovação significativa no setor, visando aprimorar\no acesso aos cuidados médicos e proporcionar uma experiência mais positiva e eficiente\npara os usuários."
    );
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .fill(
      "Otimização do acesso a serviços de saúde e aprimoramento\nda experiência do usuário no contexto dos estabelecimentos de saúde. O projeto busca enfrentar os desafios relacionados ao acesso da informação, oferecendo uma plataforma intuitiva e eficiente para a busca de clínicas e unidades de saúde, com base\nem suas especialidades médicas, oferecendo informações relativas ao atendimento e\nmédicos, além da localização. O sistema foi desenvolvido com o apoio de tecnologias\nmodernas, tais comoReact.js, Node.js e MongoDB, a aplicação prioriza a usabilidade\ne a praticidade, proporcionando uma interação amigável e acessível. Além disso, a\nplataforma visa contribuir para a organização e gestão eficaz das clínicas, promovendo\num ambiente mais eficiente e colaborativo. Ao abordar a interseção entre tecnologia e\nsaúde, o Health Clinic representa uma inovação significativa no setor, visando aprimorar\no acesso aos cuidados médicos e proporcionar uma experiência mais positiva e eficiente\npara os usuários."
    );
  await page.getByRole("textbox", { name: "Descrição Justificativa" }).click();
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ControlOrMeta+a");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ControlOrMeta+c");
  await page.getByRole("textbox", { name: "Justificativa do Tema" }).click();
  await page
    .getByRole("textbox", { name: "Justificativa do Tema" })
    .fill(
      "Otimização do acesso a serviços de saúde e aprimoramento\nda experiência do usuário no contexto dos estabelecimentos de saúde. O projeto busca enfrentar os desafios relacionados ao acesso da informação, oferecendo uma plataforma intuitiva e eficiente para a busca de clínicas e unidades de saúde, com base\nem suas especialidades médicas, oferecendo informações relativas ao atendimento e médicos, além da localização. O sistema foi desenvolvido com o apoio de tecnologias modernas, tais comoReact.js, Node.js e MongoDB, a aplicação prioriza a usabilidade e a praticidade, proporcionando uma interação amigável e acessível. Além disso, a plataforma visa contribuir para a organização e gestão eficaz das clínicas, promovendo um ambiente mais eficiente e colaborativo. Ao abordar a interseção entre tecnologia e saúde, o Health Clinic representa uma inovação significativa no setor, visando aprimorar o acesso aos cuidados médicos e proporcionar uma experiência mais positiva e eficiente para os usuários."
    );
  await page.getByRole("textbox", { name: "Diferencial do Tema" }).click();
  await page
    .getByRole("textbox", { name: "Diferencial do Tema" })
    .fill(
      "Otimização do acesso a serviços de saúde e aprimoramento\nda experiência do usuário no contexto dos estabelecimentos de saúde. O projeto busca enfrentar os desafios relacionados ao acesso da informação, oferecendo uma plataforma intuitiva e eficiente para a busca de clínicas e unidades de saúde, com base\nem suas especialidades médicas, oferecendo informações relativas ao atendimento e médicos, além da localização. O sistema foi desenvolvido com o apoio de tecnologias modernas, tais comoReact.js, Node.js e MongoDB, a aplicação prioriza a usabilidade e a praticidade, proporcionando uma interação amigável e acessível. Além disso, a plataforma visa contribuir para a organização e gestão eficaz das clínicas, promovendo um ambiente mais eficiente e colaborativo. Ao abordar a interseção entre tecnologia e saúde, o Health Clinic representa uma inovação significativa no setor, visando aprimorar o acesso aos cuidados médicos e proporcionar uma experiência mais positiva e eficiente para os usuários."
    );
  await page.locator("#areaConhecimento").click();
  await page.getByText("Desenvolvimento de Software").click();
  await page.locator("#localRealizacao").getByRole("button").click();
  await page
    .getByRole("option", { name: "DEI ( Ensino e Investigação )" })
    .click();
  await page.locator("#local_realizacao").getByRole("button").click();
  await page.locator("#local_realizacao").getByRole("button").click();
  await page.getByText("Desenvolvimento de Sistemas").click();
  await page.getByRole("button", { name: "Selecciona o Orientador" }).click();
  await page.getByRole("option", { name: "Irineu Souto" }).click();
  await page.getByRole("button", { name: "Selecciona o Orientador" }).click();
  await page.getByRole("option", { name: "Ivandro Sousa" }).click();
  await page.getByRole("textbox", { name: "Descrição Justificativa" }).click();
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .fill(
      "Otimização do acesso a serviços de saúde e aprimoramento\nda experiência do usuário no contexto dos estabelecimentos de saúde. O projeto busca enfrentar os desafios relacionados ao acesso da informação, oferecendo uma plataforma intuitiva e eficiente para a busca de clínicas e unidades de saúde, com base\nem suas especialidades médicas, oferecendo informações relativas ao atendimento e médicos, além da localização. O sistema foi desenvolvido com o apoio de tecnologias modernas, tais comoReact.js, Node.js e MongoDB, a aplicação prioriza a usabilidade e a praticidade, proporcionando uma interação amigável e acessível. Além disso, a plataforma visa contribuir para a organização e gestão eficaz das clínicas, promovendo um ambiente mais eficiente e colaborativo. Ao abordar a interseção entre tecnologia e saúde, o Health Clinic representa uma inovação significativa no setor, visando aprimorar o acesso aos cuidados médicos e proporcionar uma experiência mais positiva e eficiente para os usuários."
    );
  await page.getByRole("textbox", { name: "Descrição Justificativa" }).click();
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowLeft");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .press("ArrowRight");
  await page
    .getByRole("textbox", { name: "Descrição Justificativa" })
    .fill(
      "Otimização do acesso a serviços de saúde e aprimoramento\nda experiência do usuário no contexto dos estabelecimentos de saúde. O projeto busca enfrentar os desafios relacionados ao acesso da informação, oferecendo uma plataforma intuitiva e eficiente para a busca de clínicas e unidades de saúde, com base\nem suas especialidades médicas, oferecendo informações relativas ao atendimento e médicos, além da localização. O sistema foi desenvolvido com o apoio de tecnologias modernas, tais como React.js, Node.js e MongoDB, a aplicação prioriza a usabilidade e a praticidade, proporcionando uma interação amigável e acessível. Além disso, a plataforma visa contribuir para a organização e gestão eficaz das clínicas, promovendo um ambiente mais eficiente e colaborativo. Ao abordar a interseção entre tecnologia e saúde, o Health Clinic representa uma inovação significativa no setor, visando aprimorar o acesso aos cuidados médicos e proporcionar uma experiência mais positiva e eficiente para os usuários."
    );
  await page.getByRole("textbox", { name: "Titulo do Tema" }).click();
  await page
    .getByRole("textbox", { name: "Titulo do Tema" })
    .fill("Health Clinic");
  await page.getByRole("textbox", { name: "Titulo do Tema" }).click();
  await page.getByRole("button", { name: "Salvar Alterações" }).click();
});*/

/*test("Atribuir tarefas ao estudante", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("ivandro@gmail.com");
  await page.getByRole("textbox", { name: "Senha" }).click();
  await page.getByRole("textbox", { name: "Senha" }).fill("iv1234");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Health Clinic Orientador:" }).click();
  await page.getByRole("button", { name: "Atribuir Tarefas" }).click();
  await page.locator("span").filter({ hasText: "Selecione uma opção" }).click();
  await page.getByText("Selecionar Tarefa").click();
  await page.getByText("Selecione as tarefas").click();
  await page.getByText("Implementar os diagramas de").click();
  await page.mouse.click(0, 0);
  await page
    .getByRole("button", { name: "Atribuir Tarefa", exact: true })
    .click();
});*/

test("Completar uma tarefa", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("alex@gmail.com");
  await page.getByRole("textbox", { name: "Senha" }).click();
  await page.getByRole("textbox", { name: "Senha" }).fill("Al1234");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Health clinic Orientador:" }).click();
  await page.getByRole("tab", { name: "Tarefas e Avaliações" }).click();
  await page
    .getByRole("row", { name: "undefined 651 Implementar os" })
    .getByLabel("Completar")
    .click();
  await page.setInputFiles(
    'input[type="file"]',
    "/home/inocencia/Imagens/teste.png"
  );
  await page.getByLabel("Enviar").click();

  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("alex@gmail.com");
  await page.getByRole("textbox", { name: "Senha" }).click();
  await page.getByRole("textbox", { name: "Senha" }).fill("Al1234");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Health clinic Orientador:" }).click();
  await page.getByRole("tab", { name: "Tarefas e Avaliações" }).click();
  await page
    .getByRole("row", { name: "undefined 651 Implementar os" })
    .getByLabel("Completar")
    .click();
  await page.setInputFiles(
    'input[type="file"]',
    "/home/inocencia/Imagens/teste.png"
  );
  await page.getByLabel("Enviar").click();
});
/*
test("Avaliar Tarefa", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("ivandro@gmail.com");
  await page.getByRole("textbox", { name: "Senha" }).click();
  await page.getByRole("textbox", { name: "Senha" }).fill("iv1234");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Health Clinic Orientador:" }).click();
  await page.getByRole("tab", { name: "Tarefas e Avaliações" }).click();
  await page.getByRole("button", { name: "Avaliar" }).click();
  await page
    .getByRole("textbox", { name: "Escreva seus comentários aqui" })
    .click();
  await page
    .getByRole("textbox", { name: "Escreva seus comentários aqui" })
    .fill("Tarefa muito boa.");

  await page.waitForTimeout(1000); // Espera 1 segundo (temporário)
  await page
    .getByRole("spinbutton", { name: "Atribua uma nota (0 a 100)" })
    .click();

  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Enviar Avaliação" }).click();
});*/
