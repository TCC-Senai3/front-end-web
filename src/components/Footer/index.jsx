import React from "react";
import "./style.css";
import logoSenai from "../../assets/images/SENAI SKILL-UP.svg";
import discordIcon from "../../assets/images/discord 1.svg";
import githubIcon from "../../assets/images/github 1.svg";
import instagramIcon from "../../assets/images/instagram 1.svg";

export default function Footer() {
    return (
        <footer>
            <div className="footer-container" id="informacoes">
                <img className="footer-logo" src={logoSenai} alt="SENAI SKILL-UP" />

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
                       <a href="https://github.com/TCC-Senai3"><img src={githubIcon} alt="GitHub" /></a>
                        <a href="https://www.instagram.com/senaiskillup?igsh=dmlnMjdoMjNyYWMz&utm_source=qr"><img src={instagramIcon} alt="Instagram" /></a>
                    </div>
                </div>
            </div>
        </footer>

    );
}
