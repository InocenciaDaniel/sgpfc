import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div>
      <div className="block-content">
        <div
          className="surface-section px-4 py-8 md:px-6 lg:px-8"
          style={{ height: "100vh", width: "100vw" }}
        >
          <div className="flex flex-column lg:flex-row justify-content-center align-items-center gap-7">
            <div className="text-center lg:text-right">
              <div className="mt-6 mb-3 font-bold text-6xl text-900">
                Está perdido?
              </div>
              <p className="text-700 text-3xl mt-0 mb-6">
                Lamentamos, mas você não tem permissão para visualizar esta
                página.
              </p>
              <Link
                to="/dashboard"
                aria-label="Voltar à Página Inicial"
                className="p-button p-component p-button-outlined"
                style={{ textDecoration: "none" }}
              >
                <span className="p-button-label p-c">
                  Voltar à Página Inicial
                </span>
                <span
                  style={{ height: "213.767px", width: "213.767px" }}
                ></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
