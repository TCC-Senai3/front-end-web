// src/pages/AdminUsers/index.js
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components'; 
import UserManagementTable from '../../components/UsersComponents/UserManagementTable';
import UserEditModal from '../../components/UsersComponents/UserEditModal';
import { usePermissions } from '../../hooks/usePermissions';
import userService from '../../services/userService';
import './style.css';

export default function AdminUsers() {
  // ✅ 1. A CORREÇÃO FINAL:
  // O seu hook 'usePermissions.js' já nos dá a resposta.
  // Pegamos o 'user' (para o nome) e o booleano 'isAdmin'.
  const { user, isLoggedIn, loading: authLoading, isAdmin } = usePermissions();
  
  // ✅ 2. A VERIFICAÇÃO (agora super simples)
  // 'isAdmin' já é true ou false.
  const hasAdminPermission = isAdmin;

  // (O resto do seu código não precisa de quase nenhuma mudança)
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
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
  }, []); 

  // Carregar usuários
  useEffect(() => {
    if (isLoggedIn && hasAdminPermission) { 
      loadUsers();
    }
  }, [isLoggedIn, hasAdminPermission, loadUsers]); 

  // Filtrar usuários
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(userItem => 
        userItem.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEditUser = (userToEdit) => { 
    setSelectedUser(userToEdit);
    setIsEditModalOpen(true);
  };

  // handleDeleteUser
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.deleteUser(userId);
        loadUsers(); 
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário. Tente novamente.');
      }
    }
  };

  // handleSaveUser
  const handleSaveUser = async (userDataToSave) => { 
    try {
      if (selectedUser) {
        const { roleIds, ...dadosBasicos } = userDataToSave; 
        await userService.updateUser(selectedUser.id, dadosBasicos);
        if (Array.isArray(roleIds)) {
          await userService.updateUserRoles(selectedUser.id, roleIds);
        }
        alert('Usuário atualizado com sucesso!');
        loadUsers(); 
      } else {
        const newUser = await userService.createUser(userDataToSave);
        setUsers(prevUsers => [...prevUsers, newUser]); 
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

  // handleViewProfile
  const handleViewProfile = (userToView) => { 
    const rolesStr = Array.isArray(userToView.roles) ? userToView.roles.join(', ') : (userToView.permissoes || 'N/A');
    alert(`Perfil do usuário:\nNome: ${userToView.nome}\nEmail: ${userToView.email}\nPermissão: ${rolesStr}\nStatus: ${userToView.online ? 'Online' : 'Offline'}`);
  };

  // --- Verificações de Renderização ---

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

  // A CHECAGEM DE ACESSO
  if (!isLoggedIn || !hasAdminPermission) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif', 
        color: '#333' 
      }}>
        <h1>Acesso Negado</h1>
        <p>Você não tem as permissões de Administrador necessárias.</p>
      </div>
    );
  }

  // Se passou, renderiza a página
  return (
    <>
      <Header />
      <div className="admin-users-container">
        <div className="admin-users-content">
          <div style={{ marginBottom: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong>👤 Usuário logado:</strong> {user?.nome || 'N/A'} | 
            <strong> Permissão:</strong> {user?.permissoes || user?.roles?.join(', ') || 'N/A'}
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
    </>
  );
}