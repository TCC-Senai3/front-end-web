import React from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header_padrao';
import MeioFooter from "../../components/MeioFooter";
import Footer from '../../components/Footer';
import "./style.css";

import imgIntro from "../../assets/images/Group 11.png";

export default function Home() {
    const navigate = useNavigate();
    
    return (
        <>
        <div>

            <Header />
            <div className="intro" id="inicio">
            <img className="imgIntroMobile" src="" alt="Imagem Mobile" />
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
        <div className="background" id="informacoes">
            <div className="informations">
                <div className="pc">
                    <img src={require("../../assets/images/trophy 1.svg").default} alt="Troféu" />
                    <h3>Desafie-se</h3>
                    <p>
                        O Senai Skill Up é um jogo de perguntas e respostas que torna o aprendizado no SENAI mais dinâmico.
                        Os alunos testam conhecimentos, competem e interagem com professores de forma divertida!
                    </p>
                </div>
                <div className="check">
                    <img src={require("../../assets/images/game-controller 1.svg").default} alt="Controle de Jogo" />
                    <h3>Divirta-se</h3>
                    <p>
                        O jogo conta com dois modos de gameplay: normal, com perguntas livres ou salas de professores, e
                        multiplayer, com competição, ranking e cartas de ajuda.
                    </p>
                </div>
                <div className="time">
                    <img src={require("../../assets/images/question 1.svg").default} alt="Pergunta" />
                    <h3>Proposito</h3>
                    <p>
                        A proposta do nosso projeto é criar um jogo online interativo que visa transformar o processo de
                        aprendizagem em uma experiência mais divertida, dinâmica e envolvente
                    </p>
                </div>
                <div className="paste">
                    <img src={require("../../assets/images/people-group (1) 1.svg").default} alt="Grupo de Pessoas" />
                    <h3>Quem nós somos</h3>
                    <p>
                        Somos alunos de TI desenvolvendo este projeto para aplicar nossos conhecimentos e criar uma solução
                        inovadora que torne o aprendizado mais envolvente e divertido.
                    </p>
                </div>
            </div>
        </div>           
        <div className="productive" id="contato">
            <div className="text-container">
                <h1>PERGUNTAS?</h1>
                <p>Vamos conversar!</p>
                <div
                    className="contact-btn"
                    onClick={() => navigate("/SkillHelp")}
                    style={{ cursor: "pointer" }}
                >
                    Contato
                </div>
            </div>
     </div>
     </div>
                 
         <MeioFooter />
            <Footer />
        </>
    );
}
