// pages/FimDeJogo/index.js

import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { useAuth } from "../../hooks/useAuth"; 
import Loader from "../../components/common/Loader"; 
import image6 from "../../assets/images/image 6.svg"; // Troféu Prata (Comentário está errado, esta é Ouro)
import image7 from "../../assets/images/image 7.svg"; // Troféu Ouro (Comentário está errado, esta é Prata)
import image8 from "../../assets/images/image 8.svg"; // Troféu Bronze
import "./style.css";
import rankingService from "../../services/rankingService"; 

// Estilos (sem alteração)
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
  const idSala = location.state?.idSala;

  const [podiumData, setPodiumData] = useState([]);
  const [ranking, setRanking] = useState([]); 
  
  const [loadingPage, setLoadingPage] = useState(true); 
  const [refreshError, setRefreshError] = useState(null); 

  const stableRefreshUserData = useCallback(refreshUserData, [refreshUserData]);

  // useEffect (sem alteração)
  useEffect(() => {
    let mounted = true; 

    const carregarDadosFimDeJogo = async () => {
      if (!idSala) {
        if (mounted) {
          setRefreshError("Não foi possível carregar o ranking (ID da Sala não encontrado).");
          setLoadingPage(false);
        }
        return;
      }

      setRefreshError(null); 

      try {
        const [rankingResult] = await Promise.all([
          rankingService.getRankingSala(idSala),
          stableRefreshUserData() 
        ]);

        if (mounted) {
          const rankingMapeado = (rankingResult || []).map((jogador, index) => {
            const posicao = index + 1; 
            return {
              id: jogador.nomeUsuario, 
              nome: jogador.nomeUsuario,
              pontos: jogador.pontuacao,
              posicao: posicao
            };
          });

          setRanking(rankingMapeado); 
          setPodiumData(rankingMapeado.slice(0, 3)); 
        }

      } catch (err) {
        if (mounted) {
          console.error("FimDeJogo: Erro ao buscar dados:", err);
          setRefreshError("Não foi possível carregar o ranking da partida.");
        }
      } finally {
        if (mounted) {
          setLoadingPage(false);
        }
      }
    };

    if (!authLoading && user) {
      carregarDadosFimDeJogo();
    } else if (!authLoading && !user) {
      if (mounted) setLoadingPage(false);
    }
    
    return () => {
      mounted = false;
    };
    
  }, [authLoading, user, idSala, stableRefreshUserData]);


  const getTrophy = (pos) => {
    // ✅ CORREÇÃO AQUI: Trocamos image6 e image7
    // 1º Lugar (pos=1) recebe image6 (Ouro)
    // 2º Lugar (pos=2) recebe image7 (Prata)
    const trophies = { 1: image6, 2: image7, 3: image8 };
    return trophies[pos] || image8; 
  }; 

  // --- Renderização --- 
  if (authLoading || loadingPage) { 
    return (
      <>
        <Header /> 
        <div style={pageStyle}>
          <Loader /> 
        </div>
      </>
    );
  }

  // (O resto do JSX não muda)
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
            {podiumData.map((jogador, idx) => ( 
              <div key={jogador.id || idx} className={`podium-col pos-${jogador.posicao}`}> 
                <img
                  src={getTrophy(jogador.posicao)} // Agora usa a ordem correta
                  alt={`Troféu ${jogador.posicao}`}
                  className="trophy"
                />
                <div className="user-card">
                  <div
                    className="avatar"
                    style={
                      jogador.avatar ? { backgroundImage: `url(${jogador.avatar})` } : {}
                    }
                  />
                  <div className="user-name">{jogador.nome || "Jogador"}</div> 
                </div>
                <div className="points">{jogador.pontos ?? 0} Pontos</div> 
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
              <div key={u.id || i} className="linha-user">
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