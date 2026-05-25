import React from "react";
import { Button } from "primereact/button";

const AprovarReprovarBotoes = ({ onAprovar, onReprovar }) => {
  return (
    <div className="grid">
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold">
          <Button
            label="Aprovar"
            className="p-button mr-2"
            onClick={onAprovar}
          />
        </div>
      </div>
      <div className="col">
        <div className="text-center p-3 border-round-sm font-bold">
          <Button
            label="Reprovar"
            className="p-button-outlined mr-2"
            onClick={onReprovar}
          />
        </div>
      </div>
    </div>
  );
};

export default AprovarReprovarBotoes;
