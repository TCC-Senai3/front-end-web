import React, { useState } from 'react';
// A navegação não é mais necessária nesta tela
// import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import './style.css';
import group51 from '../../assets/images/Group 51.png';
import authService from '../../services/authService'; // Verifique se o caminho está correto

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    // const navigate = useNavigate(); // Não precisamos mais disso aqui

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        // 1. Chama a API real para solicitar o envio do e-mail
        const response = await authService.resetPassword(email);

        // 2. Com base na resposta da API, mostra a mensagem apropriada
        if (response.success) {
            setMessage(response.message + " Por favor, verifique sua caixa de entrada.");
        } else {
            setMessage(response.message);
        }
        
        // 3. Finaliza o carregamento
        setIsLoading(false);
    };

    return (
        <div className="forgot-password-container">
            <Header />
            <div className="forgot-password-content">
                <div className="illustration-section">
                    <img src={group51} alt="Illustration" className="recovery-image" />
                </div>
                <div className="form-section">
                    <div className="form-content">
                        <h2 className="form-title">COLOQUE O E-MAIL DE <br /> RECUPERAÇÃO</h2>
                        
                        <form onSubmit={handleSubmit} className="forgot-password-form">
                            <input 
                                type="email" 
                                placeholder="Digite seu email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="email-input"
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