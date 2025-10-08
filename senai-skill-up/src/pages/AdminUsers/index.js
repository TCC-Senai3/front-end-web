import React, { useState, useEffect } from 'react';
import { Header, Footer, MeioFooter } from '../../components';
import UserManagementTable from '../../components/UsersComponents/UserManagementTable';
import UserEditModal from '../../components/UsersComponents/UserEditModal';
import userService from '../../services/userService';
import './style.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dados mockados dos usuários (para desenvolvimento)
  const mockUsers = [
    {
      id: 1,
      nome: 'SENAISK....',
      email: 'admin@senai.com',
      status: 'online',
      permissoes: 'ADM',
      tipoUsuario: 'ADMINISTRADOR',
      dataCriacao: '2024-01-15',
      ultimoAcesso: '2024-12-19',
      pontos: 15420,
      nivel: 'Diamante',
      jogosJogados: 127,
      precisao: 94
    },
    {
      id: 2,
      nome: 'USERADM',
      email: 'useradm@senai.com',
      status: 'online',
      permissoes: 'ADM',
      tipoUsuario: 'ADMINISTRADOR',
      dataCriacao: '2024-02-10',
      ultimoAcesso: '2024-12-19',
      pontos: 12850,
      nivel: 'Ouro',
      jogosJogados: 98,
      precisao: 89
    },
    {
      id: 3,
      nome: 'SENAISK....',
      email: 'skillup@senai.com',
      status: 'offline',
      permissoes: 'CRIADOR',
      tipoUsuario: 'CRIADOR',
      dataCriacao: '2024-03-05',
      ultimoAcesso: '2024-12-18',
      pontos: 11200,
      nivel: 'Ouro',
      jogosJogados: 85,
      precisao: 87
    },
    {
      id: 4,
      nome: 'USERADM',
      email: 'user2@senai.com',
      status: 'offline',
      permissoes: 'USER',
      tipoUsuario: 'USUARIO',
      dataCriacao: '2024-04-20',
      ultimoAcesso: '2024-12-17',
      pontos: 9850,
      nivel: 'Prata',
      jogosJogados: 72,
      precisao: 82
    }
  ];

  // Carregar usuários ao montar o componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuários baseado no termo de busca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Tentar carregar da API primeiro
      const apiUsers = await userService.getAllUsers();
      setUsers(apiUsers);
      setFilteredUsers(apiUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários da API, usando dados mockados:', error);
      // Em caso de erro, usar dados mockados
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.deleteUser(userId);
        
        // Atualizar lista local
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário. Tente novamente.');
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Editar usuário existente
        const updatedUser = await userService.updateUser(selectedUser.id, userData);
        
        // Atualizar lista local
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        
        alert('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        const newUser = await userService.createUser(userData);
        
        // Adicionar à lista local
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        
        alert('Usuário criado com sucesso!');
      }
      
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário. Tente novamente.');
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleViewProfile = (user) => {
    // Por enquanto, apenas mostra informações do usuário
    alert(`Perfil do usuário:\nNome: ${user.nome}\nEmail: ${user.email}\nPontos: ${user.pontos}\nTipo: ${user.tipoUsuario}\nStatus: ${user.status}`);
  };


  return (
    <>
      <Header />
      <div className="admin-users-container">
        <div className="admin-users-content">
          <UserManagementTable
            users={filteredUsers}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onViewProfile={handleViewProfile}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            loading={loading}
          />
        </div>
      </div>

      {isEditModalOpen && (
        <UserEditModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={handleCloseModal}
        />
      )}

      
    </>
  );
}
