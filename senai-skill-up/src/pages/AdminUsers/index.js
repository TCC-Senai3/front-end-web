import React, { useState, useEffect } from 'react';
import { Header, Footer } from '../../components';
import UserManagementTable from '../../components/UsersComponents/UserManagementTable';
import UserEditModal from '../../components/UsersComponents/UserEditModal';
import ProtectedRoute from '../../components/ProtectedRoute';
import { usePermissions } from '../../hooks/usePermissions';
import userService from '../../services/userService';
import './style.css';

export default function AdminUsers() {
  const { canManageUsers, userData, isLoggedIn, loading: authLoading } = usePermissions();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  // Carregar usuários ao montar o componente
  useEffect(() => {
    if (isLoggedIn && canManageUsers) {
      loadUsers();
    }
  }, [isLoggedIn, canManageUsers]);

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
      const apiUsers = await userService.getAllUsers();
      setUsers(apiUsers);
      setFilteredUsers(apiUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários da API:', error);
      // Set empty arrays instead of mock data
      setUsers([]);
      setFilteredUsers([]);
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


  // Se ainda está carregando a autenticação, mostrar loading
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Verificando permissões...
      </div>
    );
  }

  // Se não está logado ou não tem permissão, não renderizar nada
  if (!isLoggedIn || !canManageUsers) {
    return null;
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Header />
      <div className="admin-users-container">
        <div className="admin-users-content">
          <div style={{ marginBottom: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong>👤 Usuário logado:</strong> {userData?.nome || 'N/A'} | 
            <strong> Tipo:</strong> {userData?.tipoUsuario || 'N/A'} | 
            <strong> Permissões:</strong> {userData?.permissoes || 'N/A'}
          </div>
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
    </ProtectedRoute>
  );
}
