import React, { useState, useEffect, useMemo } from "react"; // ✅ 1. IMPORTAR useMemo
import SearchIcon from "../../../assets/images/search 1.svg";
import image6 from "../../../assets/images/image 6.svg"; // 1º Lugar
import image7 from "../../../assets/images/image 7.svg"; // 2º Lugar
import image8 from "../../../assets/images/image 8.svg"; // 3º Lugar
import image31 from "../../../assets/images/image 31.svg";
import rankingSlogan from "../../../assets/images/Group 13.svg";
import { getRankingGlobal } from "../../../services/rankingService";
import Loader from "../../common/Loader";
import "./style.css";

export default function RankingSection() {
    const [ranking, setRanking] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Mapeia os ícones de pódio para facilitar o acesso
    // ✅ 2. Mover 'podiumIcons' para useMemo para estabilizar a referência
    const podiumIcons = useMemo(() => [image6, image7, image8], []);

    // Carrega ranking do backend
    useEffect(() => {
        const loadRanking = async () => {
            try {
                setLoading(true);
                const response = await getRankingGlobal();

                if (response.success && Array.isArray(response.data)) {
                    const transformedData = response.data.map((user, index) => {
                        const position = index + 1;
                        return {
                            id: user.nomeUsuario,
                            nome: user.nomeUsuario,
                            pontos: user.pontuacao,
                            posicao: position,
                            // Atribui o ícone de pódio se for 1º, 2º ou 3º, senão null
                            avatar: index < 3 ? podiumIcons[index] : null
                        };
                    });
                    setRanking(transformedData);
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

        // ✅ 3. CORREÇÃO: 'podiumIcons' foi adicionado ao array de dependências
    }, [podiumIcons]);

    // Filtra usuários com base na pesquisa
    const filteredRanking = ranking.filter(user =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewProfile = (user) => {
        alert(`Usuário: ${user.nome}\nPontos: ${user.pontos}\nPosição: ${user.posicao}`);
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
                    filteredRanking.map((user) => (
                        <div
                            key={user.id}
                            className="ranking-item"
                            onClick={() => handleViewProfile(user)}
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt={`Rank ${user.posicao}`} className="ranking-pos-icon" />
                            ) : (
                                <span className="ranking-pos">{user.posicao}</span>
                            )}
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=random`}
                                alt="avatar"
                                className="ranking-avatar"
                            />
                            <span className="ranking-nome">{user.nome}</span>
                            <div className="ranking-points-container">
                                <img src={image31} alt="Medalha" className="ranking-medal-icon" />
                                <span className="ranking-pontos">{user.pontos}</span>
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