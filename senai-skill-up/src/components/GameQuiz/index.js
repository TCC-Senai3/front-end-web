import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Correto from "../correto";
import Errado from "../errado";
import Loader from "../../components/common/Loader";
import "./style.css";

import { enviarResposta } from "../../services/respostaService";
import { useAuth } from "../../hooks/useAuth";

export default function GameQuiz({ quizData }) {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [timeLeft, setTimeLeft] = useState(90);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0); // Efeito para inicializar o quiz

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log("GameQuiz: Recebeu prop quizData:", quizData);

    if (quizData && quizData.perguntas && quizData.perguntas.length > 0) {
      setQuiz(quizData);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(quizData.perguntas[0]);
      setScore(0);
      const tempoSegundos = quizData.tempoLimite
        ? quizData.tempoLimite * 60
        : 90;
      setTimeLeft(tempoSegundos);
      setLoading(false);
    } else {
      console.error(
        "GameQuiz: Erro - Prop 'quizData' inválida ou sem perguntas."
      );
      setError("Não foi possível carregar as perguntas deste quiz.");
      setLoading(false);
    }
  }, [quizData]); // Timer

  useEffect(() => {
    let timer;
    if (
      !loading &&
      !error &&
      currentQuestion &&
      timeLeft > 0 &&
      !showResultScreen
    ) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsCorrect(false);
            setShowResultScreen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (
      timeLeft === 0 &&
      !showResultScreen &&
      !loading &&
      !error &&
      currentQuestion
    ) {
      setIsCorrect(false);
      setShowResultScreen(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion, loading, error, showResultScreen]); // Bloquear scroll

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []); // Seleção de resposta (COM tempoGasto FIXO em 1)

  const handleAnswerSelect = async (alternativa) => {
    if (showResultScreen || loading || error || !currentQuestion || !userData)
      return;

    // IDs dinâmicos
    const idUsuario = userData?.id;
    const idPergunta = currentQuestion?.idPergunta;
    const idAlternativaSelecionada = alternativa?.idAlternativa;

    // Validação
    if (!idUsuario || !idPergunta || !idAlternativaSelecionada) {
      console.error("Erro: IDs faltando para enviar resposta.", {
        idUsuario,
        idPergunta,
        idAlternativaSelecionada,
      });
      setError("Ocorreu um erro ao processar sua resposta. Tente novamente.");
      return;
    }

    // Lógica visual
    setSelectedAnswer(idAlternativaSelecionada);
    const acertou = alternativa.correta === true;
    setIsCorrect(acertou);
    if (acertou) {
      setScore((prev) => prev + 1);
    }
    setShowResultScreen(true);

    // CHAMADA À API COM VALORES FIXOS
    try {
      const respostaPayload = {
        idUsuario: idUsuario,
        idPergunta: idPergunta,
        idAlternativaSelecionada: idAlternativaSelecionada,
        tempoGasto: 1, // <<< VALOR FIXO AQUI
        idSala: null, // <<< CONTINUA null
      };
      console.log("Enviando resposta (tempoGasto fixo):", respostaPayload);
      await enviarResposta(respostaPayload);
      console.log("Resposta enviada com sucesso!");
    } catch (apiError) {
      console.error("Erro ao enviar resposta:", apiError);
    }
  };

  // Avançar ou finalizar
  const handleNext = useCallback(() => {
    setShowResultScreen(false);
    setSelectedAnswer(null);
    const proximoIndex = currentQuestionIndex + 1;
    if (quiz && proximoIndex < quiz.perguntas.length) {
      setCurrentQuestionIndex(proximoIndex);
      setCurrentQuestion(quiz.perguntas[proximoIndex]);
    } else {
      navigate("/fim", {
        state: {
          quizId: quiz?.id,
          pontuacao: score,
          totalPerguntas: quiz?.perguntas?.length || 0,
        },
      });
    }
  }, [currentQuestionIndex, quiz, navigate, score]); // Timer da tela de resultado

  useEffect(() => {
    if (showResultScreen) {
      const timer = setTimeout(() => {
        handleNext();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showResultScreen, handleNext]); // Funções do Modal de Saída

  const handleExit = () => setShowExitModal(true);
  const closeExitModal = () => setShowExitModal(false);
  const confirmExit = async () => {
    navigate("/game");
  }; // Formatar tempo

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }; // --- RENDERIZAÇÃO ---

  if (loading) {
    return (
      <div className="game-quiz-container">
        <div className="quiz-wrapper">
          <div className="quiz-paper-container">
            <Loader />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="game-quiz-container">
        <div className="quiz-wrapper">
          <div className="quiz-paper-container">
            <div className="empty-state">
              <div className="empty-title" style={{ color: "red" }}>
                {error}
              </div>
              <button className="next-btn" onClick={() => navigate("/game")}>
                VOLTAR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!quiz || !currentQuestion) {
    return (
      <div className="game-quiz-container">
        <div className="quiz-wrapper">
          <div className="quiz-paper-container">
            <div className="empty-state">
              <div className="empty-title">Quiz não encontrado</div>
              <button className="next-btn" onClick={() => navigate("/game")}>
                VOLTAR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (showResultScreen) {
    return isCorrect ? <Correto /> : <Errado />;
  }

  return (
    <div className="game-quiz-container">
           {" "}
      <div className="quiz-wrapper">
               {" "}
        <div className="quiz-paper-container">
          <div className="quiz-header-info">
            <span className="question-theme">{quiz.titulo || "Quiz"}</span>
            <span className="question-counter">
              {currentQuestionIndex + 1} / {quiz.perguntas.length}
            </span>
          </div>
                   {" "}
          <div className="question-text">
            {currentQuestion.textoPergunta || "Carregando..."}
          </div>
                   {" "}
          <div className="alternatives-container">
                       {" "}
            {currentQuestion.alternativas &&
            currentQuestion.alternativas.length > 0 ? (
              currentQuestion.alternativas.map((alt) => (
                <button
                  key={alt.idAlternativa || alt.id}
                  className={`alternative-btn ${
                    selectedAnswer === (alt.idAlternativa || alt.id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(alt)}
                  disabled={showResultScreen}
                >
                                    {alt.textoAlternativa || alt.texto || "-"} 
                               {" "}
                </button>
              ))
            ) : (
              <p>Nenhuma alternativa encontrada.</p>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="quiz-controls">
                   {" "}
          <div className="timer">
                       {" "}
            <span className="timer-text">{formatTime(timeLeft)}</span>         {" "}
          </div>
                   {" "}
          <button className="exit-btn" onClick={handleExit}>
            SAIR
          </button>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      {showExitModal && (
        <div className="modal-overlay">
                   {" "}
          <div className="modal-card">
                       {" "}
            <button className="modal-close" onClick={closeExitModal}>
              ×
            </button>
                       {" "}
            <div className="modal-title">
              Deseja Mesmo
              <br />
              Sair Da Partida?
            </div>
                       {" "}
            <button className="modal-exit-btn" onClick={confirmExit}>
              SAIR
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
}
