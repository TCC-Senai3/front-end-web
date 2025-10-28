import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import RankingSection from '../RankingSection';
import QuizSection from '../QuizSection';
import { getRankingGlobal } from '../../../services/rankingService';
import "./style.css";

export default function GameContent() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    // Atualiza o estado de isMobile quando a janela for redimensionada
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Carregar dados do ranking
    useEffect(() => {
        const loadRankingData = async () => {
            try {
                setLoading(true);
                
                // Carregar ranking
                const rankingResponse = await getRankingGlobal();
                if (rankingResponse.success) {
                    setRanking(rankingResponse.data);
                }

            } catch (error) {
                console.error("Erro ao carregar ranking:", error);
                setRanking([]);
            } finally {
                setLoading(false);
            }
        };

        // Removido verificação de autenticação para permitir acesso livre

        loadRankingData();

        // Recarregar dados periodicamente (opcional)
        const interval = setInterval(loadRankingData, 30000); // A cada 30 segundos
        return () => clearInterval(interval);
    }, [navigate]);

    const handleQuizSelect = (questionario) => {
        // Navegar para a página do jogo/quiz com o tema selecionado
        navigate('/jogo', { state: { quizSelecionado: questionario } });
    };

    const nextSlide = () => {
        setCurrentSlide(prev => {
            const next = prev + 1;
            return next > 1 ? 0 : next;
        });
    };

    const prevSlide = () => {
        setCurrentSlide(prev => {
            const next = prev - 1;
            return next < 0 ? 1 : next;
        });
    };
    
    // Verifica se as setas devem estar desabilitadas
    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === 1;

    // Estilo para o container dos slides
    const slideContainerStyle = {
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(${-currentSlide * 100}%)`,
        width: '200%',
    };

    const renderDesktopView = () => (
        <div className="game-content-wrapper">
            <RankingSection />
            <QuizSection onQuizSelect={handleQuizSelect} />
        </div>
    );

    const renderMobileView = () => (
        <div className="mobile-tabs-container">
            {/* Botões de Tab */}
            <div className="tabs-buttons">
                <button 
                    className={`tab-button ${currentSlide === 0 ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(0)}
                >
                    Ranking
                </button>
                <button 
                    className={`tab-button ${currentSlide === 1 ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(1)}
                >
                    Questionário
                </button>
            </div>
            
            {/* Conteúdo das seções */}
            <div className="tabs-content">
                <div className="slides-container" style={slideContainerStyle}>
                    {/* Card Ranking */}
                    <div className="mobile-slide">
                        <RankingSection />
                    </div>

                    {/* Card Quiz */}
                    <div className="mobile-slide">
                        <QuizSection onQuizSelect={handleQuizSelect} />
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="game-content-wrapper">
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>Carregando dados do jogo...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {isMobile ? renderMobileView() : renderDesktopView()}
            <div className="game-spacing"></div>
        </>
    );
}