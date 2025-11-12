
import React, { useState, useEffect } from 'react';
import { Header } from '../../components'; 
import UserManagementTable from '../../components/UsersComponents/UserManagementTable';
import UserEditModal from '../../components/UsersComponents/UserEditModal';
import { usePermissions } from '../../hooks/usePermissions';
import userService from '../../services/userService';
import './style.css';

export default function AdminUsers() {
  // ✅ 1. PEGAMOS O 'userData' COMPLETO
  const { userData, isLoggedIn, loading: authLoading } = usePermissions();
  
  // ✅ 2. CRIAMOS NOSSA PRÓPRIA VERIFICAÇÃO (IGNORANDO 'canManageUsers')
  const hasAdminPermission = userData?.roles?.includes('ROLE_ADMIN');

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar usuários
  useEffect(() => {
    // ✅ 3. USAMOS A NOSSA NOVA VERIFICAÇÃO
    if (isLoggedIn && hasAdminPermission) { 
      loadUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, hasAdminPermission]); // Adicionada a dependência

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

  // ✅ 4. USAMOS A NOSSA NOVA VERIFICAÇÃO AQUI
  // (Isso corrige a tela branca)
  if (!isLoggedIn || !hasAdminPermission) {
    // Você pode renderizar 'null' (tela branca) ou um componente de "Não Autorizado"
    // return null; 
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para ver esta página.</p>
      </div>
    );
  }

  // ✅ 5. REMOVIDO O <ProtectedRoute> DUPLICADO
  // A proteção da rota já foi feita pelo App.js (ou pela verificação acima)
  return (
    <>
      <Header />
      <div className="admin-users-container">
        <div className="admin-users-content">
          <div style={{ marginBottom: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong>👤 Usuário logado:</strong> {userData?.nome || 'N/A'} | 
            <strong> Roles:</strong> {userData?.roles?.join(', ') || 'N/A'}
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