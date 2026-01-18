import React, { useState, useEffect } from 'react';
import './style.css';
import Header from '../../components/header';
import { createFormulario } from '../../services/formularioService';
import { createPergunta } from '../../services/perguntaService';
import { createAlternativa } from '../../services/alternativaService';

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

function MiniCard({ selected, onClick, index, pergunta }) {
  return (
    <div className={`question-thumb${selected ? ' selected' : ''}`} onClick={onClick}>
      <div className="mini-question-header">
        <span className="mini-question-number">Pergunta {index + 1}</span>
      </div>
      
      <div className="mini-question-content">
        <div className="mini-question-text">
          {pergunta.pergunta || "Pergunta sem texto"}
        </div>
        
        <div className="mini-answers">
          {pergunta.respostas.map((resposta, idx) => (
            <div 
              key={idx} 
              className={`mini-answer ${
                resposta.correta ? 'correct' : 
                resposta.falsa ? 'incorrect' : 
                'neutral'
              }`}
            >
              <span className="mini-answer-text">
                {resposta.texto || `Resposta ${idx + 1}`}
              </span>
              {resposta.correta && <span className="mini-answer-indicator correct">✓</span>}
              {resposta.falsa && <span className="mini-answer-indicator incorrect">✗</span>}
            </div>
          ))}
        </div>
      </div>
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
  const [loading, setLoading] = useState(false);

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

  const handleFinalizarQuiz = async () => {
    // Validações básicas
    if (!titulo.trim()) {
      alert('Por favor, insira um título para o questionário');
      return;
    }

    if (perguntas.length === 0 || !perguntas[0].pergunta.trim()) {
      alert('Por favor, adicione pelo menos uma pergunta');
      return;
    }

    // Verifica se todas as perguntas têm pelo menos uma resposta correta
    const perguntasInvalidas = perguntas.filter(p => {
      const temRespostaCorreta = p.respostas.some(r => r.correta);
      return !p.pergunta.trim() || !temRespostaCorreta;
    });

    if (perguntasInvalidas.length > 0) {
      alert('Todas as perguntas devem ter texto e pelo menos uma resposta marcada como correta');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Iniciando criação do questionário...');

      // 1. Criar o formulário
      console.log('1️⃣ Criando formulário:', titulo);
      const formulario = await createFormulario(titulo);
      const idFormulario = formulario.idFormulario;
      console.log('✅ Formulário criado com ID:', idFormulario);

      // 2. Para cada pergunta (sem tema por enquanto)
      for (let i = 0; i < perguntas.length; i++) {
        const perguntaData = perguntas[i];

        console.log(`2️⃣ Criando pergunta ${i + 1}:`, perguntaData.pergunta);

        // Criar a pergunta (sem tema por enquanto - usar idTema: 1 como padrão)
        const novaPergunta = await createPergunta({
          textoPergunta: perguntaData.pergunta,
          tema: { idTema: 1 }, // Tema padrão por enquanto
          idFormulario: idFormulario
        });

        const idPergunta = novaPergunta.idPergunta;
        console.log(`✅ Pergunta ${i + 1} criada com ID:`, idPergunta);

        // 3. Para cada alternativa da pergunta
        for (let j = 0; j < perguntaData.respostas.length; j++) {
          const resposta = perguntaData.respostas[j];

          if (resposta.texto.trim()) {
            console.log(`3️⃣ Criando alternativa ${j + 1}:`, resposta.texto);

            await createAlternativa({
              idPergunta: idPergunta,
              textoAlternativa: resposta.texto,
              correta: resposta.correta
            });

            console.log(`✅ Alternativa ${j + 1} criada`);
          }
        }
      }

      console.log('🎉 Questionário criado com sucesso!');
      alert(`Questionário "${titulo}" criado com sucesso!\n\n` +
            `Total de perguntas: ${perguntas.length}`);

      // Limpar formulário
      setTitulo('');
      setMateria('');
      setDescricao('');
      setPerguntas([{
        pergunta: '',
        respostas: [
          { texto: '', correta: false, falsa: false },
          { texto: '', correta: false, falsa: false },
          { texto: '', correta: false, falsa: false },
          { texto: '', correta: false, falsa: false },
        ],
      }]);
      setPerguntaAtual(0);

    } catch (error) {
      console.error('❌ Erro ao criar questionário:', error);

      let mensagemErro = 'Erro ao criar questionário. ';
      if (error.response?.data) {
        mensagemErro += typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data);
      } else {
        mensagemErro += error.message;
      }

      alert(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
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
              <button 
                className="finalize-quiz-btn" 
                onClick={handleFinalizarQuiz}
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? '⏳ Criando questionário...' : '✅ Finalizar Questionário'}
              </button>
            </div>
          </div>
        </div>
        <div className="sidebar-right">
          {perguntas.map((pergunta, idx) => (
            <MiniCard
              key={idx}
              selected={perguntaAtual === idx}
              onClick={() => handleSelectPergunta(idx)}
              index={idx}
              pergunta={pergunta}
            />
          ))}
          <div className="add-question" onClick={handleAddPergunta}>+</div>
        </div>
      </div>
    </>
  );
}
