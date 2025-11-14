import React, { useState, useEffect, useMemo } from "react";
import SearchIcon from "../../../assets/images/search 1.svg";
import image6 from "../../../assets/images/image 6.svg"; // 1º Lugar
import image7 from "../../../assets/images/image 7.svg"; // 2º Lugar
import image8 from "../../../assets/images/image 8.svg"; // 3º Lugar
import image31 from "../../../assets/images/image 31.svg";
import rankingSlogan from "../../../assets/images/Group 13.svg";

// --- Avatares ---
import userProfileImage from "../../../assets/images/user-profile1.png";
import bodeIcon from "../../../assets/images/bode.svg";
import canetaIcon from "../../../assets/images/Canetabic.svg";
import patoIcon from "../../../assets/images/Pato.svg";

import rankingService from "../../../services/rankingService";
import Loader from "../../common/Loader";
import "./style.css";

export default function RankingSection() {
  const [ranking, setRanking] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const podiumIcons = useMemo(() => [image6, image7, image8], []);

  // Use chaves em minúsculo para facilitar a comparação
  const avatarMap = useMemo(() => ({
    "bode.svg": bodeIcon,
    "bode": bodeIcon,
    "canetabic.svg": canetaIcon, // Garanta minúsculo aqui
    "caneta": canetaIcon,
    "pato.svg": patoIcon,
    "pato": patoIcon,
  }), []);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        setLoading(true);
        const response = await rankingService.getRankingGlobal();

        if (response && Array.isArray(response)) {
          const transformedData = response.map((user, index) => {
            const position = index + 1;
            return {
              id: user.nomeUsuario || index, 
              nome: user.nomeUsuario,
              pontos: user.pontuacao,
              posicao: position,
              rankIcon: index < 3 ? podiumIcons[index] : null,
              // Salva o avatar cru para processar depois
              avatarString: user.avatar 
            };
          });
          setRanking(transformedData);
        } else {
          setRanking([]);
        }
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
        setRanking([]);
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, [podiumIcons]);

  const filteredRanking = ranking.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (user) => {
    alert(`Usuário: ${user.nome}\nPontos: ${user.pontos}`);
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
          filteredRanking.map((user) => {
            
            // --- LÓGICA DE TRATAMENTO DO AVATAR ---
            let avatarSrc = userProfileImage; // Começa com padrão

            if (user.avatarString) {
              // 1. Pega só o nome do arquivo (remove caminhos "uploads/...")
              // 2. Tira espaços
              // 3. Converte para minúsculo para bater com o Map
              const cleanName = user.avatarString.split('/').pop().trim().toLowerCase();
              
              // Tenta buscar no mapa, se achar, substitui o padrão
              if (avatarMap[cleanName]) {
                avatarSrc = avatarMap[cleanName];
              }
            }
            // ---------------------------------------

            return (
              <div
                key={user.id || user.posicao}
                className="ranking-item"
                onClick={() => handleViewProfile(user)}
              >
                {user.rankIcon ? (
                  <img
                    src={user.rankIcon}
                    alt={`Rank ${user.posicao}`}
                    className="ranking-pos-icon"
                  />
                ) : (
                  <span className="ranking-pos">{user.posicao}</span>
                )}

                {/* Imagem do Avatar Final */}
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="ranking-avatar"
                />

                <span className="ranking-nome">{user.nome}</span>

                <div className="ranking-points-container">
                  <img
                    src={image31}
                    alt="Medalha"
                    className="ranking-medal-icon"
                  />
                  <span className="ranking-pontos">{user.pontos}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p>
            {searchTerm
              ? "Nenhum usuário encontrado."
              : "Nenhum usuário no ranking ainda."}
          </p>
        )}
      </div>
    </div>
  );
}