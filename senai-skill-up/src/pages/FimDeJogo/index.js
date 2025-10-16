import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import image6 from '../../assets/images/image 6.svg';
import image7 from '../../assets/images/image 7.svg';
import image8 from '../../assets/images/image 8.svg';
import medal from '../../assets/images/image 31.svg';
import './style.css';

export default function FimDeJogo() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dados esperados do backend via location.state:
  // {
  //   recompensa: number,
  //   podium: [
  //     { pos: number, nome: string, pontos: number, avatar?: string },
  //     ...
  //   ],
  //   ranking: [
  //     { posicao: number, nome: string, ganho: number, avatar?: string },
  //     ...
  //   ]
  // }

  const recompensa = location.state?.recompensa || 0;
  const podiumData = location.state?.podium || [];
  const ranking = location.state?.ranking || [];

  // Mapear troféus por posição
  const getTrophy = (pos) => {
    const trophies = { 1: image7, 2: image6, 3: image8 };
    return trophies[pos] || image8;
  };

  return (
    <>
      <Header />
      <div className="fim-container">
        <h1 className="fim-title">FIM DE JOGO</h1>

        {recompensa > 0 && (
          <div className="recompensas">
            <div className="recompensas-title">RECOMPENSAS</div>
            <div className="recompensas-row">
              <div className="recompensas-box">
                <img src={medal} alt="Medalha" className="recompensa-ico" />
                <span className="recompensa-valor">{recompensa}</span>
              </div>
            </div>
          </div>
        )}

        {podiumData.length > 0 && (
          <div className="podium">
            {podiumData.map((p, idx) => (
              <div key={idx} className={`podium-col pos-${p.pos}`}>
                <img src={getTrophy(p.pos)} alt={`Troféu ${p.pos}`} className="trophy" />
                <div className="user-card">
                  <div 
                    className="avatar" 
                    style={p.avatar ? { backgroundImage: `url(${p.avatar})` } : {}}
                  />
                  <div className="user-name">{p.nome}</div>
                </div>
                <div className="points">{p.pontos} Pontos</div>
              </div>
            ))}
          </div>
        )}

        <div className="fim-actions">
          <button className="btn-proximo" onClick={() => navigate('/game')}>
            SAIR
          </button>
        </div>

        {ranking.length > 0 && (
          <div className="lista-final">
            {ranking.map((u, i) => (
              <div key={i} className="linha-user">
                <div className="col-pos">#{u.posicao}</div>
                <div className="col-nome">
                  <div 
                    className="avatar small" 
                    style={u.avatar ? { backgroundImage: `url(${u.avatar})` } : {}}
                  />
                  <span>{u.nome}</span>
                </div>
                <div className="col-ganho">+{u.ganho}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}


