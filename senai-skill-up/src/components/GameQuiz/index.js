import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function GameQuiz() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0); // Timer parado como na imagem
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const currentQuestion = {
    id: 1,
    tema: 'FRONT END',
    pergunta: 'COMO O CSS É UTILIZADO PARA ESTILIZAR UMA PÁGINA WEB E QUAIS SÃO SUAS PRINCIPAIS PROPRIEDADES',
    alternativas: [
      { id: 'A', texto: 'ELE É USADO PARA CRIAR SCRIPTS E FUNÇÕES.', correta: false },
      { id: 'B', texto: 'ELE DEFINE A ESTRUTURA DA PÁGINA E SUAS INTERAÇÕES.', correta: false },
      { id: 'C', texto: 'ELE ALTERA A APARÊNCIA VISUAL DE UMA PÁGINA, COMO CORES, FONTES E LAYOUTS.', correta: true },
      { id: 'D', texto: 'ELE É RESPONSÁVEL PELA CRIAÇÃO DE BANCOS DE DADOS E SERVIDORES.', correta: false }
    ]
  };

  // Timer parado como na imagem (0:00)
  // useEffect removido para manter timer em 0:00

  // Bloquear scroll da página
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAnswerSelect = (alternativa) => {
    if (showResult) return;
    setSelectedAnswer(alternativa.id);
    setIsCorrect(alternativa.correta);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    // Exemplo: resultados mockados para exibição para todos os usuários
    const resultados = [
      { posicao: 1, nome: 'Campeão', ganho: 50 },
      { posicao: 2, nome: 'Usuário', ganho: 30 },
      { posicao: 3, nome: 'Usuário', ganho: 20 },
      { posicao: 4, nome: 'Usuário', ganho: 10 },
      { posicao: 5, nome: 'Usuário', ganho: 10 },
      { posicao: 6, nome: 'Usuário', ganho: 10 },
      { posicao: 7, nome: 'Usuário', ganho: 10 },
      { posicao: 8, nome: 'Usuário', ganho: 10 },
      { posicao: 9, nome: 'Usuário', ganho: 10 }
    ];

    navigate('/fim', { state: { resultados } });
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const closeExitModal = () => setShowExitModal(false);

  const confirmExit = () => {
    navigate('/game');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-quiz-container">
      <div className="quiz-paper-container">
        <div className="quiz-main">
          <div className="quiz-content">
            <div className="question-card">
              <div className="question-theme">{currentQuestion.tema}</div>
              <div className="question-text">{currentQuestion.pergunta}</div>

              <div className="alternatives-container">
                {currentQuestion.alternativas.map((alternativa) => (
                  <button
                    key={alternativa.id}
                    className={`alternative-btn ${
                      selectedAnswer === alternativa.id
                        ? (alternativa.correta ? 'correct' : 'incorrect')
                        : ''
                    } ${showResult && alternativa.correta ? 'show-correct' : ''}`}
                    onClick={() => handleAnswerSelect(alternativa)}
                    disabled={showResult}
                  >
                    {alternativa.texto}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className="result-section">
                  <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '✅ RESPOSTA CORRETA!' : '❌ RESPOSTA INCORRETA!'}
                  </div>
                  <button className="next-btn" onClick={handleNextQuestion}>
                    PRÓXIMA PERGUNTA
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Timer + Sair */}
          <div className="quiz-controls">
            <div className="timer">
              <span className="timer-text">{formatTime(timeLeft)}</span>
            </div>
            <button className="exit-btn" onClick={handleExit}>SAIR</button>
          </div>
        </div>
      </div>

      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={closeExitModal}>×</button>
            <div className="modal-title">Deseja Mesmo<br/>Sair Da Partida?</div>
            <button className="modal-exit-btn" onClick={confirmExit}>SAIR</button>
          </div>
        </div>
      )}
    </div>
  );
}
