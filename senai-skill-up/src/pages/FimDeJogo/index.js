// pages/FimDeJogo/index.js

import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { useAuth } from "../../hooks/useAuth"; 
import Loader from "../../components/common/Loader"; 
import image6 from "../../assets/images/image 6.svg"; // Troféu Prata
import image7 from "../../assets/images/image 7.svg"; // Troféu Ouro
import image8 from "../../assets/images/image 8.svg"; // Troféu Bronze
import "./style.css";
// ✅ 1. IMPORTAR O NOVO SERVIÇO
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

  // Dados do quiz (sem alteração)
  const pontuacaoQuiz = location.state?.pontuacao || 0;
  const totalPerguntas = location.state?.totalPerguntas || 0; 
  // ✅ 2. PEGAR O ID DA SALA
  // (Removemos os rankings que vinham do state)
  const idSala = location.state?.idSala;

  // ✅ 3. NOVOS ESTADOS PARA OS DADOS
  // (Não usamos mais location.state para pódio e ranking)
  const [podiumData, setPodiumData] = useState([]);
  const [ranking, setRanking] = useState([]); 
  
  // (Renomeei 'refreshingScore' para 'loadingPage' para mais clareza)
  const [loadingPage, setLoadingPage] = useState(true); 
  const [refreshError, setRefreshError] = useState(null); 

  const stableRefreshUserData = useCallback(refreshUserData, [refreshUserData]);

  // --- useEffect ATUALIZADO ---
  useEffect(() => {
    let mounted = true; 

    // Função única para buscar todos os dados da página
    const carregarDadosFimDeJogo = async () => {
      if (!idSala) {
        console.error("FimDeJogo: ID da Sala não encontrado!");
        if (mounted) {
          setRefreshError("Não foi possível carregar o ranking (ID da Sala não encontrado).");
          setLoadingPage(false);
        }
        return;
      }

      console.log("FimDeJogo: Buscando dados...");
      setRefreshError(null); 

      try {
        // ✅ 4. EXECUTAR OS DOIS FETCHES EM PARALELO
        const [rankingResult] = await Promise.all([
          // Fetch 1: O ranking da partida
          rankingService.getRankingSala(idSala),
          // Fetch 2: Atualizar a pontuação total do usuário (para o Header)
          stableRefreshUserData() 
        ]);

        // Se chegou aqui, os dois fetches funcionaram
        if (mounted) {
          console.log("FimDeJogo: Ranking da partida recebido:", rankingResult);
          
          // Assumindo que o 'rankingResult' já vem ordenado
          setRanking(rankingResult || []);
          // Pegamos os 3 primeiros para o Pódio
          setPodiumData((rankingResult || []).slice(0, 3));
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

    // Só executa quando o Auth (usuário) estiver pronto
    if (!authLoading && user) {
      carregarDadosFimDeJogo();
    } else if (!authLoading && !user) {
      // Caso não esteja logado, não faz nada
      console.warn("FimDeJogo: Usuário não logado.");
      if (mounted) setLoadingPage(false);
    }
    
    return () => {
      mounted = false;
    };
    
  }, [authLoading, user, idSala, stableRefreshUserData]); // 'idSala' agora é uma dependência


  const getTrophy = (pos) => {
    // ✅ 5. LÓGICA DO PÓDIO AJUSTADA
    // O backend deve retornar o 1º lugar com {posicao: 1}
    // Se o seu backend não retornar a posição, você terá que ajustar aqui.
    // Esta lógica assume que o 'podiumData' tem um campo 'posicao'
    const trophies = { 1: image7, 2: image6, 3: image8 };
    return trophies[pos] || image8; 
  }; 

  // --- Renderização --- 
  // Mostra loader se o auth OU a página estiverem carregando
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
            {/* 'user.pontuacao' vem do useAuth (score total atualizado) */}
            <span className="score-highlight">{user?.pontuacao ?? "..."}</span> 
          </h2>
        </div>
        
        {refreshError && (
          <p className="error-message" style={errorStyle}>
            {refreshError} 
          </p>
        )}
        
        {/* ✅ 6. RENDERIZAÇÃO DO PÓDIO (AJUSTADA) */}
        {/* Agora usa o 'podiumData' buscado da API */}
        {podiumData.length > 0 && (
          <div className="podium">
            <h2>Pódio da Partida</h2> 
            {podiumData.map((jogador, idx) => (
              // Usamos 'jogador.id' ou 'idx' como chave
              <div key={jogador.id || idx} className={`podium-col pos-${jogador.posicao}`}> 
                <img
                  src={getTrophy(jogador.posicao)} // Usa a posição vinda do backend
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
                {/* 'jogador.pontos' deve ser a pontuação DA PARTIDA vinda do API */}
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
        
        {/* ✅ 7. RENDERIZAÇÃO DO RANKING (SEM ALTERAÇÃO) */}
        {/* O 'ranking' agora é o array completo vindo da API */}
        {ranking.length > 0 && (
          <div className="lista-final">
            <h2>Ranking da Partida</h2> 
            {ranking.map((u, i) => (
              <div key={u.id || i} className="linha-user">
                {/* Usamos a posição vinda do backend ou o índice */}
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
                  {/* ESTA É A PARTE MAIS IMPORTANTE (Linha 215 do seu original)
                    'u.pontos' deve ser o score DAQUELA PARTIDA, vindo do seu 
                    endpoint 'ranking/sala/{idSala}'.
                    Se o seu endpoint retornar 'u.pontos' como o score da partida,
                    seu desejo ("mostre somente a pontuação que o usuario ganhou")
                    será atendido sem mudar o JSX.
                  */}
                  {u.pontos !== undefined
                    ? `${u.pontos} pts`
                    : u.ganho !== undefined // Fallback (se o backend mandar 'ganho' em vez de 'pontos')
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