import React, { useState } from "react"; 
import mensagemImg from "../../../assets/images/mensagem.svg";
import "./style.css";

export default function ContactForm() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); 

        // ✅ EMAIL ATUALIZADO AQUI
        const emailDestino = "osdrakedosenai@gmail.com"; 
        
        const subject = encodeURIComponent(`Contato (Página Contato): ${nome} - ${email}`);
        const body = encodeURIComponent(mensagem);
        const mailtoLink = `mailto:${emailDestino}?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;
        
        setNome("");
        setEmail("");
        setMensagem("");
    };

    return (
        <main className="contact-main">
            <h2 className="contact-title">Contato</h2>
            <p className="contact-description">
                Algum problema, dúvida ou sugestão?<br />
                Dê sua opinião sobre o nosso projeto!
            </p>
            <div className="contact-content">
                <div className="contact-form-wrapper">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <label className="contact-form-label" htmlFor="nome">Seu Nome</label>
                        <input 
                            className="contact-form-input" 
                            type="text" 
                            id="nome" 
                            placeholder="Digite seu Nome"
                            value={nome} 
                            onChange={(e) => setNome(e.target.value)}
                            required 
                        />

                        <label className="contact-form-label" htmlFor="email">Email</label>
                        <input 
                            className="contact-form-input" 
                            type="email" 
                            id="email" 
                            placeholder="Digite seu Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label className="contact-form-label" htmlFor="mensagem">Mensagem</label>
                        <textarea 
                            className="contact-form-textarea" 
                            id="mensagem" 
                            placeholder="Digite sua Mensagem"
                            value={mensagem} 
                            onChange={(e) => setMensagem(e.target.value)}
                            required
                        ></textarea>

                        <button className="contact-form-button" type="submit">Enviar</button>
                    </form>
                </div>
                <div className="contact-image">
                    <img src={mensagemImg} alt="Mensagem" style={{ maxWidth: '320px', height: 'auto', display: 'block' }} />
                </div>
            </div>
        </main>
    );
}