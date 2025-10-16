import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import './style.css';

export default function Sala() {
  const location = useLocation();
  const navigate = useNavigate();
  const codigo = location.state?.codigo || '000000';
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar usuários da sala do backend
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      // TODO: Substituir pela URL real da API
      // const response = await fetch(`/api/salas/${codigo}/usuarios`);
      // const data = await response.json();
      // setUsuarios(data);
      
      // Dados de exemplo - remover quando conectar ao backend
      setUsuarios([]);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  const handleDesmanchar = async () => {
    try {
      // TODO: Chamar API para desmanchar sala
      // await fetch(`/api/salas/${codigo}`, { method: 'DELETE' });
      navigate('/game');
    } catch (error) {
      console.error('Erro ao desmanchar sala:', error);
    }
  };

  const handleIniciar = async () => {
    try {
      // TODO: Chamar API para iniciar jogo
      // await fetch(`/api/salas/${codigo}/iniciar`, { method: 'POST' });
      navigate('/jogo');
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="sala-container">
        <div className="sala-content">
          <div className="sala-codigo">CODE: {codigo}</div>

          <div className="sala-actions">
            <button className="btn btn-danger" onClick={handleDesmanchar}>
              DESMANCHAR<br />SALA
            </button>
            <button className="btn btn-warning" onClick={handleIniciar}>
              INICIAR
            </button>
          </div>

          <div className="sala-grid">
            {loading ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : usuarios.length === 0 ? (
              <div className="sala-mensagem">Nenhum usuário na sala</div>
            ) : (
              usuarios.map((usuario) => (
                <div key={usuario.id} className="sala-user">
                  <div 
                    className="sala-avatar" 
                    style={{ 
                      backgroundImage: usuario.avatar ? `url(${usuario.avatar})` : undefined 
                    }}
                  />
                  <div className="nome">{usuario.nome || 'Usuário'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
