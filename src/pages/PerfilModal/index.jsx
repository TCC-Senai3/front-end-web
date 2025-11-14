import React, { useState, useEffect, useCallback } from "react";
import "./style.css";
import editIcon from "../../assets/images/Vector.png";
import trophyIcon from "../../assets/images/trophy 1.svg";
import pointsIcon from "../../assets/images/image 33.png";

import userProfileImage from "../../assets/images/user-profile1.png"; // Corrigido aqui!
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
  const [user, setUser] = useState(isMyProfile ? null : propUser);
  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(isMyProfile);
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

  const avatarOptions = [
    { id: "bode", src: bodeIcon, alt: "Bode" },
    { id: "caneta", src: canetaIcon, alt: "Caneta" },
    { id: "pato", src: patoIcon, alt: "Pato" },
  ];

  const handleCloseAndNavigate = useCallback(() => {
    if (propOnClose) propOnClose();
    navigate("/game");
  }, [navigate, propOnClose]);

  // --- Buscar dados ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchedUserData;

        if (isMyProfile) {
          // Busca o perfil do usuário autenticado
          const myData = await userService.getMeuPerfil();
          fetchedUserData = {
            ...myData,
            name: myData.nome || "Usuário",
            points: myData.pontuacao || 0,
            bio: myData.biografia?.trim() || "Sem biografia.",
            avatar: myData.avatar?.trim() || "",
            position: myData.rank || "N/A",
            memberSince: myData.dataCriacao ? new Date(myData.dataCriacao).getFullYear() : "N/A",
            online: myData.online || false,
          };
        } else if (propUser && propUser.id) {
          // Caso contrário, busca o perfil de outro usuário, usando o ID fornecido
          const userData = await userService.getUserById(propUser.id);
          fetchedUserData = {
            ...userData,
            name: userData.nome || "Usuário",
            points: userData.pontuacao || 0,
            bio: userData.biografia?.trim() || "Sem biografia.",
            avatar: userData.avatar?.trim() || "",
            position: userData.rank || "N/A",
            memberSince: userData.dataCriacao ? new Date(userData.dataCriacao).getFullYear() : "N/A",
            online: userData.online || false,
          };
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
    setForm({
      name: user.name,
      bio: user.bio || "",
      avatar: user.avatar || "",
    });
    setIsEditing(true);
  };

  const handleAvatarSelect = (avatarSrc) => {
    const fileName = avatarSrc.split("/").pop();
    setForm((prev) => ({ ...prev, avatar: fileName }));
    setShowAvatarOptions(false);
  };

  const handleSave = async () => {
    if (!authUser) return alert("Você não está autenticado.");
    if (!form.name.trim()) return alert("O nome não pode estar vazio.");

    setIsSaving(true);
    try {
      const updates = [];

      // Atualizar biografia
      if (form.bio !== user.bio) {
        updates.push(userService.updateBiografia(authUser.id, { biografia: form.bio }));
      }

      // Atualizar avatar
      if (form.avatar !== user.avatar) {
        updates.push(userService.updateAvatar(authUser.id, { avatar: form.avatar }));
      }

      // Aguarda as atualizações
      await Promise.all(updates);

      // Atualiza os dados no estado local
      setUser({ ...user, name: form.name, bio: form.bio, avatar: form.avatar });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Não foi possível salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;
  if (loading || !user)
    return (
      <div className="perfil-modal-wrapper">
        <div className="perfil-modal-overlay" onClick={handleCloseAndNavigate}>
          <div className="perfil-modal-container" onClick={(e) => e.stopPropagation()}>
            <Loader />
          </div>
        </div>
      </div>
    );

  // --- Puxar avatar corretamente ---
  const avatarSrc = avatarMap[user.avatar?.trim()] || userProfileImage;

  return (
    <div className="perfil-modal-wrapper">
      <div className="perfil-modal-overlay" onClick={handleCloseAndNavigate}>
        <div className="perfil-modal-container" onClick={(e) => e.stopPropagation()}>
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
                onClick={() => setShowAvatarOptions(!showAvatarOptions)}
              >
                <img src={avatarSrc} alt={user.name} className="avatar-image" />
                {isEditing && <div className="avatar-edit-overlay">Mudar</div>}
                <div className={`perfil-status-indicator ${user.online ? "online" : "offline"}`}></div>
              </div>

              {showAvatarOptions && (
                <div className="avatar-options">
                  {avatarOptions.map((avatar) => (
                    <div
                      key={avatar.id}
                      className={`avatar-option ${form.avatar === avatar.src.split("/").pop() ? "selected" : ""}`}
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

          {/* Estatísticas */}
          <div className="perfil-stats-grid">
            <div className="perfil-stat-card">
              <div className="perfil-stat-icon">
                <img src={trophyIcon} alt="Troféu" />
              </div>
              <div className="perfil-stat-content">
                <span className="perfil-stat-label">POSIÇÃO NO RANKING</span>
                <span className="perfil-stat-value">{user.position || "N/A"}</span>
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
          </div>

          {/* Bio */}
          <div className="perfil-bio-section">
            <label className="perfil-bio-label">BIOGRAFIA</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Digite sua biografia"
                rows={3}
                maxLength={200}
              />
            ) : (
              <p className="perfil-bio-text">{user.bio}</p>
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
        </div>
      </div>
    </div>
  );
}
