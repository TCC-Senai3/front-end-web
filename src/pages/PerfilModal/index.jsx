import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./style.css";
import editIcon from "../../assets/images/Vector.png";
import trophyIcon from "../../assets/images/trophy 1.svg";
import pointsIcon from "../../assets/images/image 33.png";

import userProfileImage from "../../assets/images/user-profile1.png";
import bodeIcon from "../../assets/images/bode.svg";
import canetaIcon from "../../assets/images/Canetabic.svg";
import patoIcon from "../../assets/images/Pato.svg";

import { useAuth } from "../../hooks/useAuth";
import userService from "../../services/userService";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";

export default function PerfilModal({
  isMyProfile = true,
  onClose: propOnClose,
  user: propUser,
  isOpen = true,
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const { user: authUser } = useAuth();

  // --- Avatares ---
  const avatarMap = {
    "bode.svg": bodeIcon,
    "bode": bodeIcon,
    "Canetabic.svg": canetaIcon,
    "caneta": canetaIcon,
    "Pato.svg": patoIcon,
    "pato": patoIcon,
  };
    
  // Adicionado função de limpeza de hash (necessária caso o usuário venha com o hash)
  const cleanAvatarName = (avatarString) => {
      if (!avatarString) return null;
      let name = avatarString.trim();
      const viteHashPattern = /(\-[a-zA-Z0-9]+)(\.[^/.]+)$/;
      const cleanedName = name.replace(viteHashPattern, '$2');
      return cleanedName || name;
  };

  // Mapeamento de Opções: Garantindo que a chave/ID seja o nome que queremos salvar no BD.
  const avatarOptions = [
    // Chave para salvar no BD: 'bode.svg' ou 'bode'
    { key: "bode.svg", src: bodeIcon, alt: "Bode" },
    { key: "Canetabic.svg", src: canetaIcon, alt: "Caneta" },
    { key: "Pato.svg", src: patoIcon, alt: "Pato" },
  ];

  const handleCloseAndNavigate = useCallback(() => {
    if (propOnClose) {
      propOnClose();
    } else {
      navigate("/game");
    }
  }, [navigate, propOnClose]);

  // --- Buscar dados ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchedUserData;

        if (isMyProfile) {
          const myData = await userService.getMeuPerfil();
          fetchedUserData = {
            ...myData,
            name: myData.nome || "Usuário",
            points: myData.pontuacao || 0,
            bio: myData.biografia?.trim() || "Sem biografia.",
            // Limpeza de avatar aqui para garantir que o formulário comece com a chave correta
            avatar: cleanAvatarName(myData.avatar?.trim()) || "",
            position: myData.rank || "N/A",
            memberSince: myData.dataCriacao ? new Date(myData.dataCriacao).getFullYear() : "N/A",
            online: myData.online || false,
          };
        } else if (propUser) {
          // Sempre busca os dados completos do servidor, mesmo quando propUser é passado
          const userId = propUser.id || propUser.idUsuario || propUser.id;
          if (userId) {
            const userData = await userService.getUserById(userId);
            fetchedUserData = {
              ...userData,
              name: userData.nome || "Usuário",
              points: userData.pontuacao || 0,
              bio: userData.biografia?.trim() || "Sem biografia.",
              // Limpeza de avatar para outros usuários
              avatar: cleanAvatarName(userData.avatar?.trim()) || "",
              position: userData.rank || "N/A",
              memberSince: userData.dataCriacao ? new Date(userData.dataCriacao).getFullYear() : "N/A",
              online: userData.online || false,
            };
          } else {
            throw new Error("ID do usuário não encontrado");
          }
        } else {
          throw new Error("Dados do usuário não fornecidos");
        }

        setUser(fetchedUserData);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        alert("Não foi possível carregar as informações do usuário.");
        handleCloseAndNavigate();
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isMyProfile, propUser, isOpen, handleCloseAndNavigate]);

  // --- Editar e salvar ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    // Garante que o avatar seja inicializado corretamente
    const avatarInicial = cleanAvatarName(user.avatar?.trim()) || user.avatar || "";
    setForm({
      name: user.name,
      bio: user.bio || "",
      avatar: avatarInicial, // O valor no estado 'user' já está limpo
    });
    setIsEditing(true);
  };

  // ****** CORREÇÃO APLICADA AQUI ******
  const handleAvatarSelect = (key) => {
    // Salvamos APENAS a chave (Ex: 'Pato.svg') no estado do formulário.
    // Isso é o que será enviado para a API/BD.
    setForm((prev) => ({ ...prev, avatar: key }));
    setShowAvatarOptions(false);
  };

  const handleSave = async () => {
    if (!authUser) return alert("Você não está autenticado.");

    setIsSaving(true);
    try {
      const updates = [];

      // Atualizar biografia
      if (form.bio !== user.bio) {
        updates.push(userService.updateBiografia(authUser.id, { biografia: form.bio }));
      }

      // Atualizar avatar
      // form.avatar contém a string limpa (ex: 'Pato.svg')
      if (form.avatar !== user.avatar) {
        updates.push(userService.updateAvatar(authUser.id, { avatar: form.avatar }));
      }

      // Aguarda as atualizações
      await Promise.all(updates);

      // Atualiza os dados no estado local (mantém o nome original, não atualiza)
      setUser({ ...user, bio: form.bio, avatar: form.avatar });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Não foi possível salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // --- Puxar avatar corretamente ---
  // Se estiver editando, usa o avatar do form (preview imediato), senão usa o do user
  const avatarKeyParaExibir = isEditing && form.avatar 
    ? form.avatar 
    : cleanAvatarName(user?.avatar?.trim());
  const avatarSrc = avatarMap[avatarKeyParaExibir] || avatarMap[avatarKeyParaExibir?.replace(/\.[^/.]+$/, "")] || userProfileImage;

  const modalContent = (
    <div className="perfil-modal-wrapper">
      <div className="perfil-modal-overlay" onClick={handleCloseAndNavigate}>
        <div className="perfil-modal-container" onClick={(e) => e.stopPropagation()}>
          {loading || !user ? (
            <Loader />
          ) : (
            <>
          <button className="perfil-close-btn" onClick={handleCloseAndNavigate}>
            ×
          </button>

          {isMyProfile && !isEditing && (
            <div className="perfil-edit-icon" onClick={handleEdit}>
              <img src={editIcon} alt="Editar" />
            </div>
          )}

          {/* Avatar */}
          <div className="perfil-avatar-section">
            <div className="perfil-avatar-container">
              <div
                className={`perfil-avatar ${isEditing ? "editable" : ""}`}
                onClick={() => isEditing && setShowAvatarOptions(!showAvatarOptions)} // Só permite abrir se estiver editando
              >
                <img src={avatarSrc} alt={user?.name || "Usuário"} className="avatar-image" />
                {isEditing && <div className="avatar-edit-overlay">Mudar</div>}
                <div className={`perfil-status-indicator ${user?.online ? "online" : "offline"}`}></div>
              </div>

              {showAvatarOptions && (
                <div className="avatar-options">
                  {avatarOptions.map((avatar) => (
                    <div
                      key={avatar.key}
                      className={`avatar-option ${form.avatar === avatar.key || form.avatar === avatar.key.replace(/\.[^/.]+$/, "") ? "selected" : ""}`}
                      // Passa a CHAVE para a função
                      onClick={() => handleAvatarSelect(avatar.key)} 
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
                  readOnly
                  disabled
                  style={{ cursor: 'not-allowed', opacity: 0.6 }}
                />
                <span className="character-count">{form.name.length}/50</span>
              </div>
            ) : (
              <h3 className="perfil-name">{user?.name || "Usuário"}</h3>
            )}
          </div>

          {/* Estatísticas */}
          <div className="perfil-stats-grid">
            <div className="perfil-stat-card">
              <div className="perfil-stat-icon">
                <img src={trophyIcon} alt="Troféu" />
              </div>
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">POSIÇÃO NO RANKING</span>
                <span className="perfil-stat-value">{user?.position || "N/A"}</span>
              </div>
            </div>

            <div className="perfil-stat-card">
              <div className="perfil-stat-icon">
                <img src={pointsIcon} alt="Pontos" />
              </div>
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">PONTOS</span>
                <span className="perfil-stat-value">{user?.points || 0}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="perfil-bio-section">
            <label className="perfil-bio-label">BIOGRAFIA</label>
            {isEditing ? (
              <div className="perfil-bio-edit-container">
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Digite sua biografia"
                  rows={3}
                  maxLength={100}
                />
                <span className="bio-character-count">{form.bio.length}/100</span>
              </div>
            ) : (
              <p className="perfil-bio-text">{user?.bio || "Sem biografia."}</p>
            )}
          </div>

          {/* Botões de salvar/editar */}
          {isEditing && (
            <div className="perfil-action-buttons">
              <button className="perfil-cancel-btn" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
              <button className="perfil-save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Usa Portal para renderizar no body, garantindo que seja exibido da mesma forma que na rota /perfil
  return createPortal(modalContent, document.body);
}