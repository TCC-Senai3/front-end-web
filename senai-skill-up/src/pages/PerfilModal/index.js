import React, { useState } from 'react';
import Header from '../../components/header';
import './style.css';
import editIcon from '../../assets/images/Vector.png';
import trophyIcon from '../../assets/images/trophy 1.svg';
import pointsIcon from '../../assets/images/image 33.png';
import bodeIcon from '../../assets/images/bode.svg';
import canetaIcon from '../../assets/images/Caneta bic.svg';
import patoIcon from '../../assets/images/Pato.svg';

export default function PerfilModal({ isMyProfile = true, onClose, user: propUser, isOpen = true }) {
  const [user, setUser] = useState(propUser || {
    name: 'Usuario123',
    email: 'Usuario123@gmail.com',
    status: 'online',
    position: 1,
    points: 1000,
    memberSince: '2024',
    tag: '#123',
    bio: 'texto limitado a uma quantidade de caracteres',
    avatar: null
  });
  
  const avatarOptions = [
    { id: 1, src: bodeIcon, alt: 'Bode' },
    { id: 2, src: canetaIcon, alt: 'Caneta' },
    { id: 3, src: patoIcon, alt: 'Pato' }
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio,
    avatar: user.avatar
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser({ ...user, ...form });
    setIsEditing(false);
    setShowAvatarOptions(false);
  };

  const handleAvatarSelect = (avatarSrc) => {
    setForm(prev => ({ ...prev, avatar: avatarSrc }));
    setShowAvatarOptions(false);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      setShowAvatarOptions(!showAvatarOptions);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="perfil-modal-wrapper">
      <div className="perfil-modal-overlay" onClick={onClose}>
        <div className="perfil-modal-container" onClick={e => e.stopPropagation()}>
          {/* Botão de fechar */}
          <button className="perfil-close-btn" onClick={onClose}>
            ×
          </button>
          
          {/* Ícone de edição - só aparece no meu perfil */}
          {isMyProfile && (
            <div className="perfil-edit-icon" onClick={() => setIsEditing(!isEditing)}>
              <img src={editIcon} alt="Editar" />
            </div>
          )}

          {/* Avatar centralizado */}
          <div className="perfil-avatar-section">
            <div className="perfil-avatar-container">
              <div 
                className={`perfil-avatar ${isEditing ? 'editable' : ''}`}
                onClick={handleAvatarClick}
              >
                {form.avatar ? (
                  <img src={form.avatar} alt={user.name} />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={user.name} />
                )}
                <div className="perfil-status-indicator"></div>
                {isEditing && <div className="avatar-edit-overlay">Mudar</div>}
              </div>
              
              {showAvatarOptions && (
                <div className="avatar-options">
                  {avatarOptions.map((avatar) => (
                    <div 
                      key={avatar.id} 
                      className="avatar-option"
                      onClick={() => handleAvatarSelect(avatar.src)}
                    >
                      <img src={avatar.src} alt={avatar.alt} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isEditing ? (
              <input
                className="perfil-edit-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nome"
              />
            ) : (
              <h3 className="perfil-name">{user.name}</h3>
            )}
          </div>

          {/* Grid de estatísticas 2x2 */}
          <div className="perfil-stats-grid">
            <div className="perfil-stat-card">
              <div className="perfil-stat-icon">
                <img src={trophyIcon} alt="Troféu" />
              </div>
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">POSIÇÃO NO RANKING</span>
                <span className="perfil-stat-value">{user.position}</span>
              </div>
            </div>

            <div className="perfil-stat-card">
              <div className="perfil-stat-icon">
                <img src={pointsIcon} alt="Pontos" />
              </div>
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">PONTOS</span>
                <span className="perfil-stat-value">{user.points}</span>
              </div>
            </div>

            <div className="perfil-stat-card">
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">MEMBRO DESDE</span>
                <span className="perfil-stat-value">{user.memberSince}</span>
              </div>
            </div>

            <div className="perfil-stat-card">
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">BIOGRAFIA</span>
                {isEditing ? (
                  <textarea
                    className="perfil-edit-textarea"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Biografia"
                  />
                ) : (
                  <span className="perfil-stat-bio">{user.bio}</span>
                )}
              </div>
            </div>
          </div>

          {/* Botões de ação - só aparecem no meu perfil */}
          {isMyProfile && isEditing && (
            <div className="perfil-actions">
              <button className="perfil-save-btn" onClick={handleSave}>Salvar</button>
              <button className="perfil-cancel-btn" onClick={() => { setIsEditing(false); setForm({ name: user.name, bio: user.bio }); }}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


