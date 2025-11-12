import React, { useState, useEffect, useMemo } from "react";
import SearchIcon from "../../../assets/images/search 1.svg";
// ✅ Ordem dos troféus corrigida (Ouro, Prata, Bronze)
import image7 from "../../../assets/images/image 7.svg"; // 1º Lugar (Ouro)
import image6 from "../../../assets/images/image 6.svg"; // 2º Lugar (Prata)
import image8 from "../../../assets/images/image 8.svg"; // 3º Lugar
import image31 from "../../../assets/images/image 31.svg";
import rankingSlogan from "../../../assets/images/Group 13.svg";
// ✅ 1. IMPORTAÇÃO CORRIGIDA: Importa o objeto 'default'
import rankingService from "../../../services/rankingService";
import Loader from "../../common/Loader";
import "./style.css";

export default function RankingSection() {
    const [ranking, setRanking] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Mapeia os ícones de pódio (Ouro, Prata, Bronze)
    const podiumIcons = useMemo(() => [image7, image6, image8], []);

    // Carrega ranking do backend
    useEffect(() => {
        const loadRanking = async () => {
            try {
                setLoading(true);
                // ✅ 2. CHAMADA CORRIGIDA: Usa o 'rankingService'
                const response = await rankingService.getRankingGlobal();

                // ✅ 3. LÓGICA CORRIGIDA:
                // 'response' é o array [ { nomeUsuario, pontuacao }, ... ]
                if (response && Array.isArray(response)) {
                    
                    // O "Tradutor" (mapeador)
                    const transformedData = response.map((user, index) => {
                        const position = index + 1;
                        return {
                            // O que o Front-End espera:
                            id: user.nomeUsuario,
                            nome: user.nomeUsuario,  // Traduz 'nomeUsuario' para 'nome'
                            pontos: user.pontuacao, // Traduz 'pontuacao' para 'pontos'
                            posicao: position,
                            // Atribui o ícone de pódio correto
                            avatar: index < 3 ? podiumIcons[index] : null
                        };
                    });
                    setRanking(transformedData);
                } else {
                    console.error('Erro ao carregar ranking: A resposta não é um array.');
                    setRanking([]);
                }
            } catch (error) {
                // O 'error.message' agora deve aparecer
                console.error('Erro ao carregar ranking:', error.message || error);
                setRanking([]);
            } finally {
                setLoading(false);
            }
        };

        loadRanking();
    
    // 'podiumIcons' é uma dependência (corrigido para o Vercel)
    }, [podiumIcons]);

    // Filtra usuários (Esta parte já está correta, pois usa 'user.nome')
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
                // ✅ 4. JSX CORRIGIDO:
                // 'filteredRanking' agora tem os dados corretos (nome, pontos, etc.)
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
                            {/* 'user.nome' agora existe */}
                            <span className="ranking-nome">{user.nome}</span>
                            <div className="ranking-points-container">
                                <img src={image31} alt="Medalha" className="ranking-medal-icon" />
                                {/* 'user.pontos' agora existe */}
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