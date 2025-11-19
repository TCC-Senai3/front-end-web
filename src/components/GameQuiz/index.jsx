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
  const { user } = useAuth(); 

  // --- Estados do Componente ---
  const [timeLeft, setTimeLeft] = useState(20); 
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Agora controla o "Aguardando"
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
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
      const tempoSegundos = quizData.tempoLimite ? quizData.tempoLimite * 60 : 20; 
      setTimeLeft(tempoSegundos);
      setShowCountdown(true); // Ativa contagem para primeira pergunta
      setLoading(false);
    } else {
      setError("Não foi possível carregar as perguntas.");
      setLoading(false);
    }
  }, [quizData, codigoSala, idSala]);

  // --- Efeito: Timer ---
  useEffect(() => {
    let timerId;
    
    // O timer SÓ roda se a contagem 3,2,1 NÃO estiver na tela E o resultado não estiver sendo mostrado
    if (!loading && !error && currentQuestion && timeLeft > 0 && !showResultScreen && !showCountdown) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            
            // --- 3. MUDANÇA CRÍTICA ---
            // Se o tempo acabou e NENHUMA resposta foi selecionada, marca como errado.
            // Se uma resposta JÁ FOI selecionada, o 'isCorrect' já está salvo.
            if (selectedAnswer === null) {
              setIsCorrect(false);
            }
            // O Timer (ao chegar em 0) agora MOSTRA o resultado
            setShowResultScreen(true); 
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timerId);
  }, [timeLeft, currentQuestion, loading, error, showResultScreen, showCountdown, selectedAnswer]); // <--- selectedAnswer foi adicionado

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
    setSelectedAnswer(idAlternativaSelecionada); // <--- Trava a resposta
    const acertou = alternativa.correta === true;
    setIsCorrect(acertou); // Guarda o resultado para DEPOIS

    const tempoLimitePergunta = currentQuestion.tempo || quiz.tempoLimite * 60 || 20; 
    const tempoGasto = tempoLimitePergunta - timeLeft;

    if (acertou) {
      setScore((prevScore) => prevScore + 1);
    }

    try {
      const respostaPayload = {
        idUsuario: idUsuario,
        idPergunta: idPergunta,
        idAlternativaSelecionada: idAlternativaSelecionada,
        tempoGasto: tempoGasto > 0 ? tempoGasto : 1,
        idSala: idSalaNumerico
      };
      await enviarResposta(respostaPayload);
    } catch (apiError) {
      console.error("Erro ao enviar resposta para API:", apiError);
    }
  };

  // --- Função: Próxima Pergunta / Fim ---
  const handleNext = useCallback(() => {
    setShowResultScreen(false);
    setSelectedAnswer(null); // <--- Limpa a resposta travada
    const proximoIndex = currentQuestionIndex + 1;

    if (quiz && proximoIndex < quiz.perguntas.length) {
      setCurrentQuestionIndex(proximoIndex);
      setCurrentQuestion(quiz.perguntas[proximoIndex]);
      
      const tempoSegundos = quiz.perguntas[proximoIndex].tempo || quiz.tempoLimite * 60 || 20; 
      setTimeLeft(tempoSegundos);
      
      setShowCountdown(true); // Ativa o "3, 2, 1..."
    } else {
      navigate("/fim", { // Vai para a tela de Fim de Jogo
        state: {
          quizId: quiz?.idFormulario || quiz?.id,
          pontuacao: score,
          totalPerguntas: quiz?.perguntas?.length || 0,
          codigoSala: codigoSala,
          idSala: idSala
        },
      });
    }
  }, [currentQuestionIndex, quiz, navigate, score, codigoSala, idSala]);

  // --- Efeito: Timer Tela Resultado ---
  useEffect(() => {
    if (showResultScreen) {
      // <--- 4. MUDANÇA: O tempo de espera agora é FIXO (3 segundos)
      const tempoDeEspera = 3000; // 3 segundos

      const timer = setTimeout(() => {
        handleNext();
      }, tempoDeEspera);

      return () => clearTimeout(timer);
    }
  }, [showResultScreen, handleNext]); // timeLeft foi removido daqui

  // --- Funções Modal Saída (Sem mudança) ---
  const handleExit = () => setShowExitModal(true);
  const closeExitModal = () => setShowExitModal(false);
  const confirmExit = async () => { navigate("/game"); };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // --- RENDERIZAÇÃO ---

  // Loading / Erro / Quiz inválido
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

  // Tela Correto/Errado (Agora só aparece quando o timer chega a 0)
  if (showResultScreen) {
    return isCorrect ? <Correto /> : <Errado />;
  }

  // --- Renderização Principal ---
  return (
    <div className="game-quiz-container">
      
      {/* Contagem "3, 2, 1..." (antes da pergunta) */}
      {showCountdown && (
        <CountdownOverlay 
          segundos={3} 
          onComplete={() => setShowCountdown(false)}
        />
      )}

      <div className="quiz-wrapper">
        <div className="quiz-paper-container">

          {/* <--- 5. RENDERIZAÇÃO: Overlay de "Aguardando..." */}
          {/* Aparece se uma resposta foi selecionada E a tela de resultado NÃO está ativa */}
          {selectedAnswer && !showResultScreen && (
            <WaitingOverlay />
          )}

          {/* Header */}
          <div className="quiz-header-info">
            <span className="question-theme">{quiz.titulo || "Quiz"}</span>
            <span className="question-counter">{currentQuestionIndex + 1} / {quiz.perguntas.length}</span>
          </div>
          {/* Pergunta */}
          <div className="question-text">{currentQuestion.textoPergunta || "..."}</div>
          {/* Alternativas */}
          <div className="alternatives-container">
            {currentQuestion.alternativas && currentQuestion.alternativas.length > 0 ? (
              currentQuestion.alternativas.map((alt) => (
                <button
                  key={alt.idAlternativa}
                  className={`alternative-btn ${selectedAnswer === alt.idAlternativa ? "selected" : ""}`} // Mostra a selecionada
                  onClick={() => handleAnswerSelect(alt)}
                  disabled={selectedAnswer !== null || showResultScreen || showCountdown} // Desativa se já respondeu
                >
                  {alt.textoAlternativa || "-"}
                </button>
              ))
            ) : (
              <p>Nenhuma alternativa encontrada.</p>
            )}
          </div>
        </div>
        {/* Controles */}
        <div className="quiz-controls">
          <div className="timer">
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
          <button className="exit-btn" onClick={handleExit}>SAIR</button>
        </div>
      </div>
      {/* Modal Saída */}
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