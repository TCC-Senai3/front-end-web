import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import salaService from '../../services/salaService';
// 1. CAMINHO DE IMPORTAÇÃO CORRIGIDO
import { useAuth } from '../../hooks/useAuth';
import './style.css';

export default function Sala() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega o usuário logado

  const codigo = location.state?.codigo || null;
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaInfo, setSalaInfo] = useState(null);
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);

  useEffect(() => {
    // Se não tiver um código ou um usuário, volta ao menu
    if (!codigo || !user || !user.id) {
      navigate('/game');
      return;
    }

    const fetchSalaData = async () => {
      try {
        // Não seta loading=true aqui para o refresh ser mais suave
        const sala = await salaService.getSalaByPin(codigo);

        setSalaInfo(sala);

        // Verifica se o usuário logado é o criador
        if (sala.idUsuario === user.id) {
          setIsDonoDaSala(true);
        }

        // Define a lista de participantes
        if (sala && Array.isArray(sala.participantes)) {
          setUsuarios(sala.participantes);
        } else if (sala && Array.isArray(sala.idParticipantes)) {
          setUsuarios(sala.idParticipantes);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da sala:', error);
        navigate('/game');
      } finally {
        setLoading(false); // Seta o loading como falso só na primeira vez
      }
    };

    fetchSalaData(); // Busca na primeira vez

    // Atualiza a lista de usuários a cada 5 segundos (Polling)
    const interval = setInterval(() => {
      fetchSalaData();
    }, 5000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo, navigate, user]); // Depende do 'user' para garantir que ele foi carregado

  const handleDesmanchar = async () => {
    try {
      if (salaInfo && isDonoDaSala && window.confirm("Tem certeza?")) {
        // TODO: Adicionar salaService.deleteSala(salaInfo.idSala)
        console.log("Desmanchando sala (simulação)...");
        navigate('/game');
      } else if (!isDonoDaSala) {
        // Lógica para SAIR da sala (se não for o dono)
        // TODO: Adicionar salaService.sairDaSala(salaInfo.idSala, user.id)
        console.log("Saindo da sala (simulação)...");
        navigate('/game');
      }
    } catch (error) {
      console.error('Erro ao desmanchar/sair da sala:', error);
    }
  };

  const handleIniciar = async () => {
    try {
      if (salaInfo && isDonoDaSala) {
        // TODO: Adicionar salaService.iniciarSala(salaInfo.idSala)
        console.log("Iniciando jogo (simulação)...");
        navigate('/jogo');
      }
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
              {isDonoDaSala ? "DESMANCHAR\nSALA" : "SAIR DA\nSALA"}
            </button>

            {isDonoDaSala && (
              <button className="btn btn-warning" onClick={handleIniciar}>
                INICIAR
              </button>
            )}
          </div>

          <div className="sala-grid">
            {loading ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : usuarios.length === 0 ? (
              <div className="sala-mensagem">Aguardando jogadores...</div>
            ) : (
              usuarios.map((usuario) => (
                <div key={usuario.id} className="sala-user">
                  <div
                    className="sala-avatar"
                    style={{
                      backgroundImage: usuario.avatar ? `url(${usuario.avatar})` : undefined 
                    }}
                  />
                  {/* Destaca o nome do próprio usuário */}
                  <div
                    className="nome"
                    style={{ fontWeight: user && usuario.id === user.id ? 'bold' : 'normal' }}
                  >
                    {usuario.nome || 'Usuário'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}