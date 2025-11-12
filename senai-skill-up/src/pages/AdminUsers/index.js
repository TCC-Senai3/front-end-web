import React, { useState, useEffect } from 'react';
import { Header } from '../../components'; 
import UserManagementTable from '../../components/UsersComponents/UserManagementTable';
import UserEditModal from '../../components/UsersComponents/UserEditModal';
import { usePermissions } from '../../hooks/usePermissions';
import userService from '../../services/userService';
import './style.css';

export default function AdminUsers() {
  const { userData, isLoggedIn, loading: authLoading } = usePermissions();
  
  // ✅ A CORREÇÃO ESTÁ AQUI:
  // Trocamos a checagem de 'roles' (array) para 'permissoes' (string)
  // para bater com o resto do seu app (como o App.js e o UserEditModal).
  const hasAdminPermission = userData?.permissoes === 'ADM' || userData?.permissoes === 'ADMINISTRADOR';

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar usuários
  useEffect(() => {
    // Usamos a nova verificação
    if (isLoggedIn && hasAdminPermission) { 
      loadUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, hasAdminPermission]); 

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

  // handleSaveUser (Exatamente como fizemos na etapa anterior)
  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        const { roleIds, ...dadosBasicos } = userData; 

        await userService.updateUser(selectedUser.id, dadosBasicos);

        if (Array.isArray(roleIds)) {
          await userService.updateUserRoles(selectedUser.id, roleIds);
        }

        alert('Usuário atualizado com sucesso!');
        loadUsers(); 

      } else {
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

  // Usamos a nova verificação
  if (!isLoggedIn || !hasAdminPermission) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif', 
        color: '#333' 
      }}>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para ver esta página.</p>
      </div>
    );
  }

  // (O resto do JSX não muda)
  return (
    <>
      <Header />
      <div className="admin-users-container">
        <div className="admin-users-content">
          <div style={{ marginBottom: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong>👤 Usuário logado:</strong> {userData?.nome || 'N/A'} | 
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
    </>
  );
}