import React from "react";
import Header from "../../components/Header_padrao";
import "./style.css";
import mensagemImg from "../../assets/images/mensagem.svg";
import { useNavigate, useLocation } from "react-router-dom";

export default function Contato() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Header />
            <div className="contato-help-wrapper">
                <aside className="contato-help-sidebar">
                    <button 
                        className={`contato-help-sidebar-btn${location.pathname === "/contato" ? " active" : ""}`}
                        onClick={() => navigate("/contato")}
                    >
                        Contato
                    </button>
                    <button 
                        className={`contato-help-sidebar-btn${location.pathname === "/suporte" ? " active" : ""}`}
                        onClick={() => navigate("/suporte")}
                    >
                        Suporte
                    </button>
                </aside>
                <main className="contato-feedback">
                    <h2 className="contato-feedback-titulo">Contato</h2>
                    <p className="contato-descricao">
                        Algum problema, dúvida ou sugestão?<br />
                        Dê sua opinião sobre o nosso projeto!
                    </p>
                    <div className="contato-feedback-content">
                        <div className="contato-feedback-form-wrapper">
                            <form className="contato-feedback-form">
                                <label className="contato-feedback-form-label" htmlFor="nome">Seu Nome</label>
                                <input className="contato-feedback-form-input" type="text" id="nome" placeholder="Digite seu Nome" />

                                <label className="contato-feedback-form-label" htmlFor="email">Email</label>
                                <input className="contato-feedback-form-input" type="email" id="email" placeholder="Digite seu Email" />

                                <label className="contato-feedback-form-label" htmlFor="mensagem">Mensagem</label>
                                <textarea className="contato-feedback-form-textarea" id="mensagem" placeholder="Digite sua Mensagem"></textarea>

                                <button className="contato-feedback-form-button" type="submit">Enviar</button>
                            </form>
                        </div>
                        <div className="contato-feedback-img">
                            <img src={mensagemImg} alt="Mensagem" style={{ maxWidth: '320px', height: 'auto', display: 'block' }} />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
