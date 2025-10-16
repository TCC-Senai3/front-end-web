import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import temaService from '../../services/temaService';
import salaService from '../../services/salaService';
import './style.css';

export default function CriarSala() {
  const navigate = useNavigate();
  const [questionario, setQuestionario] = useState('');
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criandoSala, setCriandoSala] = useState(false);

  // Carregar temas ao montar o componente
  useEffect(() => {
    const carregarTemas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await temaService.getTemas();
        setTemas(data);
      } catch (err) {
        console.error('Erro ao carregar temas:', err);
        setError('Erro ao carregar questionários');
      } finally {
        setLoading(false);
      }
    };

    carregarTemas();
  }, []);

  const handleCriar = async () => {
    if (!questionario) {
      alert('Por favor, selecione um questionário');
      return;
    }
    
    try {
      setCriandoSala(true);
      
      // Criar sala via API
      const salaData = {
        idTema: questionario,
        // Adicione outros campos necessários conforme a API
      };
      
      const sala = await salaService.createSala(salaData);
      
      console.log('Sala criada:', sala);
      
      // Redireciona para a sala (lobby) com os dados da sala criada
      navigate('/sala', { 
        state: { 
          codigo: sala.codigo || sala.id,
          idSala: sala.id,
          questionario: sala.idTema
        } 
      });
    } catch (err) {
      console.error('Erro ao criar sala:', err);
      alert('Erro ao criar sala. Tente novamente.');
    } finally {
      setCriandoSala(false);
    }
  };

  const handleFechar = () => {
    navigate('/game');
  };

  return (
    <>
      <Header />
      <div className="criar-sala-container">
        <div className="criar-sala-content">
          <h1 className="criar-sala-title">CRIAR SALA</h1>
          
          <div className="sala-card">
            <button className="close-btn" onClick={handleFechar}>×</button>
            
            <div className="form-group">
              <select 
                value={questionario} 
                onChange={(e) => setQuestionario(e.target.value)}
                className="form-select"
                disabled={loading || criandoSala}
              >
                <option value="">
                  {loading ? 'Carregando...' : 'Selecione o Questionario'}
                </option>
                {!loading && !error && temas.map((tema) => (
                  <option key={tema.id} value={tema.id}>
                    {tema.nomeTema || tema.nome}
                  </option>
                ))}
                {error && <option value="" disabled>{error}</option>}
              </select>
            </div>

            <button 
              className="criar-btn" 
              onClick={handleCriar}
              disabled={loading || criandoSala || !questionario}
            >
              {criandoSala ? 'CRIANDO...' : 'CRIAR'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
