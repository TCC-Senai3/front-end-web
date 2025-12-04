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
  const [pontuacaoAtual, setPontuacaoAtual] = useState(0);
  const [carregandoPontuacao, setCarregandoPontuacao] = useState(true);

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

  // --- EFEITO 1: BUSCA PONTUAÇÃO INICIAL DO BACKEND ---
  useEffect(() => {
    if (authLoading || !user?.id) return;

    const buscarPontuacaoInicial = async () => {
      try {
        setCarregandoPontuacao(true);
        const pontuacao = await rankingService.getPontuacaoAtual();
        if (pontuacao !== undefined) {
          setPontuacaoAtual(pontuacao);
          console.log(`Pontuação inicial carregada do backend: ${pontuacao}`);
        }
      } catch (error) {
        console.error("Erro ao buscar pontuação inicial:", error);
        // Em caso de erro, usa a pontuação do user como fallback
        if (user?.pontuacao !== undefined) {
          setPontuacaoAtual(user.pontuacao);
        }
      } finally {
        setCarregandoPontuacao(false);
      }
    };

    buscarPontuacaoInicial();
  }, [authLoading, user?.id]);

  // --- EFEITO 1.5: ATUALIZA HEADER (COM TRAVA) ---
  useEffect(() => {
    // Se o auth ainda está carregando, espera.
    if (authLoading) return;

    // Se JÁ atualizamos uma vez, não faz nada (quebra o loop)
    if (jaAtualizouRef.current) return;

    const runRefresh = async () => {
      console.log("Tentando atualizar header do usuário (Uma vez)...");
      jaAtualizouRef.current = true; // <--- TRAVA IMEDIATAMENTE
      try {
        await refreshUserData();
        console.log("Header atualizado com sucesso.");
      } catch (error) {
        console.error("Erro silencioso ao atualizar header:", error);
      }
    };

    runRefresh();
  }, [authLoading, refreshUserData]);

  // --- EFEITO 3: ATUALIZAÇÃO AUTOMÁTICA DE PONTOS (POLLING) ---
  useEffect(() => {
    if (!user?.id || authLoading || carregandoPontuacao) return;

    let intervalId;
    let isMounted = true;

    const atualizarPontos = async () => {
      try {
        const novaPontuacao = await rankingService.getPontuacaoAtual();
        
        if (isMounted && novaPontuacao !== undefined && novaPontuacao !== null) {
          // Atualiza apenas se a pontuação mudou
          setPontuacaoAtual((pontuacaoAnterior) => {
            if (novaPontuacao !== pontuacaoAnterior) {
              // Atualiza também o header através do refreshUserData
              refreshUserData().catch(err => 
                console.error("Erro ao atualizar header:", err)
              );
              console.log(`Pontos atualizados automaticamente: ${pontuacaoAnterior} -> ${novaPontuacao}`);
              return novaPontuacao;
            }
            return pontuacaoAnterior;
          });
        }
      } catch (error) {
        console.error("Erro ao atualizar pontos automaticamente:", error);
      }
    };

    // Primeira atualização imediata após o carregamento inicial
    atualizarPontos();

    // Configura polling a cada 2 segundos (mais frequente para atualização mais rápida)
    intervalId = setInterval(atualizarPontos, 2000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user?.id, authLoading, carregandoPontuacao, refreshUserData]);


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
        
        {/* <div className="pontuacao-total">
          <h2>
            Sua Pontuação Total: 
            <span className="score-highlight">
              {carregandoPontuacao ? "..." : pontuacaoAtual}
            </span>
          </h2>
        </div> */}

        {refreshError && <div style={errorStyle}>{refreshError}</div>}
        
        {!refreshError && ranking.length === 0 && (
           <div style={{marginTop: 20, color: '#fff'}}>Ranking indisponível.</div>
        )}

        {/* PÓDIO - Layout reorganizado */}
        {podiumData.length > 0 && (
          <div className="podium-wrapper">
            <h2 className="podium-title">Pódio da Partida</h2>
            <div className="podium-content">
              {podiumData.slice(0, 1).map((jogador) => (
                <div key={jogador.id} className="podium-first-place">
                  <img src={getTrophy(jogador.posicao)} alt={`Posição ${jogador.posicao}`} className="trophy-large" />
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
          </div>
        )}

        <div className="fim-actions">
          <button className="btn-proximo" onClick={() => navigate("/game")}>
            VOLTAR AO MENU
          </button>
        </div>

        {/* LISTA COMPLETA - Posicionada no canto inferior esquerdo */}
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