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

    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);

    const handleSignUpClick = () => {
        setIsSignUpMode(true);
    };

    const handleSignInClick = () => {
        setIsSignUpMode(false);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (isLoginLoading) return;
        setIsLoginLoading(true);
        try {
            await login(loginEmail, loginSenha);
            navigate('/game');
        } catch (error) {
            alert("Erro no login. Verifique suas credenciais.");
        } finally {
            setIsLoginLoading(false);
        }
    };
    
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (isSignUpLoading) return;
        setIsSignUpLoading(true);
        try {
            const result = await authService.register({ nome: cadastroNome, email: cadastroEmail, senha: cadastroSenha });
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            setIsSignUpMode(false);
            setCadastroNome('');
            setCadastroEmail('');
            setCadastroSenha('');
        } catch (error) {
            let mensagemErro = "Erro no cadastro. ";
            
            if (error.response?.data) {
                const erroBackend = error.response.data;
                
                if (typeof erroBackend === 'object' && !Array.isArray(erroBackend)) {
                    const erros = Object.entries(erroBackend)
                        .map(([campo, mensagem]) => `${campo}: ${mensagem}`)
                        .join('\n');
                    mensagemErro += '\n' + erros;
                } 
                else if (typeof erroBackend === 'string') {
                    mensagemErro += erroBackend;
                } else {
                    mensagemErro += "Verifique os dados e tente novamente.";
                }
            } else {
                mensagemErro += "Verifique os dados e tente novamente.";
            }
            
            mensagemErro += "\n\n💡 Domínios de email permitidos:\n• gmail.com\n• outlook.com\n• hotmail.com\n• senai.com";
            
            alert(mensagemErro);
        }
        finally {
            setIsSignUpLoading(false);
        }
    };

    return (
        <div className="login-page no-scroll">
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
                                placeholder="Senha (mínimo 6 caracteres)"
                                value={loginSenha}
                                onChange={(e) => setLoginSenha(e.target.value)}
                                required
                                minLength={6}
                                title="A senha deve ter no mínimo 6 caracteres"
                            />
                            <button 
                                type="button" 
                                className="forgot-password-btn"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Esqueceu senha?
                            </button>
                            <button 
                                type="submit" 
                                className={`primary-button solid ${isLoginLoading ? 'loading' : ''}`}
                                disabled={isLoginLoading}
                            >
                                {isLoginLoading ? (
                                    <>
                                        <span className="button-spinner" aria-hidden="true"></span>
                                        <span>Entrando...</span>
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
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
                            <button 
                                type="submit" 
                                className={`primary-button ${isSignUpLoading ? 'loading' : ''}`}
                                disabled={isSignUpLoading}
                            >
                                {isSignUpLoading ? (
                                    <>
                                        <span className="button-spinner" aria-hidden="true"></span>
                                        <span>Cadastrando...</span>
                                    </>
                                ) : (
                                    'Cadastrar'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content">
                            <h3>Não está cadastrado?</h3>
                            <button className="primary-button transparent" id="sign-up-btn" onClick={handleSignUpClick}>
                                CADASTRE-SE
                            </button>
                        </div>
                        <img src={image} className="image" alt="" />
                    </div>
                    <div className="panel right-panel">
                        <div className="content">
                            <h3>Já tem uma conta?</h3>
                            <button className="primary-button transparent" id="sign-in-btn" onClick={handleSignInClick}>
                                LOGIN
                            </button>
                        </div>
                        <img src={image} className="image" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}
