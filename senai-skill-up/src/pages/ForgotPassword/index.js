import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import './style.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // Simular envio de email (aqui você faria a chamada para a API)
            await new Promise(resolve => setTimeout(resolve, 2000));
            setMessage('Email de recuperação enviado com sucesso!');
            
            // Redirecionar para página de nova senha após 2 segundos
            setTimeout(() => {
                navigate('/ResetPassword', { state: { email: email } });
            }, 2000);
        } catch (error) {
            setMessage('Erro ao enviar email. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="forgot-password-container">
            <Header />
            <div className="forgot-password-content">
                <div className="form-section">
                    <div className="form-content">
                        <h2 className="form-title">COLOQUE O E-MAIL DE RECUPERAÇÃO</h2>
                        
                        <form onSubmit={handleSubmit} className="forgot-password-form">
                            <input 
                                type="email" 
                                placeholder="Digite seu email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #3498db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#333',
                                    background: 'white',
                                    boxSizing: 'border-box',
                                    marginBottom: '15px'
                                }}
                            />

                            <button 
                                type="submit" 
                                className="btn-enviar"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Enviando...' : 'ENVIAR'}
                            </button>

                            {message && (
                                <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
