// src/pages/AdminUsers/index.js
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components'; 
import UserManagementTable from '../../components/UsersComponents/UserManagementTable';
import UserEditModal from '../../components/UsersComponents/UserEditModal';
import { usePermissions } from '../../hooks/usePermissions';
import userService from '../../services/userService';
import './style.css';

export default function AdminUsers() {
  const { user, isLoggedIn, loading: authLoading, isAdmin } = usePermissions();
  const hasAdminPermission = isAdmin;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ FUNÇÃO DE CARREGAMENTO COM CORREÇÃO VISUAL
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const apiUsers = await userService.getAllUsers();

      // --- TRATAMENTO DE DADOS ---
      const formattedUsers = apiUsers.map(user => {
        
        // 1. Formatar Permissões
        let roleDisplay = 'Usuário'; // Padrão
        
        if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
          // Mapeia o array para extrair os nomes e remover o prefixo 'ROLE_'
          const roleNames = user.roles.map(r => {
            if (typeof r === 'object' && (r.name || r.authority)) {
              return (r.name || r.authority).replace('ROLE_', '');
            }
            return String(r).replace('ROLE_', '');
          });
          
          roleDisplay = roleNames.join(', '); 
        } else if (user.permissoes) {
          roleDisplay = user.permissoes;
        }

        // 2. Formatar Status Online
        const isOnline = !!user.online;

        return {
          ...user,
          permissoes: roleDisplay, 
          role: roleDisplay,       
          online: isOnline
        };
      });
      // ---------------------------

      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários da API:', error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (isLoggedIn && hasAdminPermission) { 
      loadUsers();
    }
  }, [isLoggedIn, hasAdminPermission, loadUsers]); 

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(userItem => 
        (userItem.nome && userItem.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (userItem.email && userItem.email.toLowerCase().includes(searchTerm.toLowerCase()))
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

  // ❌ A função handleDeleteUser foi removida daqui

  const handleSaveUser = async (roleIds) => { 
    try {
      if (selectedUser) {
        // Atualiza apenas as ROLES chamando o endpoint específico
        if (Array.isArray(roleIds)) {
          await userService.updateUserRoles(selectedUser.id, roleIds);
        }
        alert('Permissões do usuário atualizadas com sucesso!');
        loadUsers(); 
      } 
      
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
      alert('Erro ao salvar permissões. Tente novamente.');
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleViewProfile = (userToView) => { 
    const rolesStr = userToView.permissoes || 'N/A';
    alert(`Perfil do usuário:\nNome: ${userToView.nome}\nEmail: ${userToView.email}\nPermissão: ${rolesStr}\nStatus: ${userToView.online ? 'Online' : 'Offline'}`);
  };

  // --- Renderização ---

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

  return (
    <>
      <Header />
      <div className="admin-users-container">
        <div className="admin-users-content">
          <div style={{ marginBottom: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong>👤 Usuário logado:</strong> {user?.nome || 'N/A'} | 
            <strong> Permissão:</strong> {
              Array.isArray(user?.roles) 
                ? user.roles.map(r => (typeof r === 'string' ? r : r.name)).join(', ').replace(/ROLE_/g, '') 
                : (user?.permissoes || 'N/A')
            }
          </div>
          
          <UserManagementTable
            users={filteredUsers}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onViewProfile={handleViewProfile}
            onEditUser={handleEditUser}
            loading={loading}
            // ❌ A prop onDeleteUser foi removida daqui
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