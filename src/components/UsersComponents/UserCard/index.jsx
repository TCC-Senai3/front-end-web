import React from 'react';
import './style.css';

export default function UserCard({ user, isCurrentUser, onViewProfile }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#28a745';
      case 'offline': return '#6c757d';
      case 'busy': return '#dc3545';
      default: return '#28a745';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'busy': return 'Ocupado';
      default: return 'Online';
    }
  };

  return (
    <div className={`user-card ${isCurrentUser ? 'current-user' : ''}`}>
      {/* 1. Foto do usuário */}
      <div className="user-avatar">
        <img src={user.avatar} alt={user.name} />
      </div>
      
      {/* 2. Quantidade de pontos */}
      <div className="user-points">
        <span className="points-value">{user.points.toLocaleString()}</span>
      </div>
      
      {/* 3. Nome */}
      <div className="user-name">
        <h3>{user.name}</h3>
      </div>
      
      {/* 4. Posição do rank */}
      <div className="user-rank">
        <span>#{user.position}</span>
      </div>
      
      {/* 5. Bola indicando on/off */}
      <div className="user-status">
        <div 
          className="status-indicator" 
          style={{ backgroundColor: getStatusColor(user.status) }}
          title={getStatusText(user.status)}
        ></div>
      </div>

      {/* Botão visualizar perfil */}
      <div className="user-action">
        <button 
          className="view-profile-btn"
          onClick={() => onViewProfile(user)}
        >
          VISUALIZAR PERFIL
        </button>
      </div>
    </div>
  );
}
