import React, { useEffect, useState } from "react";
import { ProfileHeader, ProfileStatus, ProfileRanking, ProfileHistory } from '../';
import { getRankingGlobal, getPontuacaoUsuario } from '../../../services/rankingService';
import "./style.css";

export default function ProfileContent() {
    const [ranking, setRanking] = useState([]);
    const [userScore, setUserScore] = useState(null);
    const userId = "mockUserId";

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = [
                    { id: 'user2', nome: 'Maria', pontos: 1500, icon: '/assets/images/image 7.svg' },
                    { id: 'mockUserId', nome: 'Usuario123', pontos: 1200, icon: '/assets/images/image 6.svg' },
                    { id: 'user3', nome: 'João', pontos: 1100, icon: '/assets/images/image 8.svg' },
                    { id: 'user4', nome: 'Ana', pontos: 900 },
                    { id: 'user5', nome: 'Carlos', pontos: 800 },
                ];
                setRanking(data);
            } catch (error) {
                console.error("Erro ao buscar ranking global:", error);
            }
        };

        const fetchUserScore = async () => {
            try {
                const { data } = await getPontuacaoUsuario(userId);
                setUserScore(data.score);
            } catch (error) {
                console.error("Erro ao buscar pontuação do usuário:", error);
            }
        };

        fetchRanking();
        fetchUserScore();
    }, [userId]);

    return (
        <div className="perfil-container">
            <main className="perfil-main">
                <ProfileHeader userScore={userScore} />
                
                <div className="cards-harmonicos-container">
                    <ProfileStatus />
                    <ProfileRanking ranking={ranking} />
                    <ProfileHistory />
                </div>
            </main>
        </div>
    );
}
