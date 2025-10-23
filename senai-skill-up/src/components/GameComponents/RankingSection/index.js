import React, { useState, useEffect } from "react";
import SearchIcon from "../../../assets/images/search 1.svg";
import image6 from "../../../assets/images/image 6.svg";
import image7 from "../../../assets/images/image 7.svg";
import image8 from "../../../assets/images/image 8.svg";
import image31 from "../../../assets/images/image 31.svg";
import rankingSlogan from "../../../assets/images/Group 13.svg";
import { getRankingGlobal } from "../../../services/rankingService";
import Loader from "../../common/Loader";
import "./style.css";

export default function RankingSection() {
    const [ranking, setRanking] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Carrega ranking do backend
    useEffect(() => {
        const loadRanking = async () => {
            try {
                setLoading(true);
                const response = await getRankingGlobal();
                if (response.success) {
                    setRanking(response.data || []);
                } else {
                    console.error('Erro ao carregar ranking:', response.message);
                    setRanking([]);
                }
            } catch (error) {
                console.error('Erro ao carregar ranking:', error);
                setRanking([]);
            } finally {
                setLoading(false);
            }
        };

        loadRanking();
    }, []);

    // Filtra usuários com base na pesquisa
    const filteredRanking = ranking.filter(user =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const getRankIcon = (iconPath) => {
        switch (iconPath) {
            case '/assets/images/image 6.svg':
                return image6;
            case '/assets/images/image 7.svg':
                return image7;
            case '/assets/images/image 8.svg':
                return image8;
            default:
                return null;
        }
    };

    const handleViewProfile = (user) => {
        // Por enquanto, apenas mostra um alerta. 
        // Em uma aplicação real, isso abriria um modal ou navegaria para a página de perfil
        alert(`Usuário: ${user.nome}\nPontos: ${user.pontos}\nPosição: ${user.posicao || 'N/A'}`);
    };

    return (
        <div className="ranking-container">
            <img src={rankingSlogan} alt="Ranking" className="ranking-slogan" />
            <div className="ranking-pesquisa-container">
                <input 
                    placeholder="Pesquisar..." 
                    className="ranking-pesquisa-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img src={SearchIcon} alt="Pesquisar" className="ranking-pesquisa-icon" />
            </div>
            <div className="ranking-lista">
                {loading ? (
                    <div className="loader-container">
                        <Loader />
                    </div>
                ) : filteredRanking.length > 0 ? (
                    filteredRanking.map((user, idx) => (
                        <div
                            key={user.id || idx}
                            className="ranking-item"
                            onClick={() => handleViewProfile(user)}
                        >
                            {idx < 3 && user.avatar ? (
                                <img src={getRankIcon(user.avatar)} alt={`Rank ${idx + 1}`} className="ranking-pos-icon" /> 
                            ) : (
                                <span className="ranking-pos">{user.posicao || idx + 1}</span>
                            )}
                            <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=random`} 
                                alt="avatar" 
                                className="ranking-avatar" 
                            />
                            <span className="ranking-nome">{user.nome}</span>
                            <div className="ranking-points-container">
                                <img src={image31} alt="Medalha" className="ranking-medal-icon" />
                                <span className="ranking-pontos">{user.pontos || (1000 - idx * 10)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{searchTerm ? 'Nenhum usuário encontrado.' : 'Nenhum usuário no ranking ainda.'}</p>
                )}
            </div>
        </div>
    );
}