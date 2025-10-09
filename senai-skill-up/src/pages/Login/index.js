import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/images/bagulho.svg';
import "./style.css";
import Header from '../../components/header';
import PasswordField from '../../components/PasswordField';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';

export default function Login() {
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginSenha, setLoginSenha] = useState('');

    const [cadastroNome, setCadastroNome] = useState('');
    const [cadastroEmail, setCadastroEmail] = useState('');
    const [cadastroSenha, setCadastroSenha] = useState('');

    const handleSignUpClick = () => {
        setIsSignUpMode(true);
    };

    const handleSignInClick = () => {
        setIsSignUpMode(false);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(loginEmail, loginSenha);
            console.log("Login realizado com sucesso");
            navigate('/');
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro no login. Verifique suas credenciais.");
        }
    };
    
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await authService.register({ nome: cadastroNome, email: cadastroEmail, senha: cadastroSenha });
            console.log("Cadastro realizado com sucesso:", result.data);
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            setIsSignUpMode(false);
            setCadastroNome('');
            setCadastroEmail('');
            setCadastroSenha('');
        } catch (error) {
            console.error("Erro no cadastro:", error);
            
            // Extrai a mensagem de erro do backend
            let mensagemErro = "Erro no cadastro. ";
            
            if (error.response?.data) {
                const erroBackend = error.response.data;
                
                // Se for um objeto com campos de validação
                if (typeof erroBackend === 'object' && !Array.isArray(erroBackend)) {
                    const erros = Object.entries(erroBackend)
                        .map(([campo, mensagem]) => `${campo}: ${mensagem}`)
                        .join('\n');
                    mensagemErro += '\n' + erros;
                } 
                // Se for uma string simples
                else if (typeof erroBackend === 'string') {
                    mensagemErro += erroBackend;
                } else {
                    mensagemErro += "Verifique os dados e tente novamente.";
                }
            } else {
                mensagemErro += "Verifique os dados e tente novamente.";
            }
            
            // Adiciona dica sobre domínios permitidos
            mensagemErro += "\n\n💡 Domínios de email permitidos:\n• gmail.com\n• outlook.com\n• hotmail.com\n• senai.com";
            
            alert(mensagemErro);
        }
    };

    return (
        <>
        <Header />
        <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    <form className="sign-in-form" onSubmit={handleLoginSubmit}>
                        <h2 className="title">LOGIN</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                        </div>
                        <PasswordField 
                            placeholder="Senha"
                            value={loginSenha}
                            onChange={(e) => setLoginSenha(e.target.value)}
                            required
                        />
                        <button 
                            type="button" 
                            className="forgot-password-btn"
                            onClick={() => navigate('/ForgotPassword')}
                        >
                            Esqueceu senha?
                        </button>
                        <input type="submit" value="Login" className="btn solid" />
                    </form>

                    <form className="sign-up-form" onSubmit={handleSignUpSubmit}>
                        <h2 className="title">CADASTRE-SE</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                placeholder="Nome de usuário" 
                                value={cadastroNome}
                                onChange={(e) => setCadastroNome(e.target.value)}
                                required
                                minLength="3"
                            />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={cadastroEmail}
                                onChange={(e) => setCadastroEmail(e.target.value)}
                                required
                            />
                        </div>
                        <PasswordField 
                            placeholder="Senha (mínimo 6 caracteres)"
                            value={cadastroSenha}
                            onChange={(e) => setCadastroSenha(e.target.value)}
                            required
                            minLength="6"
                        />
                        <input type="submit" className="btn" value="Cadastrar" />
                    </form>
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>Não está cadastrado?</h3>
                        <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>
                            CADASTRE-SE
                        </button>
                    </div>
                    <img src={image} className="image" alt="" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>Já tem uma conta?</h3>
                        <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
                            LOGIN
                        </button>
                    </div>
                    <img src={image} className="image" alt="" />
                </div>
            </div>
        </div>
        </>
    );
}
