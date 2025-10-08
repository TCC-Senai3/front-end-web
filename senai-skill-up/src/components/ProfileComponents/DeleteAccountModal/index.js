import React from "react";
import "./style.css";

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-questionario-overlay">
            <div className="modal-questionario-box" style={{minWidth: 400, maxWidth: '90vw', textAlign: 'center'}}>
                <button className="modal-questionario-close" onClick={onClose} style={{position: 'absolute', top: 18, right: 24}}>
                    <span style={{fontSize: 28, color: '#888'}}>&times;</span>
                </button>
                <h2 style={{marginTop: 16, color: '#d32f2f'}}>Confirmar exclusão</h2>
                <p style={{margin: '24px 0 32px 0', color: '#444'}}>Tem certeza que deseja <b>excluir sua conta</b>?<br/>Esta ação não poderá ser desfeita.</p>
                <div style={{display: 'flex', justifyContent: 'center', gap: 16}}>
                    <button className="perfil-excluir-btn-cancelar" onClick={onClose} style={{padding: '10px 24px'}}>Cancelar</button>
                    <button className="perfil-excluir-btn-confirmar" style={{background: '#d32f2f', color: '#fff', padding: '10px 24px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer'}} onClick={onConfirm}>Excluir conta</button>
                </div>
            </div>
        </div>
    );
}
