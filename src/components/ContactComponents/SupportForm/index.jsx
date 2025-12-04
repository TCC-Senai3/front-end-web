import React, { useState } from "react"; 
import "./style.css";

export default function SupportForm() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); 

        // ✅ EMAIL ATUALIZADO AQUI
        const emailDestino = "senaiskillup@gmail.com"; 
        
        const subject = encodeURIComponent(`Suporte (Página Suporte): ${nome} - ${email}`);
        const body = encodeURIComponent(mensagem);
        const mailtoLink = `mailto:${emailDestino}?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        setNome("");
        setEmail("");
        setMensagem("");
    };

    return (
        <main className="support-main">
            <div className="support-content">
                <div className="support-form-wrapper">
                    <h2 className="support-title">Suporte</h2>
                    <p className="support-description">
                        Está tendo problemas com alguma coisa?<br />
                        Envie uma mensagem para nossa equipe de suporte!
                    </p>
                    <form className="support-form" onSubmit={handleSubmit}>
                        <label className="support-form-label" htmlFor="nome">Seu Nome</label>
                        <input 
                            className="support-form-input" 
                            type="text" 
                            id="nome" 
                            placeholder="Digite seu Nome" 
                            value={nome} 
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                        
                        <label className="support-form-label" htmlFor="email">Email</label>
                        <input 
                            className="support-form-input" 
                            type="email" 
                            id="email" 
                            placeholder="Digite seu Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        
                        <label className="support-form-label" htmlFor="mensagem">Mensagem</label>
                        <textarea 
                            className="support-form-textarea" 
                            id="mensagem" 
                            placeholder="Digite sua Mensagem"
                            value={mensagem} 
                            onChange={(e) => setMensagem(e.target.value)}
                            required
                        ></textarea>
                        
                        <button className="support-form-button" type="submit">Enviar</button>
                    </form>
                </div>
                <div className="support-contact-wrapper">
                    <h2 className="support-title">Contato</h2>
                    <p className="support-description">
                        Entre em contato direto conosco<br />
                        <a href="mailto:senaiskillup@gmail.com" style={{color: '#1cb0fc', textDecoration: 'underline', fontWeight: 500}}>
                            senaiskillup@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}