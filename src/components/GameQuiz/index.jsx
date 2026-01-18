import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Correto from "../correto"; 
import Errado from "../errado";   
import Loader from "../../components/common/Loader";
import CountdownOverlay from "../../components/GameComponents/CountdownOverlay/CountdownOverlay";
import WaitingOverlay from "../../components/GameComponents/WaitingOverlay/WaitingOverlay"; 
import "./style.css";

import { enviarResposta } from "../../services/respostaService"; 
import { useAuth } from "../../hooks/useAuth"; 

export default function GameQuiz({ quizData, codigoSala, idSala }) {
  const navigate = useNavigate();
  
  // ✅ Destruturar a função de atualização do Contexto para corrigir o Header
  const { user, updateUserScore } = useAuth(); 

  // --- Estados do Componente ---
  const [timeLeft, setTimeLeft] = useState(20); 
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0); // Pontuação Total (vinda do Backend)
  const [acertos, setAcertos] = useState(0); // ✅ Contagem local de acertos (quantidade)
  const [showCountdown, setShowCountdown] = useState(true); 

  // --- Efeito: Inicializa o quiz ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (quizData && quizData.perguntas && quizData.perguntas.length > 0) {
      setQuiz(quizData);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(quizData.perguntas[0]);
      setScore(0);
      setAcertos(0); // Reinicia acertos
      const tempoSegundos = quizData.tempoLimite ? quizData.tempoLimite * 60 : 20; 
      setTimeLeft(tempoSegundos);
      setShowCountdown(true); 
      setLoading(false);
    } else {
      setError("Não foi possível carregar as perguntas.");
      setLoading(false);
    }
  }, [quizData, codigoSala, idSala]);

  // --- Efeito: Timer ---
  useEffect(() => {
    let timerId;
    
    if (!loading && !error && currentQuestion && timeLeft > 0 && !showResultScreen && !showCountdown) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            
            // Se o tempo acabou e NENHUMA resposta foi selecionada, marca como errado.
            if (selectedAnswer === null) {
              setIsCorrect(false);
            }
            setShowResultScreen(true); 
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timerId);
  }, [timeLeft, currentQuestion, loading, error, showResultScreen, showCountdown, selectedAnswer]); 

  // --- Efeito: Bloqueia scroll ---
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // --- Função: Clique na Alternativa ---
  const handleAnswerSelect = async (alternativa) => {
    // Bloqueia clique se já respondeu, ou se estiver na contagem/resultado
    if (selectedAnswer || showResultScreen || loading || error || !currentQuestion || !user || showCountdown) return;

    const idUsuario = user?.id;
    const idPergunta = currentQuestion?.idPergunta;
    const idAlternativaSelecionada = alternativa?.idAlternativa;
    const idSalaNumerico = idSala;

    // --- Lógica de Resposta ---
    setSelectedAnswer(idAlternativaSelecionada); 
    const acertou = alternativa.correta === true;
    setIsCorrect(acertou); 

    // ✅ Incrementa a contagem de acertos localmente (apenas para exibir no final)
    if (acertou) {
        setAcertos(prev => prev + 1);
    }

    const tempoLimitePergunta = currentQuestion.tempo || quiz.tempoLimite * 60 || 20; 
    const tempoGasto = tempoLimitePergunta - timeLeft;

    try {
      const respostaPayload = {
        idUsuario: idUsuario,
        idPergunta: idPergunta,
        idAlternativaSelecionada: idAlternativaSelecionada,
        tempoGasto: tempoGasto > 0 ? tempoGasto : 1,
        idSala: idSalaNumerico
      };
      
      // 1. Envia para a API e aguarda o cálculo do Back-end
      const apiResponse = await enviarResposta(respostaPayload);
      
      // 2. Atualiza Score Local e Global com o valor do Back-end
      // Se acertou E o Back-end retornou a pontuação total atualizada
      if (acertou && apiResponse && apiResponse.pontuacaoTotalAtualizada !== undefined) {
          const novoScore = apiResponse.pontuacaoTotalAtualizada;
          
          // A. Atualiza o estado local para a tela final (FimDeJogo)
          setScore(novoScore);

          // B. Atualiza o Contexto Global para corrigir o Header imediatamente
          if (typeof updateUserScore === 'function') {
              updateUserScore(novoScore);
          }
      }
      
    } catch (apiError) {
      console.error("Erro ao enviar resposta para API:", apiError);
    }
  };

  // --- Função: Próxima Pergunta / Fim ---
  const handleNext = useCallback(() => {
    setShowResultScreen(false);
    setSelectedAnswer(null); 
    const proximoIndex = currentQuestionIndex + 1;

    if (quiz && proximoIndex < quiz.perguntas.length) {
      setCurrentQuestionIndex(proximoIndex);
      setCurrentQuestion(quiz.perguntas[proximoIndex]);
      
      const tempoSegundos = quiz.perguntas[proximoIndex].tempo || quiz.tempoLimite * 60 || 20; 
      setTimeLeft(tempoSegundos);
      
      setShowCountdown(true); 
    } else {
      // ✅ Navegação para o Fim: Passa 'acertos' e 'score'
      navigate("/fim", { 
        state: {
          quizId: quiz?.idFormulario || quiz?.id,
          pontuacao: score, // Pontuação Total Acumulada (Pontos)
          acertos: acertos, // Quantidade de perguntas acertadas (ex: 4 de 10)
          totalPerguntas: quiz?.perguntas?.length || 0,
          codigoSala: codigoSala,
          idSala: idSala
        },
      });
    }
  }, [currentQuestionIndex, quiz, navigate, score, acertos, codigoSala, idSala]);

  // --- Efeito: Timer Tela Resultado ---
  useEffect(() => {
    if (showResultScreen) {
      const tempoDeEspera = 3000; 

      const timer = setTimeout(() => {
        handleNext();
      }, tempoDeEspera);

      return () => clearTimeout(timer);
    }
  }, [showResultScreen, handleNext]); 

  // --- Funções Modal Saída ---
  const handleExit = () => setShowExitModal(true);
  const closeExitModal = () => setShowExitModal(false);
  const confirmExit = async () => { navigate("/game"); };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // --- RENDERIZAÇÃO ---

  if (loading) {
    return (
      <div className="game-quiz-container"><div className="quiz-wrapper"><div className="quiz-paper-container"><Loader /></div></div></div>
    );
  }
  if (error) {
    return (
      <div className="game-quiz-container"><div className="quiz-wrapper"><div className="quiz-paper-container"><div className="empty-state"><div className="empty-title" style={{ color: "red" }}>{error}</div><button className="next-btn" onClick={() => navigate("/game")}>VOLTAR</button></div></div></div></div>
    );
  }
  if (!quiz || !currentQuestion) {
    return (
      <div className="game-quiz-container"><div className="quiz-wrapper"><div className="quiz-paper-container"><div className="empty-state"><div className="empty-title">Quiz não encontrado</div><button className="next-btn" onClick={() => navigate("/game")}>VOLTAR</button></div></div></div></div>
    );
  }

  if (showResultScreen) {
    return isCorrect ? <Correto /> : <Errado />;
  }

  return (
    <div className="game-quiz-container">
      
      {showCountdown && (
        <CountdownOverlay 
          segundos={3} 
          onComplete={() => setShowCountdown(false)}
        />
      )}

      <div className="quiz-wrapper">
        <div className="quiz-paper-container">

          {selectedAnswer && !showResultScreen && (
            <WaitingOverlay />
          )}

          <div className="quiz-header-info">
            <span className="question-theme">{quiz.titulo || "Quiz"}</span>
            <span className="question-counter">{currentQuestionIndex + 1} / {quiz.perguntas.length}</span>
          </div>
          
          <div className="question-text">{currentQuestion.textoPergunta || "..."}</div>
          
          <div className="alternatives-container">
            {currentQuestion.alternativas && currentQuestion.alternativas.length > 0 ? (
              currentQuestion.alternativas.map((alt) => (
                <button
                  key={alt.idAlternativa}
                  className={`alternative-btn ${selectedAnswer === alt.idAlternativa ? "selected" : ""}`}
                  onClick={() => handleAnswerSelect(alt)}
                  disabled={selectedAnswer !== null || showResultScreen || showCountdown}
                >
                  {alt.textoAlternativa || "-"}
                </button>
              ))
            ) : (
              <p>Nenhuma alternativa encontrada.</p>
            )}
          </div>
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
            <div className="modal-title">Deseja Mesmo<br />Sair Da Partida?</div>
            <button className="modal-exit-btn" onClick={confirmExit}>SAIR</button>
          </div>
        </div>
      )}
    </div>
  );
}