import React from "react";
import "./style.css";

export default function SupportForm() {
    return (
        <main className="support-main">
            <div className="support-content">
                <div className="support-form-wrapper">
                    <h2 className="support-title">Suporte</h2>
                    <p className="support-description">
                        Está tendo problemas com alguma coisa?<br />
                        Envie uma mensagem para nossa equipe de suporte!
                    </p>
                    <form className="support-form">
                        <label className="support-form-label" htmlFor="nome">Seu Nome</label>
                        <input className="support-form-input" type="text" id="nome" placeholder="Digite seu Nome" />
                        
                        <label className="support-form-label" htmlFor="email">Email</label>
                        <input className="support-form-input" type="email" id="email" placeholder="Digite seu Email" />
                        
                        <label className="support-form-label" htmlFor="mensagem">Mensagem</label>
                        <textarea className="support-form-textarea" id="mensagem" placeholder="Digite sua Mensagem"></textarea>
                        
                        <button className="support-form-button" type="submit">Enviar</button>
                    </form>
                </div>
                <div className="support-contact-wrapper">
                    <h2 className="support-title">Contato</h2>
                    <p className="support-description">
                        Entre em contato direto conosco<br />
                        <a href="mailto:SenaiSkillUp@gmail.com" style={{color: '#1cb0fc', textDecoration: 'underline', fontWeight: 500}}>
                            SenaiSkillUp@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
