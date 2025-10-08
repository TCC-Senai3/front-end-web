import React, { useState, useEffect } from 'react';
import PermissionTypeModal from '../PermissionTypeModal';
import './style.css';

export default function UserEditModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    status: 'online',
    permissoes: 'USER',
    tipoUsuario: 'USUARIO',
    pontos: 0,
    nivel: 'Bronze',
    jogosJogados: 0,
    precisao: 0
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        status: user.status || 'online',
        permissoes: user.permissoes || 'USER',
        tipoUsuario: user.tipoUsuario || 'USUARIO',
        pontos: user.pontos || 0,
        nivel: user.nivel || 'Bronze',
        jogosJogados: user.jogosJogados || 0,
        precisao: user.precisao || 0
      });
    } else {
      // Reset form for new user
      setFormData({
        nome: '',
        email: '',
        status: 'online',
        permissoes: 'USER',
        tipoUsuario: 'USUARIO',
        pontos: 0,
        nivel: 'Bronze',
        jogosJogados: 0,
        precisao: 0
      });
    }
    setErrors({});
  }, [user]);

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

    if (formData.pontos < 0) {
      newErrors.pontos = 'Pontos não podem ser negativos';
    }

    if (formData.jogosJogados < 0) {
      newErrors.jogosJogados = 'Jogos jogados não podem ser negativos';
    }

    if (formData.precisao < 0 || formData.precisao > 100) {
      newErrors.precisao = 'Precisão deve estar entre 0 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
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
      tipoUsuario: permission === 'ADM' ? 'ADMINISTRADOR' : 
                   permission === 'CRIADOR' ? 'CRIADOR' : 'USUARIO'
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>{user ? 'Editar Usuário' : 'Novo Usuário'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>Informações Básicas</h3>
            
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className={errors.nome ? 'error' : ''}
                placeholder="Digite o nome do usuário"
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Digite o email do usuário"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="permissoes">Permissões</label>
                <button
                  type="button"
                  className="permission-select-button"
                  onClick={handlePermissionClick}
                >
                  <span className="permission-button-text">
                    {getPermissionLabel(formData.permissoes)}
                  </span>
                  <span className="permission-button-arrow">▼</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tipoUsuario">Tipo de Usuário</label>
              <input
                type="text"
                id="tipoUsuario"
                name="tipoUsuario"
                value={getPermissionLabel(formData.permissoes)}
                readOnly
                className="readonly-input"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Estatísticas do Jogo</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pontos">Pontos</label>
                <input
                  type="number"
                  id="pontos"
                  name="pontos"
                  value={formData.pontos}
                  onChange={handleInputChange}
                  className={errors.pontos ? 'error' : ''}
                  min="0"
                />
                {errors.pontos && <span className="error-message">{errors.pontos}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="nivel">Nível</label>
                <select
                  id="nivel"
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleInputChange}
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Prata">Prata</option>
                  <option value="Ouro">Ouro</option>
                  <option value="Diamante">Diamante</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="jogosJogados">Jogos Jogados</label>
                <input
                  type="number"
                  id="jogosJogados"
                  name="jogosJogados"
                  value={formData.jogosJogados}
                  onChange={handleInputChange}
                  className={errors.jogosJogados ? 'error' : ''}
                  min="0"
                />
                {errors.jogosJogados && <span className="error-message">{errors.jogosJogados}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="precisao">Precisão (%)</label>
                <input
                  type="number"
                  id="precisao"
                  name="precisao"
                  value={formData.precisao}
                  onChange={handleInputChange}
                  className={errors.precisao ? 'error' : ''}
                  min="0"
                  max="100"
                />
                {errors.precisao && <span className="error-message">{errors.precisao}</span>}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : (user ? 'Atualizar' : 'Criar')}
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
