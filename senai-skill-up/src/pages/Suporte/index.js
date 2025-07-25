import React from "react";
import "./style.css";
import Header from '../../components/Header_padrao';
import { useNavigate, useLocation } from "react-router-dom";

export default function Suporte() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Header />
            <div className="suporte-help-wrapper">
                <aside className="suporte-help-sidebar">
                    <button
                        className={`suporte-help-sidebar-btn${location.pathname === "/contato" ? " active" : ""}`}
                        onClick={() => navigate("/contato")}
                    >
                        Contato
                    </button>
                    <button
                        className={`suporte-help-sidebar-btn${location.pathname === "/suporte" ? " active" : ""}`}
                        onClick={() => navigate("/suporte")}
                    >
                        Suporte
                    </button>
                </aside>
                <main className="suporte-feedback">
                    <div className="suporte-feedback-content">
                        <div className="suporte-feedback-form-wrapper">
                            <h2 className="suporte-feedback-titulo">Suporte</h2>
                            <p className="suporte-descricao">Está tendo problemas com alguma coisa?<br />
                                Envie uma mensagem para nossa equipe de suporte!
                            </p>
                            <form className="suporte-feedback-form">
                                <label className="suporte-feedback-form-label" htmlFor="nome">Seu Nome</label>
                                <input className="suporte-feedback-form-input" type="text" id="nome" placeholder="Digite seu Nome" />
                                <label className="suporte-feedback-form-label" htmlFor="email">Email</label>
                                <input className="suporte-feedback-form-input" type="email" id="email" placeholder="Digite seu Email" />
                                <label className="suporte-feedback-form-label" htmlFor="mensagem">Mensagem</label>
                                <textarea className="suporte-feedback-form-textarea" id="mensagem" placeholder="Digite sua Mensagem"></textarea>
                                <button className="suporte-feedback-form-button" type="submit">Enviar</button>
                        </form>
                        </div>
                        <div className="suporte-feedback-contato-wrapper">
                            <h2 className="suporte-feedback-titulo">Contato</h2>
                            <p className="suporte-descricao">Entre em contato direto conosco<br />
                                <a href="mailto:SenaiSkillUp@gmail.com" style={{color: '#1cb0fc', textDecoration: 'underline', fontWeight: 500}}>SenaiSkillUp@gmail.com</a>
                        </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
