import React, { useMemo } from 'react';
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

  const resultados = location.state?.resultados;

  const podium = useMemo(() => ([
    { pos: 2, name: 'Usuário', points: 3869, trophy: image6 },
    { pos: 1, name: 'Campeão', points: 3889, trophy: image7 },
    { pos: 3, name: 'Usuário', points: 3869, trophy: image8 }
  ]), []);

  const listaUsuarios = useMemo(() => {
    if (Array.isArray(resultados) && resultados.length) return resultados;
    // Mock para exibição se nada for passado
    return [
      { posicao: 1, nome: 'Campeão', ganho: 50 },
      { posicao: 2, nome: 'Usuário', ganho: 30 },
      { posicao: 3, nome: 'Usuário', ganho: 20 },
      { posicao: 4, nome: 'Usuário', ganho: 10 },
      { posicao: 5, nome: 'Usuário', ganho: 10 },
      { posicao: 6, nome: 'Usuário', ganho: 10 },
      { posicao: 7, nome: 'Usuário', ganho: 10 },
      { posicao: 8, nome: 'Usuário', ganho: 10 },
      { posicao: 9, nome: 'Usuário', ganho: 10 },
    ];
  }, [resultados]);

  return (
    <>
      <Header />
      <div className="fim-container">
        <h1 className="fim-title">FIM DE JOGO</h1>

        <div className="recompensas">
          <div className="recompensas-title">RECOMPENSAS</div>
          <div className="recompensas-row">
            <div className="recompensas-box">
              <img src={medal} alt="Medalha" className="recompensa-ico" />
              <span className="recompensa-valor">50</span>
            </div>
            <button className="fim-sair" onClick={() => navigate('/game')}>SAIR</button>
          </div>
        </div>

        <div className="podium">
          {podium.map((p, idx) => (
            <div key={idx} className={`podium-col pos-${p.pos}`}>
              <img src={p.trophy} alt={`Troféu ${p.pos}`} className="trophy" />
              <div className="user-card">
                <div className="avatar" />
                <div className="user-name">{p.name}</div>
              </div>
              <div className="points">{p.points} Pontos</div>
            </div>
          ))}
        </div>

        <div className="fim-actions">
          <button className="btn-proximo" onClick={() => navigate('/fim-recompensas', { state: { recompensa: 50 } })}>
            PRÓXIMO
          </button>
        </div>

        <div className="lista-final">
          {listaUsuarios.map((u, i) => (
            <div key={i} className="linha-user">
              <div className="col-pos">#{u.posicao}</div>
              <div className="col-nome">
                <div className="avatar small" />
                <span>{u.nome}</span>
              </div>
              <div className="col-ganho">+{u.ganho}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


