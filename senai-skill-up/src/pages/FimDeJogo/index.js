// pages/FimDeJogo/index.js

import React, { useEffect, useState, useCallback } from "react"; // ✅ 1. IMPORTAR useCallback
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { useAuth } from "../../hooks/useAuth"; 
import Loader from "../../components/common/Loader"; 
import image6 from "../../assets/images/image 6.svg"; // Troféu Prata
import image7 from "../../assets/images/image 7.svg"; // Troféu Ouro
import image8 from "../../assets/images/image 8.svg"; // Troféu Bronze
import "./style.css";

// Estilos (placeholders)
const pageStyle = {
  minHeight: "calc(100vh - 60px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
};
const errorStyle = { color: "red", marginTop: "10px" };

export default function FimDeJogo() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { user, refreshUserData, loading: authLoading } = useAuth(); 

  const pontuacaoQuiz = location.state?.pontuacao || 0;
  const totalPerguntas = location.state?.totalPerguntas || 0; 
  const podiumData = location.state?.podium || [];
  const ranking = location.state?.ranking || []; 

  const [refreshingScore, setRefreshingScore] = useState(true); 
  const [refreshError, setRefreshError] = useState(null); 

  // ✅ 2. ESTABILIZAR a função refreshUserData com useCallback
  // Isso é necessário para o useEffect não entrar em loop
  const stableRefreshUserData = useCallback(refreshUserData, [refreshUserData]); // Corrigido para incluir a dependência

  // --- useEffect CORRIGIDO para o Vercel ---
  useEffect(() => {
    let mounted = true; 

    // A lógica agora checa 'user' (objeto) e 'refreshingScore'
    if (!authLoading && user && refreshingScore) { 
      console.log(
        "FimDeJogo: Auth carregado e user existe. Buscando dados atualizados..."
      );
      setRefreshError(null); 

      stableRefreshUserData() // Usa a função estável
        .then(() => {
          if (mounted) console.log("FimDeJogo: Dados do usuário atualizados."); 
        })
        .catch((err) => {
          if (mounted) {
            console.error("FimDeJogo: Erro ao rebuscar dados:", err);
            setRefreshError(
              "Não foi possível carregar sua pontuação atualizada."
            );
          }
        })
        .finally(() => {
          if (mounted) setRefreshingScore(false);
        });
    } else if (!authLoading && !user) {
      console.warn(
        "FimDeJogo: Auth carregado, mas usuário não encontrado. Não buscando score."
      );
      if (mounted) setRefreshingScore(false);
    } else if (authLoading && !refreshingScore) {
      // Se o auth está carregando, garantir que o nosso loading esteja ativo
      setRefreshingScore(true);
    }

    return () => {
      mounted = false;
    };

    // ✅ 3. ADICIONAR 'user' e 'refreshingScore' às dependências
  }, [authLoading, user, refreshingScore, stableRefreshUserData]); 
  // (stableRefreshUserData também é uma dependência)


  const getTrophy = (pos) => {
    const trophies = { 1: image7, 2: image6, 3: image8 };
    return trophies[pos] || image8;
  }; 

  // --- Renderização --- 
  if (authLoading || refreshingScore) {
    return (
      <>
        <Header /> 
        <div style={pageStyle}>
          <Loader /> 
        </div>
      </>
    );
  }

  return (
    <>
      <Header /> 
      <div className="fim-container" style={pageStyle}>
        <h1 className="fim-title">FIM DE JOGO</h1> 
        <div className="resultado-quiz">
          <p>
            Você acertou 
            <span className="score-highlight">{pontuacaoQuiz}</span> de 
            <span className="score-highlight">{totalPerguntas}</span> 
            perguntas. 
          </p>
        </div>
        
        <div className="pontuacao-total">
          <h2>
            Sua Pontuação Total: 
            <span className="score-highlight">{user?.pontuacao ?? "..."}</span> 
          </h2>
        </div>
        
        {refreshError && (
          <p className="error-message" style={errorStyle}>
            {refreshError} 
          </p>
        )}
        
        {podiumData.length > 0 && (
          <div className="podium">
            <h2>Pódio da Partida</h2> 
            {podiumData.slice(0, 3).map((p, idx) => (
              <div key={idx} className={`podium-col pos-${p.pos}`}>
                <img
                  src={getTrophy(p.pos)}
                  alt={`Troféu ${p.pos}`}
                  className="trophy"
                />
                <div className="user-card">
                  <div
                    className="avatar"
                    style={
                      p.avatar ? { backgroundImage: `url(${p.avatar})` } : {}
                    }
                  />
                  <div className="user-name">{p.nome || "Jogador"}</div> 
                </div>
                <div className="points">{p.pontos ?? 0} Pontos</div> 
              </div>
            ))}
          </div>
        )}
        
        <div className="fim-actions">
          <button className="btn-proximo" onClick={() => navigate("/game")}>
            VOLTAR AO MENU 
          </button>
        </div>
        
        {ranking.length > 0 && (
          <div className="lista-final">
            <h2>Ranking da Partida</h2> 
            {ranking.map((u, i) => (
              <div key={i} className="linha-user">
                <div className="col-pos">#{u.posicao || i + 1}</div> 
                <div className="col-nome">
                  <div
                    className="avatar small"
                    style={
                      u.avatar ? { backgroundImage: `url(${u.avatar})` } : {}
                    }
                  />
                  <span>{u.nome || "Jogador"}</span> 
                </div>
                <div className="col-ganho">
                  {u.pontos !== undefined
                    ? `${u.pontos} pts`
                    : u.ganho !== undefined
                    ? `+${u.ganho}`
                    : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}