import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import rankingService from "../../services/rankingService";
import "./style.css";

// --- IMAGENS ---
import image6 from "../../assets/images/image 6.svg"; // Ouro
import image7 from "../../assets/images/image 7.svg"; // Prata
import image8 from "../../assets/images/image 8.svg"; // Bronze
import userProfileImage from "../../assets/images/user-profile1.png";
import bodeIcon from "../../assets/images/bode.svg";
import canetaIcon from "../../assets/images/Canetabic.svg";
import patoIcon from "../../assets/images/Pato.svg";

const pageStyle = {
  minHeight: "calc(100vh - 60px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
};
const errorStyle = { color: "#ffdddd", marginTop: "10px", background: "rgba(255,0,0,0.2)", padding: "10px", borderRadius: "5px" };

export default function FimDeJogo() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pega user e refresh do hook
  const { user, refreshUserData, loading: authLoading } = useAuth();

  const pontuacaoQuiz = location.state?.pontuacao || 0;
  const totalPerguntas = location.state?.totalPerguntas || 0;
  const idSala = location.state?.idSala;

  const [podiumData, setPodiumData] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [refreshError, setRefreshError] = useState(null);

  // --- TRAVA DE SEGURANÇA (REF) ---
  // useRef mantém o valor entre renderizações e não causa re-render
  const jaAtualizouRef = useRef(false);

  // Avatar Map
  const avatarMap = {
    "bode.svg": bodeIcon, "bode": bodeIcon,
    "Canetabic.svg": canetaIcon, "caneta": canetaIcon,
    "Pato.svg": patoIcon, "pato": patoIcon,
  };

  const getAvatarSrc = (avatarString) => {
    if (!avatarString) return userProfileImage;
    const cleanName = avatarString.trim();
    if (cleanName.startsWith("data:") || cleanName.startsWith("http")) {
      return cleanName;
    }
    return avatarMap[cleanName] || userProfileImage;
  };

  const getTrophy = (pos) => {
    const trophies = { 1: image6, 2: image7, 3: image8 };
    return trophies[pos] || image8;
  };

  // --- EFEITO 1: ATUALIZA HEADER (COM TRAVA) ---
  useEffect(() => {
    // Se o auth ainda está carregando, espera.
    if (authLoading) return;

    // Se JÁ atualizamos uma vez, não faz nada (quebra o loop)
    if (jaAtualizouRef.current) return;

    const runRefresh = async () => {
      console.log("Tentando atualizar pontuação do usuário (Uma vez)...");
      jaAtualizouRef.current = true; // <--- TRAVA IMEDIATAMENTE
      try {
        await refreshUserData();
        console.log("Pontuação atualizada com sucesso.");
      } catch (error) {
        console.error("Erro silencioso ao atualizar header:", error);
      }
    };

    runRefresh();
  }, [authLoading, refreshUserData]);


  // --- EFEITO 2: BUSCA O RANKING DA SALA ---
  useEffect(() => {
    let mounted = true;
    
    const carregarDadosDoRanking = async () => {
      // Se não tiver idSala, aborta
      if (!idSala) {
        if (mounted) {
          setRefreshError("ID da sala não informado.");
          setLoadingPage(false);
        }
        return;
      }

      setLoadingPage(true);
      
      try {
        console.log(`Buscando ranking final da sala ${idSala}...`);
        const rankingResult = await rankingService.getRankingSala(idSala);

        if (mounted) {
          const rankingMapeado = (rankingResult || []).map((jogador, index) => ({
            id: jogador.id || index,
            nome: jogador.nomeUsuario || "Anônimo",
            pontos: jogador.pontuacao,
            posicao: index + 1,
            avatar: jogador.avatar,
          }));

          setRanking(rankingMapeado);
          setPodiumData(rankingMapeado.slice(0, 3));
        }
      } catch (err) {
        console.error("Erro ao carregar ranking:", err);
        if (mounted) setRefreshError("Não foi possível carregar o ranking.");
      } finally {
        if (mounted) setLoadingPage(false);
      }
    };

    carregarDadosDoRanking();

    return () => { mounted = false; };
  }, [idSala]); // Removemos dependências desnecessárias


  // --- RENDER ---
  if (loadingPage) {
    return (
      <>
        <Header />
        <div style={pageStyle}><Loader /></div>
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
            Você acertou <span className="score-highlight">{pontuacaoQuiz}</span> de{" "}
            <span className="score-highlight">{totalPerguntas}</span> perguntas.
          </p>
        </div>
        
        <div className="pontuacao-total">
          <h2>
            Sua Pontuação Total: 
            <span className="score-highlight">{user?.pontuacao ?? "..."}</span>
          </h2>
        </div>

        {refreshError && <div style={errorStyle}>{refreshError}</div>}
        
        {!refreshError && ranking.length === 0 && (
           <div style={{marginTop: 20, color: '#fff'}}>Ranking indisponível.</div>
        )}

        {/* PÓDIO */}
        {podiumData.length > 0 && (
          <div className="podium">
            <h2>Pódio da Partida</h2>
            {podiumData.map((jogador) => (
                <div key={jogador.id} className={`podium-col pos-${jogador.posicao}`}>
                  <img src={getTrophy(jogador.posicao)} alt={`Posição ${jogador.posicao}`} className="trophy" />
                  <div className="user-card">
                    <div className="avatar">
                       <img 
                         src={getAvatarSrc(jogador.avatar)} 
                         alt={jogador.nome} 
                         style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                       />
                    </div>
                    <div className="user-name">{jogador.nome}</div>
                  </div>
                  <div className="points">{jogador.pontos} pts</div>
                </div>
            ))}
          </div>
        )}

        <div className="fim-actions">
          <button className="btn-proximo" onClick={() => navigate("/game")}>
            VOLTAR AO MENU
          </button>
        </div>

        {/* LISTA COMPLETA */}
        {ranking.length > 0 && (
          <div className="lista-final">
            <h2>Classificação Geral</h2>
            {ranking.map((u) => (
                <div key={u.id} className="linha-user">
                  <div className="col-pos">#{u.posicao}</div>
                  <div className="col-nome">
                    <div className="avatar small">
                       <img 
                         src={getAvatarSrc(u.avatar)} 
                         alt={u.nome} 
                         style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                       />
                    </div>
                    <span>{u.nome}</span>
                  </div>
                  <div className="col-ganho">{u.pontos} pts</div>
                </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}