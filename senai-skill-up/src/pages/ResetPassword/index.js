import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/header';
import './style.css';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Pegar o email dos parâmetros ou do estado
    const email = location.state?.email || location.search.split('email=')[1];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage('As senhas não coincidem!');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('A senha deve ter no mínimo 6 caracteres!');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // Simular envio da nova senha (aqui você faria a chamada para a API)
            await new Promise(resolve => setTimeout(resolve, 2000));
            setMessage('Senha alterada com sucesso! Redirecionando para login...');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage('Erro ao alterar senha. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="reset-password-container">
            <Header />
            <div className="reset-password-content">
                <div className="form-section">
                    <div className="form-content">
                        <h2 className="form-title">COLOQUE SUA NOVA SENHA</h2>
                        
                        {email && (
                            <p className="email-info" style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                                Email: {decodeURIComponent(email)}
                            </p>
                        )}
                        
                        <form onSubmit={handleSubmit} className="reset-password-form">
                            <div style={{ position: 'relative', marginBottom: '15px' }}>
                                <input 
                                    type={showNewPassword ? "text" : "password"} 
                                    placeholder="Nova senha (mínimo 6 caracteres)" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    style={{
                                        width: '100%',
                                        padding: '12px 45px 12px 16px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#333',
                                        background: 'white',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <div 
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        color: '#666',
                                        userSelect: 'none'
                                    }}
                                >
                                    {showNewPassword ? '🙈' : '👁️'}
                                </div>
                            </div>

                            <div style={{ position: 'relative', marginBottom: '15px' }}>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="Confirme a nova senha" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    style={{
                                        width: '100%',
                                        padding: '12px 45px 12px 16px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#333',
                                        background: 'white',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <div 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        color: '#666',
                                        userSelect: 'none'
                                    }}
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-enviar"
                                disabled={isLoading}
                                style={{
                                    background: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 25px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    width: '100%',
                                    opacity: isLoading ? '0.7' : '1'
                                }}
                            >
                                {isLoading ? 'Alterando...' : 'ALTERAR SENHA'}
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
