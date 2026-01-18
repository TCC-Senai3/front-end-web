import React, { useState, useEffect } from 'react';
import Header from '../../../components/header';
import UserManagementTable from '../UserManagementTable';
import UserEditModal from '../UserEditModal';
import userService from '../../../services/userService';
import './style.css';

export default function AdminUserProfile() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const loadUsers = () => {
    setLoading(true);
    userService.getAllUsers()
      .then(apiUsers => {
        setUsers(apiUsers);
        setFilteredUsers(apiUsers);
      })
      .catch(error => {
        console.error('Erro ao carregar usuários da API:', error);
        setUsers([]);
        setFilteredUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
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