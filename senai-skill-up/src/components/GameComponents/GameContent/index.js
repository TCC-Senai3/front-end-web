import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RankingSection from '../RankingSection';
import QuizSection from '../QuizSection';
import { ModalQuestionario } from '../../';
import { getRankingGlobal } from '../../../services/rankingService';
import localStorageService from '../../../services/localStorageService';
import "./style.css";

export default function GameContent() {
    const [ranking, setRanking] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [questionarioSelecionado, setQuestionarioSelecionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

        // Atualizar quando localStorage mudar
        const handleStorageChange = () => {
            loadRankingData();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate]);

    const handleQuizSelect = (questionario) => {
        setQuestionarioSelecionado(questionario);
        setModalOpen(true);
    };

    const handleQuizCompletion = async (resultado) => {
        try {
            const currentUser = localStorageService.getCurrentUser();
            if (!currentUser) {
                console.error('Usuário não autenticado');
                return;
            }

            // Salvar resultado da partida
            const partidaData = {
                userId: currentUser.userId,
                temaId: questionarioSelecionado?.temaId || 'unknown',
                pontuacao: resultado.pontuacao || 0,
                totalPerguntas: resultado.totalPerguntas || 1,
                acertos: resultado.acertos || 0
            };

            // Encontrar o serviço correto para submeter resposta
            const { submitResposta } = await import('../../../services/quizService');
            await submitResposta(partidaData);

            // Atualizar ranking após completar quiz
            const rankingResponse = await getRankingGlobal();
            if (rankingResponse.success) {
                setRanking(rankingResponse.data);
            }

            // Fechar modal e mostrar resultado
            setModalOpen(false);
            
            // Redirecionar para página de resultado
            if (resultado.acertos === resultado.totalPerguntas) {
                navigate('/Correto');
            } else {
                navigate('/Errado');
            }

        } catch (error) {
            console.error('Erro ao processar resultado do quiz:', error);
        }
    };

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
            <div className="game-content-wrapper">
                <RankingSection />
                <QuizSection onQuizSelect={handleQuizSelect} />
            </div>
            <div className="game-spacing"></div>
            <ModalQuestionario 
                open={modalOpen} 
                onClose={() => setModalOpen(false)} 
                questionario={questionarioSelecionado || {}} 
                onQuizCompletion={handleQuizCompletion}
            />
        </>
    );
}