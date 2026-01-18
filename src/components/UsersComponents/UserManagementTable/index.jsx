import React from 'react';
import './style.css';

export default function UserManagementTable({
  users,
  searchTerm,
  onSearch,
  onViewProfile,
  onEditUser,
  // onDeleteUser, // ❌ Prop removida pois não é mais usada
  loading,
  showSearch = true
}) {

  const getPermissionClass = (permission) => {
    switch (permission?.toUpperCase()) {
      case 'ADM':
      case 'ADMINISTRADOR':
        return 'admin-badge';
      case 'CRIADOR':
        return 'creator-badge';
      case 'USER':
      case 'USUARIO':
        return 'user-badge';
      default:
        return 'default-badge';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      {/* Barra de busca */}
      {showSearch && (
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho da tabela */}
      <div className="table-header">
        <div className="header-cell">Nome</div>
        <div className="header-cell">Email</div>
        <div className="header-cell">Status</div>
        <div className="header-cell">Permissões</div>
        <div className="header-cell">Ações</div>
      </div>

      {/* Lista de usuários */}
      <div className="users-list">
        {users.length === 0 ? (
          <div className="no-users">
            <p>Nenhum usuário encontrado</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="user-row">
              <div className="user-cell">
                <span className="user-name-large">{user.nome}</span>
              </div>
              <div className="user-cell">
                <span className="user-email-large">{user.email}</span>
              </div>
              <div className="user-cell">
                <div className="status-indicator">
                  {/* ✅ Lógica ajustada: usa !user.online para definir se é offline */}
                  <div
                    className={`status-dot-only ${!user.online ? 'offline' : ''}`}
                    title={user.online ? 'Online' : 'Offline'}
                  ></div>
                </div>
              </div>
              <div className="user-cell">
                <span className={`permission-badge ${getPermissionClass(user.permissoes)}`}>
                  {user.permissoes || 'USUÁRIO'}
                </span>
              </div>
              <div className="user-cell actions-cell">
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEditUser && onEditUser(user)}
                  title="Editar usuário"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}