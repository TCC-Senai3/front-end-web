import React, { useState } from 'react';
import PasswordField from './index';
import './style.css';

const PasswordFieldExample = () => {
    const [senha1, setSenha1] = useState('');
    const [senha2, setSenha2] = useState('');
    const [senha3, setSenha3] = useState('');

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Exemplo do Componente PasswordField</h2>
            
            <h3>Campo de Senha Padrão:</h3>
            <PasswordField 
                placeholder="Digite sua senha"
                value={senha1}
                onChange={(e) => setSenha1(e.target.value)}
                required
            />
            
            <h3>Campo de Senha com Ícone Personalizado:</h3>
            <PasswordField 
                placeholder="Senha com ícone personalizado"
                value={senha2}
                onChange={(e) => setSenha2(e.target.value)}
                icon="fas fa-key"
            />
            
            <h3>Campo de Senha (não obrigatório):</h3>
            <PasswordField 
                placeholder="Senha opcional"
                value={senha3}
                onChange={(e) => setSenha3(e.target.value)}
            />
            
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                <h4>Valores dos campos:</h4>
                <p>Senha 1: {senha1}</p>
                <p>Senha 2: {senha2}</p>
                <p>Senha 3: {senha3}</p>
            </div>
        </div>
    );
};

export default PasswordFieldExample;
