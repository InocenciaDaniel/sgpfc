import React from "react";

const NotFoundPage = () => {
  return (
    <div
      className="surface-section px-4 py-8 md:px-6 lg:px-8"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div
        style={{
          background:
            "radial-gradient(50% 109137.91% at 50% 50%, rgba(233, 30, 99, 0.1) 0%, rgba(254, 244, 247, 0) 100%)",
        }}
        className="text-center"
      >
        <span className="bg-white text-pink-500 font-bold text-2xl inline-block px-3">
          404
        </span>
      </div>
      <div className="mt-6 mb-5 font-bold text-6xl text-900 text-center">
        Página não encontrada
      </div>
      <p className="text-700 text-3xl mt-0 mb-6 text-center">
        Lamentamos, não conseguimos encontrar a página.
      </p>
      <div className="text-center">
        <button
          aria-label="Voltar"
          className="p-button p-component p-button-text mr-2"
          onClick={() => window.history.back()}
        >
          <span className="p-button-icon p-c p-button-icon-left pi pi-arrow-left"></span>
          <span className="p-button-label p-c">Voltar</span>
        </button>
        <button
          aria-label="Go to Dashboard"
          className="p-button p-component"
          onClick={() => (window.location.href = "/dashboard")}
        >
          <span className="p-button-icon p-c p-button-icon-left pi pi-home"></span>
          <span className="p-button-label p-c">Voltar à Página Inicial</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
