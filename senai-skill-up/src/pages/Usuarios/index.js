import React, { useState, useEffect, useMemo } from "react";
import { Header, Footer } from "../../components";
import UsersRankingTable from "../../components/UsersComponents/UsersRankingTable";
import PerfilModal from "../PerfilModal";
import userService from "../../services/userService";
import "./style.css";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true); // Carregar usuários ao montar o componente

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // 1. Busca os dados (que agora incluem 'online' e 'pontuacao')
        const apiUsers = await userService.getAllUsers();

        // 2. Ordena a lista aqui no frontend (do maior para o menor)
        apiUsers.sort((a, b) => (b.pontuacao || 0) - (a.pontuacao || 0));

        // 3. Adiciona o campo 'rank' (posição) a cada usuário
        const usersWithRank = apiUsers.map((user, index) => ({
          ...user,
          rank: index + 1, // Adiciona a posição (1, 2, 3...)
        }));

        setUsers(usersWithRank); // Salva a lista completa e ordenada
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []); // Roda apenas uma vez // Filtra os usuários (sem alteração, 'nome' e 'email' existem no DTO)

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.nome?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        // 'nivel' não existe no UsuarioPerfilDTO, talvez remover este filtro?
        user.nivel?.toLowerCase().includes(term)
    );
  }, [searchTerm, users]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  }; // --- handleViewProfile (CORRIGIDO) ---

  // Agora lê os campos corretos vindos do DTO (e o 'rank' que adicionamos)
  const handleViewProfile = (user) => {
    const profileData = {
      ...user, // Passa 'id', 'nome', 'email', 'biografia', 'online', 'roles'
      name: user.nome,
      email: user.email,
      points: user.pontuacao, // ✅ CORRIGIDO: Usa 'pontuacao' do DTO
      position: user.rank, // ✅ CORRIGIDO: Usa 'rank' que criamos
      // O DTO não envia 'jogosJogados' ou 'precisao', então usamos 0
      gamesPlayed: user.jogosJogados || 0,
      accuracy: user.precisao || 0,
      // O DTO não envia 'dataCriacao', podemos buscar ou omitir
      memberSince: user.dataCriacao || "N/A",
      achievements: [
        { icon: "🏆", name: "Primeiro Quiz Completado" },
        {
          icon: "⭐",
          name: `${
            Math.floor((user.pontuacao || 0) / 1000) * 1000
          } Pontos Alcançados`,
        },
        { icon: "🎯", name: `Precisão de ${user.precisao || 0}%` },
        { icon: "🏅", name: `Nível ${user.nivel || 1}` }, // O DTO não tem 'nivel'
      ],
    };
    setSelectedUser(profileData);
  };
  // --- FIM DA CORREÇÃO ---

  const handleCloseProfile = () => {
    setSelectedUser(null);
  };

  return (
    <>
            <Header />     {" "}
      <div className="usuarios-container">
               {" "}
        <div className="usuarios-content">
                   {" "}
          <div className="usuarios-header">
                        <h1>Ranking de Usuários</h1>           {" "}
            <p>Veja o desempenho dos usuários do SENAI Skill-Up</p>         {" "}
          </div>
                             {" "}
          <UsersRankingTable
            users={filteredUsers}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onViewProfile={handleViewProfile}
            loading={loading}
          />
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      {selectedUser && (
        <PerfilModal
          user={selectedUser}
          isMyProfile={false}
          onClose={handleCloseProfile}
        />
      )}
            <Footer />   {" "}
    </>
  );
}
