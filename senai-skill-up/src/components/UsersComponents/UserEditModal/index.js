import React, { useState, useEffect } from 'react';
import PermissionTypeModal from '../PermissionTypeModal';
import './style.css';

export default function UserEditModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    // (Campos como status, pontos, etc., não são mais necessários no form
    // pois o backend não está atualizando eles por aqui)
    permissoes: 'USER', // Esta será nossa "string de controle" interna
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  // ✅ 1. useEffect ATUALIZADO
  useEffect(() => {
    if (user) {
      // Lógica para extrair a permissão principal,
      // não importa se 'user.permissoes' é uma string ("ADM")
      // ou um array (["ROLE_ADMIN"])
      let userPerm = 'USER';
      if (Array.isArray(user.permissoes) && user.permissoes.length > 0) {
        // Se for array: ["ROLE_ADMIN"] -> "ADM"
        if (user.permissoes.includes('ROLE_ADMIN')) userPerm = 'ADM';
        else if (user.permissoes.includes('ROLE_CRIADOR')) userPerm = 'CRIADOR';
      } else if (typeof user.permissoes === 'string') {
        // Se for string: "ADM" -> "ADM"
        if (user.permissoes === 'ADM' || user.permissoes === 'ADMINISTRADOR') userPerm = 'ADM';
        else if (user.permissoes === 'CRIADOR') userPerm = 'CRIADOR';
      }
      
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        permissoes: userPerm, // Seta a string de controle (ex: "ADM")
      });
    } else {
      // Modo "Criar Novo Usuário" (não muda)
      setFormData({
        nome: '',
        email: '',
        permissoes: 'USER',
      });
    }
    setErrors({});
  }, [user]);

  // validateForm (Removido campos desnecessários)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handleInputChange (Removido campos desnecessários)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ 2. handleSubmit ATUALIZADO (A Mágica do "Tradutor")
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // --- O Tradutor ---
    // 1. Converte a string de permissão (ex: "ADM")
    //    para o formato de array que o backend espera (ex: ["ROLE_ADMIN"])
    let rolesParaEnviar = ["ROLE_USER"]; // Default
    if (formData.permissoes === 'ADM') {
      rolesParaEnviar = ["ROLE_ADMIN"];
    } else if (formData.permissoes === 'CRIADOR') {
      rolesParaEnviar = ["ROLE_CRIADOR"];
    }
    
    // 2. Cria o payload que o 'AdminUsers.js' espera
    const payload = {
      nome: formData.nome,
      email: formData.email,
      roleIds: rolesParaEnviar // Este é o array que o 'userService' vai usar
    };
    // --------------------

    try {
      // 3. Envia o payload traduzido
      await onSave(payload);
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

  // handlePermissionSelect (Atualizado para lidar só com a string 'permissoes')
  const handlePermissionSelect = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissoes: permission, // 'permission' é "ADM", "CRIADOR", ou "USER"
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
          <h2>Editar Usuário</h2>
          <button className="modern-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modern-modal-content">
          <div className="user-preview-section">
            <div className="preview-header">
              <span>Nome</span>
              <span>Email</span>
              <span>Status</span>
              <span>Permissões</span>
            </div>
            
            <div className="preview-data">
              <span className="preview-name">{formData.nome || 'NOME DO USUÁRIO'}</span>
              <span className="preview-email">{formData.email || 'email@exemplo.com'}</span>
              <div className="preview-status">
                 {/* O status (online/offline) será atualizado pelo WebSocket, 
                     não precisamos mais editá-lo manualmente aqui */}
                <div className={`status-dot ${user?.status === 'offline' ? 'offline' : ''}`}></div>
              </div>
              <span className={`preview-permission ${formData.permissoes?.toLowerCase()}-badge`}>
                {formData.permissoes || 'USER'}
              </span>
            </div>
          </div>

          <div className="lateral-edit-section">
            <div className="edit-form-lateral">
              <div className="form-field-lateral">
                <label>NOME</label>
                <span className="required">*</span>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={errors.nome ? 'error' : ''}
                  placeholder="Digite o nome do usuário"
                />
                {errors.nome && <span className="error-text">{errors.nome}</span>}
              </div>

              <div className="form-field-lateral">
                <label>EMAIL</label>
                <span className="required">*</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Digite o email do usuário"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-field-lateral">
                <label>PERMISSÕES</label>
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