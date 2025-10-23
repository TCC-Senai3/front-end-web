import React, { useState, useEffect, useMemo } from 'react';
import { Header, Footer } from '../../components';
import UsersRankingTable from '../../components/UsersComponents/UsersRankingTable';
import PerfilModal from '../PerfilModal';
import userService from '../../services/userService';
import './style.css';

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuários ao montar o componente
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const apiUsers = await userService.getAllUsers();
        setUsers(apiUsers);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filtra os usuários com base no termo de busca
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.nome?.toLowerCase().includes(term) || 
      user.email?.toLowerCase().includes(term) ||
      user.nivel?.toLowerCase().includes(term)
    );
  }, [searchTerm, users]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleViewProfile = (user) => {
    // Adaptar dados do usuário para o formato esperado pelo UserProfile
    const profileData = {
      ...user,
      name: user.nome,
      email: user.email,
      points: user.pontos,
      position: user.rank,
      gamesPlayed: user.jogosJogados,
      accuracy: user.precisao,
      memberSince: user.dataCriacao,
      achievements: [
        { icon: '🏆', name: 'Primeiro Quiz Completado' },
        { icon: '⭐', name: `${Math.floor(user.pontos/1000) * 1000} Pontos Alcançados` },
        { icon: '🎯', name: `Precisão de ${user.precisao}%` },
        { icon: '🏅', name: `Nível ${user.nivel}` }
      ]
    };
    
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