import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function MeioFooter() {
    const navigate = useNavigate();

    const handleEnviarClick = () => {
        navigate('/game');
    };

    return (
        <div className="meio-footer">
            <h1 className="meio-footer-title">Receba Atualizações</h1>
            <p className="meio-footer-text">
                Insira seu email abaixo para receber atualizações
            </p>
            <div className="meio-footer-input-group">
                <input
                    type="email"
                    placeholder="Digite seu Email"
                    className="meio-footer-input"
                />
                <button 
                    className="meio-footer-button"
                    onClick={handleEnviarClick}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}
