import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Correto from "../correto"; // Componente para tela de acerto
import Errado from "../errado";   // Componente para tela de erro
import Loader from "../../components/common/Loader";
import "./style.css";

import { enviarResposta } from "../../services/respostaService"; // Serviço para enviar resposta
import { useAuth } from "../../hooks/useAuth"; // Hook de autenticação

export default function GameQuiz({ quizData, codigoSala, idSala }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega o usuário logado

  // --- Estados do Componente ---
  const [timeLeft, setTimeLeft] = useState(10); // <<< MUDANÇA 1 (15 -> 10)
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);

  // --- Efeito: Inicializa o quiz ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log("GameQuiz: Props recebidas:", { quizData, codigoSala, idSala });

    if (quizData && quizData.perguntas && quizData.perguntas.length > 0) {
      setQuiz(quizData);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(quizData.perguntas[0]);
      setScore(0);
      // Prioriza o tempo do quizData, senão usa 10s
      const tempoSegundos = quizData.tempoLimite ? quizData.tempoLimite * 60 : 10; // <<< MUDANÇA 2 (15 -> 10)
      setTimeLeft(tempoSegundos);
      setLoading(false);
    } else {
      console.error("GameQuiz: Erro - Prop 'quizData' inválida.");
      setError("Não foi possível carregar as perguntas.");
      setLoading(false);
    }
  }, [quizData, codigoSala, idSala]);

  // --- Efeito: Timer ---
  useEffect(() => {
    let timerId;
    // O timer só roda se a tela de resultado NÃO estiver visível
    if (!loading && !error && currentQuestion && timeLeft > 0 && !showResultScreen) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            setIsCorrect(false);
            setShowResultScreen(true); // Mostra tela de "Errado" (tempo esgotou)
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    // Se o tempo acabar (timeLeft === 0) E a tela de resultado ainda não apareceu
    else if (timeLeft === 0 && !showResultScreen && !loading && !error && currentQuestion) {
      setIsCorrect(false);
      setShowResultScreen(true);
    }
    // Limpa o timer se o componente for desmontado ou a tela de resultado aparecer
    return () => clearInterval(timerId);
  }, [timeLeft, currentQuestion, loading, error, showResultScreen]);

  // --- Efeito: Bloqueia scroll ---
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  // --- Função: Clique na Alternativa ---
  const handleAnswerSelect = async (alternativa) => {
    if (showResultScreen || loading || error || !currentQuestion || !user) return;

    const idUsuario = user?.id;
    const idPergunta = currentQuestion?.idPergunta;
    const idAlternativaSelecionada = alternativa?.idAlternativa;
    const idSalaNumerico = idSala;

    if (!idUsuario || !idPergunta || !idAlternativaSelecionada || !idSalaNumerico) {
      console.error("Erro: IDs faltando para enviar resposta.", { idUsuario, idPergunta, idAlternativaSelecionada, idSalaNumerico });
      setError("Ocorreu um erro ao processar sua resposta (IDs faltando).");
      return;
    }

    // --- Lógica de Resposta ---
    setSelectedAnswer(idAlternativaSelecionada);
    const acertou = alternativa.correta === true;
    setIsCorrect(acertou);

    // Calcula o tempo gasto baseado no tempo limite (prioriza pergunta, quiz, ou 10s)
    const tempoLimitePergunta = currentQuestion.tempo || quiz.tempoLimite * 60 || 10; // <<< MUDANÇA 3 (15 -> 10)
    const tempoGasto = tempoLimitePergunta - timeLeft;

    if (acertou) {
      setScore((prevScore) => prevScore + 1);
    }

    // Mostra a tela de resultado IMEDIATAMENTE. O timer principal (acima) vai parar.
    setShowResultScreen(true);

    // --- Envia Resposta API ---
    try {
      const respostaPayload = {
        idUsuario: idUsuario,
        idPergunta: idPergunta,
        idAlternativaSelecionada: idAlternativaSelecionada,
        tempoGasto: tempoGasto > 0 ? tempoGasto : 1,
        idSala: idSalaNumerico
      };
      console.log("Enviando resposta para API:", respostaPayload);
      await enviarResposta(respostaPayload);
      console.log("Resposta enviada com sucesso!");
    } catch (apiError) {
      console.error("Erro ao enviar resposta para API:", apiError);
      setError("Não foi possível salvar sua resposta no servidor.");
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
      // Reseta o tempo para a próxima pergunta (prioriza pergunta, quiz, ou 10s)
      const tempoSegundos = quiz.perguntas[proximoIndex].tempo || quiz.tempoLimite * 60 || 10; // <<< MUDANÇA 4 (15 -> 10)
      setTimeLeft(tempoSegundos);
    } else {
      console.log("Fim do Quiz! Navegando para /fim");
      navigate("/fim", {
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

  // --- Efeito: Timer Tela Resultado (LÓGICA ATUALIZADA) ---
  useEffect(() => {
    // Só roda se a tela de resultado estiver visível
    if (showResultScreen) {
      // <<< MUDANÇA 5: LÓGICA DE ESPERA ATUALIZADA >>>
      
      // Se o usuário respondeu (timeLeft > 0), esperamos o tempo que sobrou.
      // Se o tempo esgotou (timeLeft === 0), esperamos 1 segundo (para mostrar "Errado!")
      const tempoDeEspera = timeLeft > 0 ? timeLeft * 1000 : 1000;

      const timer = setTimeout(() => {
        handleNext();
      }, tempoDeEspera); // Usa o tempo de espera calculado

      return () => clearTimeout(timer);
    }
  }, [showResultScreen, handleNext, timeLeft]); // Adicionado 'timeLeft' às dependências

  // --- Funções Modal Saída ---
  const handleExit = () => setShowExitModal(true);
  const closeExitModal = () => setShowExitModal(false);
  const confirmExit = async () => {
    // TODO: salaService.sairDaSala(codigoSala, user.id);
    navigate("/game");
  };

  // --- Função: Formata Tempo ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // --- RENDERIZAÇÃO ---
  
  // (Restante do código de renderização... sem alterações)

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

  // Tela Correto/Errado
  if (showResultScreen) {
    return isCorrect ? <Correto /> : <Errado />;
  }

  // --- Renderização Principal ---
  return (
    <div className="game-quiz-container">
      <div className="quiz-wrapper">
        <div className="quiz-paper-container">
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
                  className={`alternative-btn ${selectedAnswer === alt.idAlternativa ? "selected" : ""}`}
                  onClick={() => handleAnswerSelect(alt)}
                  disabled={selectedAnswer !== null || showResultScreen}
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