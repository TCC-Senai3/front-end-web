import React from 'react';
import Header from '../../components/Header_padrao';
import './style.css';

export default function LoadHost() {
  return (
    <div className="loadhost-bg">
      <Header />
      <div className="loadhost-center">
        <img src={require('../../assets/images/Gameboy.svg').default} alt="Gameboy" style={{ width: 120, height: 120, marginBottom: 16 }} />
        <div className="loadhost-title">
          Aguardando o host da Sala
        </div>
        <form className="loadhost-form">
          <input
            type="text"
            placeholder="Carregando..."
            className="loadhost-input"
            disabled
          />
          <button
            type="button"
            className="loadhost-btn"
            disabled
          >
            Carregando...
          </button>
        </form>
      </div>
    </div>
  );
} 