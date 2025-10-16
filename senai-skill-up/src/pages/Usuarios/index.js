import React, { useState } from 'react';
import { Header, Footer, PerfilModal } from '../../components';
import UserManagementTable from '../../components/UsersComponents/UserManagementTable';
import './style.css';

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Dados mockados dos usuários
  const users = [
    {
      id: 1,
      nome: 'Paulo Silva',
      email: 'paulo@gmail.com',
      status: 'online',
      pontos: 9999,
      nivel: 'Diamante',
      avatar: '/assets/images/default-avatar.png'
    },
    {
      id: 2,
      nome: 'Alice Santos',
      email: 'alice@teste.com',
      status: 'online',
      pontos: 1200,
      nivel: 'Ouro',
      avatar: '/assets/images/default-avatar.png'
    },
    {
      id: 3,
      nome: 'Bob Martins',
      email: 'bob@teste.com',
      status: 'offline',
      pontos: 1100,
      nivel: 'Ouro',
      avatar: '/assets/images/default-avatar.png'
    },
    {
      id: 4,
      nome: 'Charlie Costa',
      email: 'charlie@teste.com',
      status: 'online',
      pontos: 800,
      nivel: 'Prata',
      avatar: '/assets/images/default-avatar.png'
    },
    {
      id: 5,
      nome: 'Diana Oliveira',
      email: 'diana@teste.com',
      status: 'offline',
      pontos: 750,
      nivel: 'Prata',
      avatar: '/assets/images/default-avatar.png'
    },
    {
      id: 6,
      nome: 'Eduardo Silva',
      email: 'eduardo@teste.com',
      status: 'online',
      pontos: 600,
      nivel: 'Bronze',
      avatar: '/assets/images/default-avatar.png'
    }
  ];

  // Filtrar usuários por termo de busca
  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      level: user.nivel,
      position: users.findIndex(u => u.id === user.id) + 1,
      gamesPlayed: Math.floor(user.pontos / 10), // Calcular baseado nos pontos
      accuracy: Math.floor(Math.random() * 20) + 80, // Taxa de acerto simulada
      memberSince: '2024-01-15', // Data fictícia
      achievements: [
        { icon: '🏆', name: 'Primeiro Quiz Completado' },
        { icon: '⭐', name: '100 Pontos Alcançados' },
        { icon: '🎯', name: 'Precisão Perfeita' }
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
          
          <UserManagementTable
            users={filteredUsers}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onViewProfile={handleViewProfile}
            loading={false}
            showSearch={true}
            variant="ranking"
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