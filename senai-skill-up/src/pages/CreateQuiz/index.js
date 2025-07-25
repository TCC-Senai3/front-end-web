import React, { useState } from 'react';
import './style.css';
import Header_padrao from '../../components/Header_padrao';

import verifiedIcon from '../../assets/images/verified 1.png';
import cancelIcon from '../../assets/images/cancel 1.png';

function RespostaInput({ value, onChange, isCorrect, isFalse, onSelectCorrect, onSelectFalse }) {
  return (
    <div className="answer-item">
      <input
        className="answer-input"
        type="text"
        placeholder="INSERIR RESPOSTA"
        value={value}
        onChange={onChange}
      />
      <span className={`icon correct${isCorrect ? ' selected' : ''}`} onClick={onSelectCorrect}>
        <img src={verifiedIcon} alt="Correta" />
      </span>
      <span className={`icon wrong${isFalse ? ' selected' : ''}`} onClick={onSelectFalse}>
        <img src={cancelIcon} alt="Falsa" />
      </span>
    </div>
  );
}

function MiniCard({ selected, onClick, index }) {
  return (
    <div className={`question-thumb${selected ? ' selected' : ''}`} onClick={onClick}>
      Pergunta {index + 1}
    </div>
  );
}

export default function CreateQuiz() {
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perguntas, setPerguntas] = useState([
    {
      pergunta: '',
      respostas: [
        { texto: '', correta: false, falsa: false },
        { texto: '', correta: false, falsa: false },
        { texto: '', correta: false, falsa: false },
        { texto: '', correta: false, falsa: false },
      ],
    },
  ]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);

  const handlePerguntaChange = (value) => {
    const novas = [...perguntas];
    novas[perguntaAtual].pergunta = value;
    setPerguntas(novas);
  };

  const handleRespostaChange = (rIdx, value) => {
    const novas = [...perguntas];
    novas[perguntaAtual].respostas[rIdx].texto = value;
    setPerguntas(novas);
  };

  const handleSelectResposta = (rIdx, tipo) => {
    const novas = [...perguntas];
    novas[perguntaAtual].respostas = novas[perguntaAtual].respostas.map((r, idx) => {
      if (idx === rIdx) {
        return {
          ...r,
          correta: tipo === 'correta',
          falsa: tipo === 'falsa',
        };
      }
      return { ...r, correta: false, falsa: false };
    });
    setPerguntas(novas);
  };

  const handleAddPergunta = () => {
    setPerguntas([
      ...perguntas,
      {
        pergunta: '',
        respostas: [
          { texto: '', correta: false, falsa: false },
          { texto: '', correta: false, falsa: false },
          { texto: '', correta: false, falsa: false },
          { texto: '', correta: false, falsa: false },
        ],
      },
    ]);
    setPerguntaAtual(perguntas.length);
  };

  const handleSelectPergunta = (idx) => {
    setPerguntaAtual(idx);
  };

  const handleFinalizarQuiz = () => {
    const quiz = {
      titulo,
      materia,
      descricao,
      perguntas,
    };

    console.log('Quiz Finalizado:', quiz);
    alert('Questionário finalizado com sucesso!');
    // Aqui você pode enviar via API, salvar local ou redirecionar
  };

  return (
    <>
      <Header_padrao />
      <div className="quiz-container">
        <div className="sidebar-left">
          <input
            type="text"
            placeholder="TITULO..."
            className="quiz-title"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Matéria "
            className="quiz-materia"
            value={materia}
            onChange={e => setMateria(e.target.value)}
          />
          <textarea
            placeholder="INSERIR DESCRICAO"
            className="quiz-description"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
        </div>
        <div className="main-content">
          <div className="question-card" style={{ position: 'relative' }}>
            <input
              className="question-h2-input"
              type="text"
              value={perguntas[perguntaAtual].pergunta}
              onChange={e => handlePerguntaChange(e.target.value)}
              placeholder="INSERIR PERGUNTA"
              spellCheck={false}
              autoComplete="off"
            />
            <div className="answers-list">
              {perguntas[perguntaAtual].respostas.map((resposta, idx) => (
                <RespostaInput
                  key={idx}
                  value={resposta.texto}
                  onChange={e => handleRespostaChange(idx, e.target.value)}
                  isCorrect={resposta.correta}
                  isFalse={resposta.falsa}
                  onSelectCorrect={() => handleSelectResposta(idx, 'correta')}
                  onSelectFalse={() => handleSelectResposta(idx, 'falsa')}
                />
              ))}
              <button className="finalize-quiz-btn" onClick={handleFinalizarQuiz}>
                Finalizar Questionário
              </button>
            </div>
          </div>
        </div>
        <div className="sidebar-right">
          {perguntas.map((_, idx) => (
            <MiniCard
              key={idx}
              selected={perguntaAtual === idx}
              onClick={() => handleSelectPergunta(idx)}
              index={idx}
            />
          ))}
          <div className="add-question" onClick={handleAddPergunta}>+</div>
        </div>
      </div>
    </>
  );
}
