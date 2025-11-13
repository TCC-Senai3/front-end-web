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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Carregar usuários ao montar o componente ou quando retryCount mudar
  useEffect(() => {
    let isMounted = true;
    
    const loadUsers = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const apiUsers = await userService.getAllUsers();
        
        if (!isMounted) return;
        
        // Ordena por pontuação (maior para menor)
        const sortedUsers = [...apiUsers].sort((a, b) => 
          (b.pontuacao || 0) - (a.pontuacao || 0)
        );
        
        // Adiciona ranking
        const usersWithRank = sortedUsers.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));
        
        setUsers(usersWithRank);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        if (isMounted) {
          setError(error.message || 'Erro ao carregar a lista de usuários');
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadUsers();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [retryCount]);
  
  // Função para tentar recarregar os usuários
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Filtra os usuários
  const filteredUsers = useMemo(() => {
    if (!searchTerm?.trim()) return users;
    
    const term = (searchTerm || '').toLowerCase();
    
    return users.filter((user) => {
      if (!user) return false;
      
      const nome = (user.nome || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      
      return nome.includes(term) || email.includes(term);
    });
  }, [searchTerm, users]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // --- handleViewProfile (CORRIGIDO) ---
  const handleViewProfile = (user) => {
    // 'user' é o objeto do DTO (com 'biografia', 'pontuacao', etc.)
    const profileData = {
      ...user, 
      name: user.nome,
      email: user.email,
      points: user.pontuacao, 
      position: user.rank,
      
      // ✅ A CORREÇÃO ESTÁ AQUI:
      // Mapeia 'biografia' (do DTO) para 'bio' (que o Modal espera)
      bio: user.biografia || 'Sem biografia.', 
      
      memberSince: user.dataCriacao 
        ? new Date(user.dataCriacao).getFullYear() 
        : "N/A",
        
      gamesPlayed: user.jogosJogados || 0,
      accuracy: user.precisao || 0,
      
      achievements: [
        { icon: "🏆", name: "Primeiro Quiz Completado" },
        {
          icon: "⭐",
          name: `${
            Math.floor((user.pontuacao || 0) / 1000) * 1000
          } Pontos Alcançados`,
        },
        { icon: "🎯", name: `Precisão de ${user.precisao || 0}%` },
        { icon: "🏅", name: `Nível ${user.nivel || 1}` },
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
      <Header />
      <div className="usuarios-container">
        <div className="usuarios-content">
          <div className="usuarios-header">
            <h1>Ranking de Usuários</h1>
            <p>Veja o desempenho dos usuários do SENAI Skill-Up</p>
          </div>

          <UsersRankingTable
            users={filteredUsers}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onViewProfile={handleViewProfile}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        </div>
      </div>

      {selectedUser && (
        <PerfilModal
          user={selectedUser} // Agora 'selectedUser' contém o campo 'bio'
          isMyProfile={false}
          onClose={handleCloseProfile}
        />
      )}

      <Footer />
    </>
  );
}