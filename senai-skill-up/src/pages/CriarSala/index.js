import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import './style.css';

export default function CriarSala() {
  const navigate = useNavigate();
  const [questionario, setQuestionario] = useState('');
  const [materia, setMateria] = useState('');

  const handleCriar = () => {
    if (!questionario || !materia) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    // Gera um código de 6 dígitos como na imagem
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    
    console.log('Criando sala:', { questionario, materia, codigo });
    
    // Redireciona para a sala (lobby) com o código
    navigate('/sala', { state: { codigo } });
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
              <label>Selecione o Questionario</label>
              <select 
                value={questionario} 
                onChange={(e) => setQuestionario(e.target.value)}
                className="form-select"
              >
                <option value="">Selecione um questionário</option>
                <option value="frontend">Front End</option>
                <option value="backend">Back End</option>
                <option value="database">Banco de Dados</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            <div className="form-group">
              <label>Materia</label>
              <input 
                type="text" 
                value={materia} 
                onChange={(e) => setMateria(e.target.value)}
                placeholder="Digite a matéria"
                className="form-input"
              />
            </div>

            <button className="criar-btn" onClick={handleCriar}>
              CRIAR
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
