import React from "react";
import { useNavigate } from "react-router-dom";
import imgIntro from "../../../assets/images/Group 11.png";
import "./style.css";

export default function Intro() {
    const navigate = useNavigate();
    
    return (
        <div className="intro" id="inicio">
            <img className="imgIntroMobile" src={imgIntro} alt="Imagem Mobile" />
            <img className="imgIntro" src={imgIntro} alt="Imagem Intro" />
            <div className="Skill">
                <h1 id="Senai">SENAI</h1>
                <h1 id="Up">SKILL-UP</h1>
            </div>
            <p>
                Desafie-se jogando o nosso jogo de perguntas <br /> exclusivo para os cursos do <samp>SENAI</samp>
            </p>
            <div
                className="botaoIntro"
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
            >
                Entrar
            </div>
        </div>
    );
}
