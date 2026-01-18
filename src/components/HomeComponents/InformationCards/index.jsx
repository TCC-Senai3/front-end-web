import React from "react";
import "./style.css";

// Importando imagens
import trophyIcon from "../../../assets/images/trophy 1.svg";
import gameControllerIcon from "../../../assets/images/game-controller 1.svg";
import questionIcon from "../../../assets/images/question 1.svg";
import peopleGroupIcon from "../../../assets/images/people-group (1) 1.svg";

export default function InformationCards() {
    return (
        <div className="background" id="informacoes">
            <div className="informations">
                <div className="pc">
                    <img src={trophyIcon} alt="Troféu" />
                    <h3>Desafie-se</h3>
                    <p>
                        O Senai Skill Up é um jogo de perguntas e respostas que torna o aprendizado no SENAI mais dinâmico.
                        Os alunos testam conhecimentos, competem e interagem com professores de forma divertida!
                    </p>
                </div>
                <div className="check">
                    <img src={gameControllerIcon} alt="Controle de Jogo" />
                    <h3>Divirta-se</h3>
                    <p>
                        O jogo conta com dois modos de gameplay: normal, com perguntas livres ou salas de professores, e
                        multiplayer, com competição, ranking e cartas de ajuda.
                    </p>
                </div>
                <div className="time">
                    <img src={questionIcon} alt="Pergunta" />
                    <h3>Proposito</h3>
                    <p>
                        A proposta do nosso projeto é criar um jogo online interativo que visa transformar o processo de
                        aprendizagem em uma experiência mais divertida, dinâmica e envolvente
                    </p>
                </div>
                <div className="paste">
                    <img src={peopleGroupIcon} alt="Grupo de Pessoas" />
                    <h3>Quem nós somos</h3>
                    <p>
                        Somos alunos de TI desenvolvendo este projeto para aplicar nossos conhecimentos e criar uma solução
                        inovadora que torne o aprendizado mais envolvente e divertido.
                    </p>
                </div>
            </div>
        </div>
    );
}
