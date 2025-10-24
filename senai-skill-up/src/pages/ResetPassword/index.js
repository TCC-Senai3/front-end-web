import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/header';
import lockIcon from '../../assets/images/image 47.png'; 
import './style.css';
import authService from '../../services/authService'; // Verifique o caminho

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    const [token, setToken] = useState(null);
    const [searchParams] = useSearchParams();

    // Captura o token da URL quando a página é carregada
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setMessage('Token inválido ou não encontrado. Por favor, solicite um novo link.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            setMessage('A senha deve ter no mínimo 6 caracteres!');
            return;
        }

        if (!token) {
            setMessage('Erro: Token de redefinição não encontrado.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        // Chama a função da API para confirmar a redefinição de senha
        const response = await authService.confirmPasswordReset(token, newPassword);

        if (response.success) {
            setMessage('Senha alterada com sucesso! Redirecionando para o login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setMessage(response.message);
        }

        setIsLoading(false);
    };

    return (
       <div className="reset-password-container">
            <Header />
            
            <div className="reset-content">
                <img src={lockIcon} alt="Lock Icon" className="lock-icon" />
                <h2 className="form-title">INSIRA A SUA NOVA SENHA</h2>

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <input
                        type="password"
                        placeholder="Nova senha (mínimo 6)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength="6"
                        className="reset-input"
                    />

                    <button 
                        type="submit" 
                        disabled={isLoading || !token} // Desabilita se estiver carregando ou se não houver token
                        className="reset-btn"
                    >
                        {isLoading ? 'Alterando...' : 'ENVIAR'}
                    </button>

                    {message && <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>{message}</div>}
                </form>
            </div>
        </div>
    );
}