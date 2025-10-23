import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components';
import './style.css';

export default function Unauthorized() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      <Header />
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <div className="unauthorized-icon">
            <span>🚫</span>
          </div>
          <h1>Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Entre em contato com o administrador se acredita que isso é um erro.</p>
          
          <div className="unauthorized-actions">
            <button onClick={handleGoBack} className="btn-secondary">
              Voltar
            </button>
            <button onClick={handleGoHome} className="btn-primary">
              Ir para Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}