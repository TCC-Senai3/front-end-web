import React from "react";
import "./style.css";
import CrossCircleIcon from '../../assets/images/cross-circle 1.svg';

export default function ModalHistoricoResultado({ open, onClose, resultados = [], titulo = "Resultado do Questionário", materia = "", descricao = "", criador = { nome: "Usuario123", avatar: "https://ui-avatars.com/api/?name=Usuario123" } }) {
  if (!open) return null;

  return (
    <div className="modal-questionario-overlay">
      <div className="modal-questionario-box">
        <button className="modal-questionario-close" onClick={onClose} style={{position: 'absolute', top: 18, right: 24}}>
          <img src={CrossCircleIcon} alt="Fechar" style={{width: 32, height: 32}} />
        </button>
        <div className="modal-questionario-row-top">
          <div className="modal-questionario-criador-col" style={{alignItems: 'center', justifyContent: 'flex-start', display: 'flex', flexDirection: 'column', minWidth: 110}}>
            <span className="modal-questionario-criador-label" style={{marginBottom: 6}}>Criador</span>
            <img className="modal-questionario-avatar" src={criador.avatar} alt="Avatar do criador" style={{marginBottom: 6}} />
            <span className="modal-questionario-criador-nome">{criador.nome}</span>
          </div>
          <div className="modal-questionario-main-col">
            <h2 className="modal-questionario-titulo-center">{titulo}</h2>
            <div className="modal-questionario-meta-center">
              <span className="modal-questionario-materia">{materia}</span>
            </div>
            <div className="modal-questionario-descricao-center">{descricao}</div>
          </div>
          <div className="modal-questionario-jogar-col" style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', minWidth: 180, marginTop: 60}}>
            <button className="modal-questionario-jogar">JOGAR</button>
          </div>
        </div>
        <div style={{marginTop: 24}}>
          <h3 style={{fontWeight: 600, color: '#222', marginBottom: 10}}>Respostas do questionário</h3>
          <div className="modal-historico-resultado-lista">
            {resultados.length === 0 ? (
              <div style={{textAlign: 'center', color: '#888'}}>Nenhum resultado disponível.</div>
            ) : resultados.map((q, idx) => (
              <div key={idx} className={`modal-historico-resultado-item ${q.acertou ? 'acertou' : 'errou'}`}
                   style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, boxShadow: '0 1px 6px #0001'}}>
                <span style={{fontWeight: 700, color: q.acertou ? '#2ecc40' : '#ff4d4d', fontSize: 18}}>
                  {q.acertou ? '✔' : '✖'}
                </span>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 600, color: '#222'}}>{q.pergunta}</div>
                  <div style={{fontSize: 0.98 + 'em', color: '#888'}}>Sua resposta: <b>{q.respostaUsuario}</b></div>
                  {q.acertou ? null : (
                    <div style={{fontSize: 0.98 + 'em', color: '#e74c3c'}}>Correta: <b>{q.respostaCorreta}</b></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 