import React, { useState, useEffect, useMemo } from "react";
import { Header, Footer } from "../../components";
import UsersRankingTable from "../../components/UsersComponents/UsersRankingTable";
import PerfilModal from "../PerfilModal";
import rankingService from "../../services/rankingService"; 
import "./style.css";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const loadUsers = async () => {
      if (!isMounted) return;
      setLoading(true);
      setError(null);
      
      try {
        const apiUsers = await rankingService.getRankingGlobal(); 
        
        if (!isMounted) return;
        
        const usersWithRank = apiUsers.map((user, index) => ({
          ...user,
          nome: user.nomeUsuario, 
          pontuacao: user.pontuacao,
          rank: index + 1,
        }));
        
        setUsers(usersWithRank);
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
        if (isMounted) {
          setError(error.message || 'Erro ao carregar o ranking');
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadUsers();
    
    return () => { isMounted = false; };
  }, [retryCount]);
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm?.trim()) return users;
    const term = (searchTerm || '').toLowerCase();
    
    return users.filter((user) => {
      if (!user) return false;
      const nome = (user.nome || user.nomeUsuario || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return nome.includes(term) || email.includes(term);
    });
  }, [searchTerm, users]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // --- CORREÇÃO AQUI ---
  const handleViewProfile = (user) => {
    // 'user' é o DTO de Ranking (com nomeUsuario, pontuacao, avatar, idUsuario)
    
    const profileData = {
      ...user, 
      
      // ✅ A LINHA QUE FALTAVA:
      // O Modal espera 'id', mas o rankingService manda 'idUsuario'
      id: user.idUsuario || user.id, // Garante que o ID seja passado
      
      name: user.nomeUsuario,
      email: user.email,
      points: user.pontuacao, 
      position: user.rank,
      bio: user.biografia || 'Sem biografia.', 
      memberSince: user.dataCriacao 
        ? new Date(user.dataCriacao).getFullYear() 
        : "N/A",
    };
    
    console.log("Abrindo modal com estes dados:", profileData); // Log para debug
    setSelectedUser(profileData);
  };

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
          user={selectedUser} 
          isMyProfile={false}
          onClose={handleCloseProfile}
        />
      )}

      <Footer />
    </>
  );
}