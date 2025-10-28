import React, { useState, useEffect } from "react";
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
    const podiumIcons = [image6, image7, image8];

    // Carrega ranking do backend
    useEffect(() => {
        const loadRanking = async () => {
            try {
                setLoading(true);
                const response = await getRankingGlobal();
                
                if (response.success && Array.isArray(response.data)) {
                    // *** AJUSTE PRINCIPAL AQUI ***
                    // Transformamos os dados da API ({ nomeUsuario, pontuacao })
                    // para o formato que o componente espera ({ id, nome, pontos, posicao, avatar })
                    const transformedData = response.data.map((user, index) => {
                        const position = index + 1;
                        return {
                            id: user.nomeUsuario, // Usando nomeUsuario como ID (assumindo ser único)
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
    }, []); // Array de dependências vazio está correto

    // Filtra usuários com base na pesquisa
    // Esta função não precisa mudar, pois agora filtramos por `user.nome`
    const filteredRanking = ranking.filter(user =>
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Esta função não é mais necessária, pois `user.avatar` agora contém o ícone correto
    // const getRankIcon = (iconPath) => { ... };

    const handleViewProfile = (user) => {
        // Esta função não precisa mudar
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
                    filteredRanking.map((user) => ( // `idx` removido, usamos `user.posicao`
                        <div
                            key={user.id} // Usando o `id` que criamos
                            className="ranking-item"
                            onClick={() => handleViewProfile(user)}
                        >
                            {/* *** AJUSTE NA LÓGICA DE ÍCONE *** */}
                            {/* Verificamos se `user.avatar` existe (só existirá para 1º, 2º, 3º).
                                Isso corrige um bug: antes, se você pesquisasse o 5º lugar,
                                ele apareceria em 1º na lista (idx=0) e ganharia o ícone de ouro.
                                Agora, o ícone está ligado à posição real (user.posicao).
                            */}
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
                                {/* *** AJUSTE NOS PONTOS *** */}
                                {/* Usamos apenas user.pontos, que vem direto da API */}
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