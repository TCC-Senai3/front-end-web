import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gameQuizService from '../../services/gameQuizService';
import './style.css';

export default function GameQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos para mock
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState(null);
  const [error, setError] = useState(null);
  

  // Carregar pergunta inicial
  useEffect(() => {
    const iniciarQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Pegar temaId da navegação (se vier de outra página)
        const temaId = location.state?.temaId;
        
        if (!temaId && !location.state?.quizId) {
          setError('Quiz não encontrado');
          setLoading(false);
          return;
        }
        
        if (temaId) {
          // Iniciar novo quiz
          const quizData = await gameQuizService.iniciarQuiz(temaId);
          setQuizId(quizData.id);
          setCurrentQuestion(quizData.perguntaAtual);
        } else if (location.state?.quizId) {
          // Continuar quiz existente
          const quizIdExistente = location.state.quizId;
          setQuizId(quizIdExistente);
          const pergunta = await gameQuizService.getPerguntaAtual(quizIdExistente);
          setCurrentQuestion(pergunta);
        }
      } catch (err) {
        console.error('Erro ao carregar quiz:', err);
        setError('Erro ao conectar com backend');
      } finally {
        setLoading(false);
      }
    };

    iniciarQuiz();
  }, [location.state]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAnswerSelect = async (alternativa) => {
    if (showResult || !quizId || !currentQuestion) return;
    
    setSelectedAnswer(alternativa.id);
    setIsCorrect(alternativa.correta);
    setShowResult(true);
  };

  const handleNextQuestion = async () => {
    try {
      if (!quizId || !currentQuestion || !selectedAnswer) return;
      // Submeter resposta e obter próxima pergunta
      const response = await gameQuizService.submeterResposta(
        quizId,
        currentQuestion.id,
        selectedAnswer
      );

      if (response.proximaPergunta) {
        // Resetar estado e carregar próxima pergunta
        setCurrentQuestion(response.proximaPergunta);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
      } else {
        // Quiz finalizado, ir para tela de resultados
        const resultados = await gameQuizService.finalizarQuiz(quizId);
        navigate('/fim', { state: resultados });
      }
    } catch (err) {
      console.error('Erro ao avançar pergunta:', err);
      setError('Erro ao carregar próxima pergunta');
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const closeExitModal = () => setShowExitModal(false);

  const confirmExit = async () => {
    if (quizId) {
      try {
        await gameQuizService.abandonarQuiz(quizId);
      } catch (err) {
        console.error('Erro ao abandonar quiz:', err);
      }
    }
    navigate('/game');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Renderizar estado de loading
  if (loading) {
    return (
      <div className="game-quiz-container">
        <div className="quiz-wrapper">
          <div className="quiz-paper-container">
            <div className="loading-message">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar estado de erro
  if (error) {
    return (
      <div className="game-quiz-container">
        <div className="quiz-wrapper">
          <div className="quiz-paper-container">
            <div className="empty-state">
              <div className="empty-title">{error}</div>
              <div className="empty-desc">Verifique o tema selecionado ou tente novamente mais tarde.</div>
              <div className="empty-actions">
                <button className="next-btn" onClick={() => navigate('/game')}>VOLTAR</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar estado vazio (sem dados)
  if (!currentQuestion) {
    return (
      <div className="game-quiz-container">
        <div className="quiz-wrapper">
          <div className="quiz-paper-container">
            <div className="empty-state">
              <div className="empty-title">Quiz não encontrado</div>
              <div className="empty-desc">Não conseguimos carregar as perguntas deste quiz.</div>
              <div className="empty-actions">
                <button className="next-btn" onClick={() => navigate('/game')}>VOLTAR</button>
              </div>
            </div>
          </div>
          <div className="quiz-controls">
            <div className="timer">
              <span className="timer-text">{formatTime(timeLeft)}</span>
            </div>
            <button className="exit-btn" onClick={handleExit}>SAIR</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-quiz-container">
      <div className="quiz-wrapper">
        <div className="quiz-paper-container">
          <div className="question-theme">{currentQuestion.tema || '-'}</div>
          <div className="question-text">{currentQuestion.pergunta || 'Nenhuma pergunta disponível'}</div>
          <div className="alternatives-container">
            {currentQuestion.alternativas && currentQuestion.alternativas.length > 0 ? (
              currentQuestion.alternativas.map((alternativa) => (
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
                  {alternativa.texto || '-'}
                </button>
              ))
            ) : (
              <>
                <button className="alternative-btn" disabled>-</button>
                <button className="alternative-btn" disabled>-</button>
                <button className="alternative-btn" disabled>-</button>
                <button className="alternative-btn" disabled>-</button>
              </>
            )}
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
        <div className="quiz-controls">
          <div className="timer">
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
          <button className="exit-btn" onClick={handleExit}>SAIR</button>
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