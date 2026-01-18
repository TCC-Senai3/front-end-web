import React from 'react';
import { Header } from '../index';
import Group50Image from '../../assets/images/Group 50.svg';
import './style.css';

export default function ConnectionError() {
  return (
    <>
      <Header />
      <div className="connection-error-container">
        <div className="error-icon">
          <img 
            src={Group50Image} 
            alt="Erro de conexão" 
            className="error-image"
          />
        </div>
        
        <div className="error-message">
          <h2>Conexão cortada</h2>
        </div>
      </div>
    </>
  );
}
