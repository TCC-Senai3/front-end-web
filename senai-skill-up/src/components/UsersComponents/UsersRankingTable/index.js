import React from 'react';
import './style.css';

export default function UsersRankingTable({
  users,
  searchTerm,
  onSearch,
  onViewProfile,
  loading,
}) {
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="users-ranking-container">
      {/* Seção de ações - fixa no topo */}
      <div className="actions-section">
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                  stroke="#718096"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          {/* (Botões de ação como Atualizar/Exportar) */}
        </div>
      </div>

      {/* Tabela de ranking */}
      <div className="table-wrapper">
        <div className="table-responsive">
          <div className="ranking-table">
            {/* Cabeçalho da tabela */}
            <div className="table-header">
              <div className="header-cell header-pontos">Pontos</div>
              <div className="header-cell header-nome">Nome</div>
              <div className="header-cell header-posicao">Posição</div>
              <div className="header-cell header-status">Status</div>
              <div className="header-cell header-perfil">Ações</div>
            </div>

            {/* Lista de usuários */}
            <div className="users-list">
              {users.length === 0 ? (
                <div className="no-users">
                  <p>Nenhum usuário encontrado</p>
                </div>
              ) : (
                users.map((user) => ( // Removido 'index' pois 'user.rank' vem do pai
                  <div
                    key={user.id}
                    className="user-row user-card"
                    onClick={() => onViewProfile && onViewProfile(user)}
                    style={{ cursor: "pointer" }}
                    title="Clique para ver o perfil"
                  >
                    <div className="user-cell user-points">
                      {/* Lê 'pontuacao' (do DTO) ou 'pontos' (fallback) */}
                      <span className="points-value">
                        {user.pontuacao || user.pontos || 0}
                      </span>
                    </div>
                    
                    <div className="user-cell user-info">
                      <span className="user-name">{user.nome}</span>
                    </div>
                    
                    <div className="user-cell">
                      {/* ✅ CORRIGIDO: Usa 'user.rank' (vindo do componente pai) */}
                      <span className="user-rank">{user.rank}°</span>
                    </div>
                    
                    <div className="user-cell">
                      <div className="status-indicator">
                        <div
                          // ✅ CORRIGIDO: Lê o booleano 'user.online'
                          className={`status-dot user-status ${
                            user.online ? "online" : "offline"
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="user-cell actions-cell">
                      <button
                        className="user-profile-access-trigger view-profile-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProfile && onViewProfile(user);
                        }}
                        title="Ver perfil"
                      >
                        VISUALIZAR PERFIL
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}