import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import medal from '../../assets/images/image 31.svg';
import './style.css';

export default function FimRecompensas() {
  const location = useLocation();
  const navigate = useNavigate();
  const recompensa = location.state?.recompensa ?? 50;

  return (
    <>
      <Header />
      <div className="recomp-container">
        <h1 className="fim-title">FIM DE JOGO</h1>
        <div className="recomp-sub">RECOMPENSAS</div>
        <div className="recomp-box">
          <img src={medal} alt="Medalha" />
          <span>{recompensa}</span>
        </div>
        <button className="recomp-sair" onClick={() => navigate('/game')}>SAIR</button>
      </div>
    </>
  );
}


