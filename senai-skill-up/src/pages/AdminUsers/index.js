// src/pages/AdminUsers/index.js
import React, { useState, useEffect } from 'react';
import { Header } from '../../components'; // 'Footer' foi removido, pois não era usado (Correção Vercel)
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

  // Carregar usuários (sem alteração)
  useEffect(() => {
    if (isLoggedIn && canManageUsers) {
      loadUsers();
    }
  }, [isLoggedIn, canManageUsers]);

  // Filtrar usuários (sem alteração)
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

  // loadUsers (sem alteração)
  const loadUsers = async () => {
    try {
      setLoading(true);
      const apiUsers = await userService.getAllUsers();
      setUsers(apiUsers);
      setFilteredUsers(apiUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários da API:', error);
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

  // handleDeleteUser (sem alteração)
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.deleteUser(userId);
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

  // ✅ 2. FUNÇÃO 'handleSaveUser' ATUALIZADA
  const handleSaveUser = async (userData) => {
    // 'userData' vem do modal (ex: { nome: '...', email: '...', roleIds: [1, 3] })
    try {
      if (selectedUser) {
        // --- MODO EDIÇÃO ---
        
        // Separa as roles dos dados básicos (nome, email, etc.)
        // Assumindo que o modal envia 'roleIds'
        const { roleIds, ...dadosBasicos } = userData; 

        // 1. Chama o endpoint de dados básicos (PUT /usuarios/{id})
        await userService.updateUser(selectedUser.id, dadosBasicos);

        // 2. Chama o novo endpoint de roles (PUT /usuarios/{id}/roles)
        if (Array.isArray(roleIds)) {
          await userService.updateUserRoles(selectedUser.id, roleIds);
        }

        alert('Usuário atualizado com sucesso!');
        // Recarrega a lista inteira do servidor para garantir dados 100% corretos
        loadUsers(); 

      } else {
        // --- MODO CRIAÇÃO (não muda) ---
        // (Assumindo que o endpoint POST /usuarios já lida com as roles na criação)
        const newUser = await userService.createUser(userData);
        
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

  // handleViewProfile (sem alteração)
  const handleViewProfile = (user) => {
    alert(`Perfil do usuário:\nNome: ${user.nome}\nEmail: ${user.email}\nPontos: ${user.pontos}\nTipo: ${user.tipoUsuario}\nStatus: ${user.status}`);
  };


  // (Resto do JSX e do componente não muda...)

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