import React, { useEffect, useState, useCallback } from "react"; // 1. Importar o useCallback
import { useNavigate } from "react-router-dom";
import RankingSection from "../RankingSection";
import QuizSection from "../QuizSection";
// ✅ 2. CORREÇÃO NA IMPORTAÇÃO:
// Importar o 'rankingService' (default) em vez de '{ getRankingGlobal }'
import rankingService from "../../../services/rankingService";
import "./style.css";

export default function GameContent() {
  const [, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate(); // Atualiza o estado de isMobile (sem alteração)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ 3. CORREÇÃO NA LÓGICA DE BUSCA:
  // Envolvemos a lógica em 'useCallback' para estabilizá-la
  const loadRankingData = useCallback(async () => {
    try {
      setLoading(true); // Chama a função a partir do 'rankingService' importado

      const rankingResponse = await rankingService.getRankingGlobal();
      // 'rankingResponse' agora é o array de dados diretamente.
      // Removemos a verificação 'if (rankingResponse.success)'
      setRanking(rankingResponse || []); // || [] previne erros se a resposta for nula
    } catch (error) {
      // O 'error' agora deve ser o erro real do Axios
      console.error("Erro ao carregar ranking:", error.message || error);
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }, []); // useCallback não tem dependências aqui // Carregar dados do ranking

  useEffect(() => {
    loadRankingData(); // Recarregar dados periodicamente (opcional)

    const interval = setInterval(loadRankingData, 300000);
    return () => clearInterval(interval);
  }, [loadRankingData]); // ✅ 4. Dependência corrigida para 'loadRankingData'

  const handleQuizSelect = (questionario) => {
    navigate("/criarsala", { state: { quizSelecionado: questionario } });
  }; // Estilo para o container dos slides (sem alteração)

  const slideContainerStyle = {
    display: "flex",
    transition: "transform 0.5s ease-in-out",
    transform: `translateX(${-currentSlide * 100}%)`,
    width: "200%",
  };

  // (O restante do código - renderDesktopView, renderMobileView, etc. - continua igual)

  const renderDesktopView = () => (
    <div className="game-content-wrapper">
                  <RankingSection />
                  <QuizSection onQuizSelect={handleQuizSelect} />       {" "}
    </div>
  );

  const renderMobileView = () => (
    <div className="mobile-tabs-container">
                 {" "}
      <div className="tabs-buttons">
                       {" "}
        <button
          className={`tab-button ${currentSlide === 0 ? "active" : ""}`}
          onClick={() => setCurrentSlide(0)}
        >
                              Ranking                {" "}
        </button>
                       {" "}
        <button
          className={`tab-button ${currentSlide === 1 ? "active" : ""}`}
          onClick={() => setCurrentSlide(1)}
        >
                              Questionário a            {" "}
        </button>
                   {" "}
      </div>
                             {" "}
      <div className="tabs-content">
                       {" "}
        <div className="slides-container" style={slideContainerStyle}>
                             {" "}
          <div className="mobile-slide">
                                    <RankingSection />                   {" "}
          </div>
                             {" "}
          <div className="mobile-slide">
                                   {" "}
            <QuizSection onQuizSelect={handleQuizSelect} />                   {" "}
          </div>
                         {" "}
        </div>
                   {" "}
      </div>
             {" "}
    </div>
  );

  if (loading) {
    return (
      <div className="game-content-wrapper">
                       {" "}
        <div style={{ padding: "20px", textAlign: "center" }}>
                              <p>Carregando dados do jogo...</p>               {" "}
        </div>
                   {" "}
      </div>
    );
  }

  return (
    <>
                  {isMobile ? renderMobileView() : renderDesktopView()}         
        <div className="game-spacing"></div>       {" "}
    </>
  );
}
