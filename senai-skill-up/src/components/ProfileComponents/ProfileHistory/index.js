import React, { useState } from "react";
import SearchIcon from "../../../assets/images/search 1.svg";
import { ModalQuestionario } from '../../';
import "./style.css";

export default function ProfileHistory() {
    const [modalResultadoOpen, setModalResultadoOpen] = useState(false);
    const [resultadoSelecionado, setResultadoSelecionado] = useState([]);
    const [modalInfo, setModalInfo] = useState({ titulo: '', materia: '', descricao: '', criador: { nome: 'Usuario123', avatar: 'https://ui-avatars.com/api/?name=Usuario123' } });

    const historicoData = [
        { nome: 'Quiz de Matemática', descricao: 'Resolva desafios matemáticos!', materia: 'Matemática', resultado: [
            { pergunta: '2 + 2?', respostaUsuario: '4', respostaCorreta: '4', acertou: true },
            { pergunta: '5 x 3?', respostaUsuario: '15', respostaCorreta: '15', acertou: true },
            { pergunta: 'Raiz de 9?', respostaUsuario: '6', respostaCorreta: '3', acertou: false },
        ] },
        { nome: 'História do Brasil', descricao: 'Teste seus conhecimentos históricos.', materia: 'História', resultado: [
            { pergunta: 'Ano da independência?', respostaUsuario: '1822', respostaCorreta: '1822', acertou: true },
            { pergunta: 'Primeiro presidente?', respostaUsuario: 'Deodoro', respostaCorreta: 'Deodoro', acertou: true },
        ] },
        { nome: 'Ciências Naturais', descricao: 'Perguntas sobre biologia e química.', materia: 'Ciências', resultado: [
            { pergunta: 'Qual é o principal órgão do corpo humano?', respostaUsuario: 'Coração', respostaCorreta: 'Coração', acertou: true },
            { pergunta: 'Quais são os principais gases que compõem o ar?', respostaUsuario: 'Oxigênio, Nitrogênio, Argônio', respostaCorreta: 'Oxigênio, Nitrogênio, Argônio', acertou: true },
        ] },
        { nome: 'Geografia Mundial', descricao: 'Descubra curiosidades sobre o mundo.', materia: 'Geografia', resultado: [
            { pergunta: 'Qual é o maior rio do mundo?', respostaUsuario: 'Amazonas', respostaCorreta: 'Amazonas', acertou: true },
            { pergunta: 'Qual é a maior floresta tropical do mundo?', respostaUsuario: 'Floresta Amazônica', respostaCorreta: 'Floresta Amazônica', acertou: true },
        ] },
        { nome: 'Quiz de Inglês', descricao: 'Vocabulário e gramática.', materia: 'Inglês', resultado: [
            { pergunta: 'What is the capital of France?', respostaUsuario: 'Paris', respostaCorreta: 'Paris', acertou: true },
            { pergunta: 'How do you say "hello" in Spanish?', respostaUsuario: 'Hola', respostaCorreta: 'Hola', acertou: true },
        ] },
    ];

    return (
        <>
        <div className="perfil-historico-ranking-container card-harmonico">
            <div className="perfil-historico-ranking-pesquisa-container">
                <input placeholder="Pesquisar..." className="perfil-historico-ranking-pesquisa-input" />
                <img src={SearchIcon} alt="Pesquisar" className="perfil-historico-ranking-pesquisa-icon" />
            </div>
            <div className="perfil-historico-ranking-lista">
                {historicoData.map((partida, idx) => (
                    <div key={idx} className="perfil-historico-ranking-card-item" onClick={() => {
                        setResultadoSelecionado(partida.resultado);
                        setModalInfo({
                            titulo: partida.nome,
                            materia: partida.materia,
                            descricao: partida.descricao,
                            criador: { nome: 'Usuario123', avatar: 'https://ui-avatars.com/api/?name=Usuario123' }
                        });
                        setModalResultadoOpen(true);
                    }} style={{ cursor: 'pointer' }}>
                        <div className="perfil-historico-ranking-card-avatar" style={{width: 60, height: 60, background: '#e3eefd', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            X
                        </div>
                        <div className="perfil-historico-ranking-card-info">
                            <div className="perfil-historico-ranking-card-nome">{partida.nome}</div>
                            <div className="perfil-historico-ranking-card-pontos">{partida.descricao}</div>
                            <div className="perfil-historico-ranking-card-materia">Matéria: {partida.materia}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <ModalQuestionario 
            open={modalResultadoOpen}
            onClose={() => setModalResultadoOpen(false)}
            resultados={resultadoSelecionado}
            titulo={modalInfo.titulo}
            materia={modalInfo.materia}
            descricao={modalInfo.descricao}
            criador={modalInfo.criador}
        />
        </>
    );
}
