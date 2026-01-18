import React from "react";
import "./style.css";

export default function Footer() {
    return (
        <footer>
            <div className="footer-container" id="informacoes">
                <img className="footer-logo" src={require("../../assets/images/SENAI SKILL-UP.svg").default} alt="SENAI SKILL-UP" />

                <div className="footer-section">
                    <h2>Sobre</h2>
                    <ul>
                        <li>O que somos</li>
                        <li>Quem nós somos</li>
                        <li>Contato</li>
                        <li>Ajuda</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h2>Entre em Contato</h2>
                    <p>SenaiSkillUp@gmail.com</p>
                </div>

                <div className="footer-section">
                    <h2>Redes Sociais</h2>
                    <div className="social-icons">
                        <img src={require("../../assets/images/discord 1.svg").default} alt="Discord" />
                        <img src={require("../../assets/images/github 1.svg").default} alt="GitHub" />
                        <img src={require("../../assets/images/instagram 1.svg").default} alt="Instagram" />
                    </div>
                </div>
            </div>
        </footer>

    );
}
