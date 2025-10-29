// pages/FimDeJogo/index.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { useAuth } from "../../hooks/useAuth"; // Importa useAuth
import Loader from "../../components/common/Loader"; // Importa Loader
import image6 from "../../assets/images/image 6.svg"; // Troféu Prata
import image7 from "../../assets/images/image 7.svg"; // Troféu Ouro
import image8 from "../../assets/images/image 8.svg"; // Troféu Bronze
// import medal from '../../assets/images/image 31.svg'; // Ícone não parece ser usado aqui
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
  const navigate = useNavigate(); // Pega user, loading inicial e a função refreshUserData
  const { user, refreshUserData, loading: authLoading } = useAuth(); // Dados recebidos do GameQuiz

  const pontuacaoQuiz = location.state?.pontuacao || 0;
  const totalPerguntas = location.state?.totalPerguntas || 0; // const quizId = location.state?.quizId; // const codigoSala = location.state?.codigoSala; // const idSala = location.state?.idSala; // Pódio/Ranking (vindo do state, se houver)
  const podiumData = location.state?.podium || [];
  const ranking = location.state?.ranking || []; // Estados de controle

  const [refreshingScore, setRefreshingScore] = useState(true); // Loading para buscar score atualizado
  const [refreshError, setRefreshError] = useState(null); // --- useEffect CORRIGIDO para evitar loop ---

  useEffect(() => {
    let mounted = true; // Flag para limpeza

    // Só executa a lógica QUANDO authLoading se torna false E temos um usuário
    if (!authLoading && user && user.id) {
      // Verifica se já não está buscando para evitar múltiplas chamadas rápidas (opcional)
      // if (refreshingScore) return;

      console.log(
        "FimDeJogo: Auth carregado e user existe. Buscando dados atualizados..."
      );
      setRefreshingScore(true); // Indica que a busca vai começar
      setRefreshError(null); // Chama a função do AuthProvider para buscar /me novamente

      refreshUserData()
        .then(() => {
          if (mounted) console.log("FimDeJogo: Dados do usuário atualizados."); // O estado 'user' no useAuth foi atualizado, a renderização pegará
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
          // Garante que o loading termina apenas se o componente ainda estiver montado
          if (mounted) setRefreshingScore(false);
        });
    } else if (!authLoading && !user) {
      // Se terminou o loading inicial mas não temos usuário
      console.warn(
        "FimDeJogo: Auth carregado, mas usuário não encontrado. Não buscando score."
      );
      if (mounted) setRefreshingScore(false); // Garante que o loading para
    } else {
      // Se authLoading ainda é true, mantém refreshingScore como true
      if (mounted && !refreshingScore) setRefreshingScore(true);
    } // Função de limpeza

    return () => {
      mounted = false;
    };

    // Depende de authLoading (para saber quando começar) e da REFERÊNCIA de refreshUserData.
    // Incluir user.id garante que só busca QUANDO o usuário estiver definido.
  }, [authLoading, user?.id, refreshUserData]); // <<< DEPENDÊNCIAS CORRIGIDAS // Mapear troféus (sem alterações)

  const getTrophy = (pos) => {
    const trophies = { 1: image7, 2: image6, 3: image8 };
    return trophies[pos] || image8;
  }; // --- Renderização --- // Mostra loader se auth inicial OU refresh do score estão em andamento

  if (authLoading || refreshingScore) {
    return (
      <>
                <Header />{" "}
        {/* Header pode mostrar score antigo ou estado de loading */}       {" "}
        <div style={pageStyle}>
                    <Loader />       {" "}
        </div>
             {" "}
      </>
    );
  }

  return (
    <>
            <Header /> {/* Header deve mostrar pontuação ATUALIZADA */}     {" "}
      <div className="fim-container" style={pageStyle}>
                <h1 className="fim-title">FIM DE JOGO</h1>       {" "}
        <div className="resultado-quiz">
                   {" "}
          <p>
                        Você acertou            {" "}
            <span className="score-highlight">{pontuacaoQuiz}</span> de        
                <span className="score-highlight">{totalPerguntas}</span>{" "}
            perguntas.          {" "}
          </p>
                 {" "}
        </div>
               {" "}
        <div className="pontuacao-total">
                    {/* Mostra pontuação ATUALIZADA do 'user' */}         {" "}
          <h2>
                        Sua Pontuação Total:{" "}
            {/* Usar user?.pontuacao diretamente */}           {" "}
            <span className="score-highlight">{user?.pontuacao ?? "..."}</span> 
                   {" "}
          </h2>
                 {" "}
        </div>
               {" "}
        {refreshError && (
          <p className="error-message" style={errorStyle}>
                        {refreshError}         {" "}
          </p>
        )}
                {/* Pódio (sem alterações) */}       {" "}
        {podiumData.length > 0 && (
          <div className="podium">
                        <h2>Pódio da Partida</h2>           {" "}
            {podiumData.slice(0, 3).map((p, idx) => (
              <div key={idx} className={`podium-col pos-${p.pos}`}>
                               {" "}
                <img
                  src={getTrophy(p.pos)}
                  alt={`Troféu ${p.pos}`}
                  className="trophy"
                />
                               {" "}
                <div className="user-card">
                                   {" "}
                  <div
                    className="avatar"
                    style={
                      p.avatar ? { backgroundImage: `url(${p.avatar})` } : {}
                    }
                  />
                                   {" "}
                  <div className="user-name">{p.nome || "Jogador"}</div>       
                         {" "}
                </div>
                               {" "}
                <div className="points">{p.pontos ?? 0} Pontos</div>           
                 {" "}
              </div>
            ))}
                     {" "}
          </div>
        )}
                {/* Botão Voltar (sem alterações) */}       {" "}
        <div className="fim-actions">
                   {" "}
          <button className="btn-proximo" onClick={() => navigate("/game")}>
                        VOLTAR AO MENU          {" "}
          </button>
                 {" "}
        </div>
                {/* Ranking (sem alterações) */}       {" "}
        {ranking.length > 0 && (
          <div className="lista-final">
                        <h2>Ranking da Partida</h2>           {" "}
            {ranking.map((u, i) => (
              <div key={i} className="linha-user">
                               {" "}
                <div className="col-pos">#{u.posicao || i + 1}</div>           
                   {" "}
                <div className="col-nome">
                                   {" "}
                  <div
                    className="avatar small"
                    style={
                      u.avatar ? { backgroundImage: `url(${u.avatar})` } : {}
                    }
                  />
                                    <span>{u.nome || "Jogador"}</span>         
                       {" "}
                </div>
                               {" "}
                <div className="col-ganho">
                                   {" "}
                  {u.pontos !== undefined
                    ? `${u.pontos} pts`
                    : u.ganho !== undefined
                    ? `+${u.ganho}`
                    : ""}
                                 {" "}
                </div>
                             {" "}
              </div>
            ))}
                     {" "}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </>
  );
}
