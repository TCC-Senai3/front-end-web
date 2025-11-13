import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import GameQuiz from "../../components/GameQuiz";
import Loader from "../../components/common/Loader";
import formularioService from "../../services/formularioService";
import "./style.css";

// Estilos
const pageStyle = {
  minHeight: "calc(100vh - 60px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const errorStyle = {
  textAlign: "center",
  color: "red",
  border: "1px solid red",
  padding: "20px",
  borderRadius: "8px",
  backgroundColor: "#ffeeee",
};
const buttonStyle = {
  padding: "10px 20px",
  marginTop: "15px",
  cursor: "pointer",
};

export default function Jogo() {
  const location = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 

  const idFormulario = location.state?.idFormulario;
  const codigoSala = location.state?.codigoSala;
  const idSala = location.state?.idSala; 

  // useEffect para BUSCAR o quiz
  useEffect(() => {
    const carregarQuiz = async () => {
      setLoading(true);
      setError(null);
      
      console.log("Jogo.js: Tentando carregar. Dados recebidos do state:", {
        idFormulario,
        codigoSala,
        idSala,
      });

      if (!idFormulario) {
        console.error(
          "Jogo.js: Erro - ID do formulário não recebido via state."
        );
        setError("ID do Quiz não encontrado. Volte e inicie a sala novamente.");
        setLoading(false);
        return;
      }

      try {
        const quizData = await formularioService.getFormularioById(
          idFormulario
        );
        console.log("Jogo.js: Quiz recebido da API:", quizData);

        if (quizData && quizData.perguntas && quizData.perguntas.length > 0) {
          setQuiz(quizData);
        } else {
          console.error("Jogo.js: Erro - Quiz da API vazio ou inválido.");
          setError("O quiz selecionado não contém perguntas válidas.");
          setQuiz(null);
        }
      } catch (err) {
        console.error("Jogo.js: Erro ao buscar quiz da API:", err);
        const apiErrorMessage =
          err.response?.data?.message || err.response?.data || err.message;
        setError(
          `Erro ao carregar o quiz: ${apiErrorMessage || "Tente novamente."}`
        );
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    carregarQuiz();
    
    // ✅ CORREÇÃO: Adicionadas 'codigoSala' e 'idSala' ao array
    // O Vercel reclamou porque elas são usadas no 'console.log' dentro do hook.
  }, [idFormulario, codigoSala, idSala]); 

  // --- Renderização Condicional ---

  if (loading) {
    return (
      <>
        <Header /> 
        <div style={pageStyle}>
          <Loader />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header /> 
        <div style={pageStyle}>
          <div style={errorStyle}>
            <h2>Erro</h2> <p>{error}</p> 
            <button style={buttonStyle} onClick={() => navigate("/game")}>
              Voltar 
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!quiz) {
    return (
      <>
        <Header /> 
        <div style={pageStyle}>
          <p>Não foi possível carregar os dados do quiz.</p> 
          <button style={buttonStyle} onClick={() => navigate("/game")}>
            Voltar
          </button>
        </div>
      </>
    );
  } 

  // --- RENDERIZAÇÃO PRINCIPAL ---
  return (
    <>
      <Header /> 
      <GameQuiz quizData={quiz} codigoSala={codigoSala} idSala={idSala} /> 
    </>
  );
}