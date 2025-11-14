import React from "react";
import "./WaitingOverlay.css";

// Este componente é simples, apenas mostra a mensagem.
export default function WaitingOverlay() {
  return (
    <div className="waiting-overlay">
      Resposta registrada<br/> Aguarde...
    </div>
  );
}