// src/components/UsersComponents/UserEditModal.js
import React, { useState, useEffect } from 'react';
import PermissionTypeModal from '../PermissionTypeModal';
import './style.css';

export default function UserEditModal({ user, onSave, onClose }) {
  // ✅ 1. O formulário agora SÓ se preocupa com as 'permissoes'
  const [formData, setFormData] = useState({
    permissoes: 'USER',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  // ✅ 2. useEffect simplificado
  // Ele lê as roles do 'user' e define a string de permissão
  useEffect(() => {
    if (user) {
      let userPerm = 'USER';
      if (Array.isArray(user.roles) && user.roles.length > 0) {
        if (user.roles.includes('ROLE_ADMIN')) userPerm = 'ADM';
        else if (user.roles.includes('ROLE_CRIADOR')) userPerm = 'CRIADOR';
      } else if (typeof user.permissoes === 'string') {
        if (user.permissoes === 'ADM' || user.permissoes === 'ADMINISTRADOR') userPerm = 'ADM';
        else if (user.permissoes === 'CRIADOR') userPerm = 'CRIADOR';
      }
      
      setFormData({
        permissoes: userPerm,
      });
    }
  }, [user]);


  // ✅ 3. handleSubmit ATUALIZADO
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Converte a string (ex: "ADM") para o array (ex: ["ROLE_ADMIN"])
    let rolesParaEnviar = ["ROLE_USER"]; // Default
    if (formData.permissoes === 'ADM') {
      rolesParaEnviar = ["ROLE_ADMIN"];
    } else if (formData.permissoes === 'CRIADOR') {
      rolesParaEnviar = ["ROLE_CRIADOR"];
    }
    
    try {
      // Envia SÓ O ARRAY de roles para o 'onSave'
      await onSave(rolesParaEnviar);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePermissionClick = () => {
    setIsPermissionModalOpen(true);
  };

  const handlePermissionSelect = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissoes: permission,
    }));
  };

  const getPermissionLabel = (permission) => {
    switch (permission) {
      case 'ADM': return 'Administrador';
      case 'CRIADOR': return 'Criador';
      case 'USER': return 'Usuário';
      default: return 'Usuário';
    }
  };

  return (
    <div className="modern-modal-overlay" onClick={handleOverlayClick}>
      <div className="modern-modal-container">
        <div className="modern-modal-header">
          <h2>Editar Permissões</h2> {/* Título mudou */}
          <button className="modern-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modern-modal-content">
          
          {/* ✅ 4. Preview simplificado (mostra dados estáticos) */}
          <div className="user-preview-section">
            <div className="preview-header">
              <span>Nome</span>
              <span>Email</span>
              <span>Permissões (Atual)</span>
            </div>
            
            <div className="preview-data">
              <span className="preview-name">{user?.nome || '...'}</span>
              <span className="preview-email">{user?.email || '...'}</span>
              <span className={`preview-permission ${formData.permissoes?.toLowerCase()}-badge`}>
                {formData.permissoes || 'USER'}
              </span>
            </div>
          </div>

          {/* ✅ 5. Formulário simplificado (SÓ o botão de permissões) */}
          <div className="lateral-edit-section">
            <div className="edit-form-lateral">
              <div className="form-field-lateral">
                <label>ALTERAR PARA</label>
                <button
                  type="button"
                  className="permission-dropdown-lateral"
                  onClick={handlePermissionClick}
                >
                  <span className={`permission-badge-lateral ${formData.permissoes?.toLowerCase()}-badge`}>
                    {getPermissionLabel(formData.permissoes)}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="modern-modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="btn-update"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SALVANDO...' : 'ATUALIZAR'}
            </button>
          </div>
        </form>
      </div>

      {isPermissionModalOpen && (
        <PermissionTypeModal
          isOpen={isPermissionModalOpen}
          onClose={() => setIsPermissionModalOpen(false)}
          onSelectPermission={handlePermissionSelect}
          currentPermission={formData.permissoes}
        />
      )}
    </div>
  );
}