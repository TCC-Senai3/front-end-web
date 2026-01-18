import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import './style.css';

export default function Sala() {
  const location = useLocation();
  const navigate = useNavigate();
  const codigo = location.state?.codigo || '000000';

  const handleDesmanchar = () => {
    navigate('/game');
  };

  const handleIniciar = () => {
    navigate('/jogo');
  };

  const usuariosMock = Array.from({ length: 9 }).map((_, idx) => ({ id: idx + 1 }));

  return (
    <>
      <Header />
      <div className="sala-container">
        <div className="sala-content">
          <div className="sala-codigo">CODE: {codigo}</div>

          <div className="sala-actions">
            <button className="btn btn-danger" onClick={handleDesmanchar}>DESMANCHAR</button>
            <button className="btn btn-warning" onClick={handleIniciar}>INICIAR</button>
          </div>

          <div className="sala-grid">
            {usuariosMock.map((u) => (
              <div key={u.id} className="sala-user-card">
                <div className="avatar" />
                <div className="nome">Usuário</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


