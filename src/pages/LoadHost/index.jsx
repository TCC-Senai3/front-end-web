import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import './style.css';

export default function LoadHost() {
  const navigate = useNavigate();

  const handleSair = () => {
    // Volta para a página anterior ou para home se não houver histórico
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="loadhost-bg">
      <Header />
      <div className="loadhost-center">
        <img src={require('../../assets/images/Gameboy.svg').default} alt="Gameboy" className="loadhost-icon" />
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
            onClick={handleSair}
          >
            Sair
          </button>
        </form>
      </div>
    </div>
  );
} 