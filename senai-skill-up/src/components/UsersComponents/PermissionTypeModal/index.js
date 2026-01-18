import React from 'react';
import './style.css';

export default function PermissionTypeModal({ isOpen, onClose, onSelectPermission, currentPermission }) {
  if (!isOpen) return null;

  const permissionTypes = [
    { value: 'ADM', label: 'Administrador', color: '#dc3545' },
    { value: 'CRIADOR', label: 'Criador', color: '#007bff' },
    { value: 'USER', label: 'Usuário', color: '#28a745' }
  ];

  const handlePermissionSelect = (permission) => {
    onSelectPermission(permission);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="permission-modal-overlay" onClick={handleOverlayClick}>
      <div className="permission-modal-container">
        <div className="permission-modal-header">
          <h3>Selecionar Tipo de Usuário</h3>
          <button className="permission-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="permission-modal-content">
          {permissionTypes.map((permission) => (
            <button
              key={permission.value}
              className={`permission-option ${currentPermission === permission.value ? 'selected' : ''}`}
              onClick={() => handlePermissionSelect(permission.value)}
              style={{ 
                backgroundColor: permission.color
              }}
            >
              <span className="permission-value">{permission.value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
