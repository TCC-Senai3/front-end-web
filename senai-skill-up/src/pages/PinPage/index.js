import React, { useEffect } from "react";
import slogan from '../../assets/images/slogan com brilhos.svg';
import './style.css';
import Header from '../../components/header';

export default function PinPage() {
  useEffect(() => {
    // Adicionar classes para bloquear scroll
    document.body.classList.add('pinpage-body');
    document.documentElement.classList.add('pinpage-html');
    
    // Cleanup: remover classes quando componente for desmontado
    return () => {
      document.body.classList.remove('pinpage-body');
      document.documentElement.classList.remove('pinpage-html');
    };
  }, []);

  return (
    <div className="pinpage-bg">
      <Header />
      <div className="pinpage-center">
        <img src={slogan} alt="SENAI SKILL UP" className="pinpage-logo" />
        <form className="pinpage-form">
          <input
            type="text"
            placeholder="PIN do jogo"
            className="pinpage-input"
          />
          <button
            type="submit"
            className="pinpage-btn"
          >
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
} 