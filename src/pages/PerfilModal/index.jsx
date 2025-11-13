import React, { useState, useEffect, useCallback } from 'react';
import './style.css';
import editIcon from '../../assets/images/Vector.png';
import trophyIcon from '../../assets/images/trophy 1.svg';
import pointsIcon from '../../assets/images/image 33.png';
// Importando as imagens de avatar
import bodeIcon from '../../assets/images/bode.svg';
import canetaIcon from '../../assets/images/Caneta bic.svg';
import patoIcon from '../../assets/images/Pato.svg';

import { useAuth } from '../../hooks/useAuth'; 
import userService from '../../services/userService';
import Loader from '../../components/common/Loader'; 
import { useNavigate } from 'react-router-dom';

export default function PerfilModal({ isMyProfile = true, onClose: propOnClose, user: propUser, isOpen = true }) {
  
  const navigate = useNavigate(); 
  
  const [user, setUser] = useState(isMyProfile ? null : propUser);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(isMyProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const { user: authUser } = useAuth();

  // Opções de avatar disponíveis
  const avatarOptions = [
    { id: 1, src: bodeIcon, alt: 'Bode' },
    { id: 2, src: canetaIcon, alt: 'Caneta' },
    { id: 3, src: patoIcon, alt: 'Pato' }
  ];
  
  // ✅ 2. ESTABILIZAR A FUNÇÃO COM useCallback
  // Isso garante que a função não seja recriada em cada renderização
  const handleCloseAndNavigate = useCallback(() => {
    if (propOnClose) {
      propOnClose(); 
    }
    navigate('/game');
  }, [navigate, propOnClose]); // Dependências do useCallback

  // --- GOAL 1: BUSCAR DADOS (GET /me) ---
  useEffect(() => {
    const fetchMyData = async () => {
      if (!isOpen) return; 
      setLoading(true);
      try {
        const myData = await userService.getMeuPerfil();
        const mappedData = {
          ...myData, 
          name: myData.nome,
          points: myData.pontuacao,
          bio: myData.biografia || 'Sem biografia.',
          position: myData.rank, 
          memberSince: myData.dataCriacao ? new Date(myData.dataCriacao).getFullYear() : 'N/A' 
        };
        setUser(mappedData);
      } catch (error) {
        console.error("Erro ao buscar meu perfil:", error);
        alert("Não foi possível carregar seu perfil.");
        handleCloseAndNavigate(); // Agora é seguro chamar
      } finally {
        setLoading(false);
      }
    };

    if (isMyProfile) {
      fetchMyData();
    } else {
      setUser(propUser);
      setLoading(false);
    }
  
  // ✅ 3. ADICIONAR A FUNÇÃO E CORRIGIR A PROP NO ARRAY DE DEPENDÊNCIAS
  }, [isMyProfile, propUser, isOpen, propOnClose, handleCloseAndNavigate]); 


  // --- FUNÇÕES DE EDIÇÃO ---
  // (O resto do arquivo não muda)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setForm({ 
      name: user.name, 
      bio: user.bio || '',
      avatar: user.avatar || ''
    });
    setIsEditing(true);
    setShowAvatarOptions(false);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      setShowAvatarOptions(!showAvatarOptions);
    }
  };

  const handleAvatarSelect = (avatarSrc) => {
    setForm(prev => ({ ...prev, avatar: avatarSrc }));
    setShowAvatarOptions(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!authUser) {
      alert("Erro: Você não está autenticado.");
      return;
    }
    
    if (!form.name.trim()) {
      alert("O nome não pode estar vazio.");
      return;
    }
    
    setIsSaving(true);
    try {
      const payload = {
        nome: form.name,
        biografia: form.bio,
        avatar: form.avatar
      };
      
      await userService.updateBiografia(authUser.id, payload);
      
      setUser({ 
        ...user, 
        name: form.name,
        bio: form.bio,
        avatar: form.avatar
      });
      
      setIsEditing(false);
      setShowAvatarOptions(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDERIZAÇÃO ---
  if (!isOpen) return null;

  if (loading || !user) {
    return (
      <div className="perfil-modal-wrapper">
        <div className="perfil-modal-overlay" onClick={handleCloseAndNavigate}>
          <div className="perfil-modal-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={e => e.stopPropagation()}>
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-modal-wrapper">
      <div className="perfil-modal-overlay" onClick={handleCloseAndNavigate}>
        <div className="perfil-modal-container" onClick={e => e.stopPropagation()}>
          <button className="perfil-close-btn" onClick={handleCloseAndNavigate}>×</button>
          
          {isMyProfile && !isEditing && (
            <div className="perfil-edit-icon" onClick={handleEdit}>
              <img src={editIcon} alt="Editar" />
            </div>
          )}

          <div className="perfil-avatar-section">
            <div className="perfil-avatar-container">
              <div 
                className={`perfil-avatar ${isEditing ? 'editable' : ''}`}
                onClick={handleAvatarClick}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                {isEditing && <div className="avatar-edit-overlay">Mudar</div>}
                <div className={`perfil-status-indicator ${user.online ? 'online' : 'offline'}`}></div>
              </div>
              
              {showAvatarOptions && (
                <div className="avatar-options">
                  {avatarOptions.map((avatar) => (
                    <div 
                      key={avatar.id}
                      className={`avatar-option ${form.avatar === avatar.src ? 'selected' : ''}`}
                      onClick={() => handleAvatarSelect(avatar.src)}
                    >
                      <img src={avatar.src} alt={avatar.alt} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="perfil-edit-name-container">
                <input
                  className="perfil-edit-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                  maxLength={50}
                />
                <span className="character-count">{form.name.length}/50</span>
              </div>
            ) : (
              <h3 className="perfil-name">{user.name}</h3>
            )}
          </div>

          <div className="perfil-stats-grid">
            {/* ... (o resto do seu JSX não muda) ... */}
            <div className="perfil-stat-card">
              <div className="perfil-stat-icon"><img src={trophyIcon} alt="Troféu" /></div>
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">POSIÇÃO NO RANKING</span>
                <span className="perfil-stat-value">{user.position || 'N/A'}</span>
              </div>
            </div>

            <div className="perfil-stat-card">
              <div className="perfil-stat-icon"><img src={pointsIcon} alt="Pontos" /></div>
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">PONTOS</span>
                <span className="perfil-stat-value">{user.points || 0}</span>
              </div>
            </div>

            <div className="perfil-stat-card">
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">MEMBRO DESDE</span>
                <span className="perfil-stat-value">{user.memberSince || 'N/A'}</span>
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
                    disabled={isSaving}
                  />
                ) : (
                  <span className="perfil-stat-bio">{user.bio}</span>
                )}
              </div>
            </div>
          </div>

          {isMyProfile && isEditing && (
            <div className="perfil-actions">
              <button className="perfil-save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
              <button className="perfil-cancel-btn" onClick={handleCancel} disabled={isSaving}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}