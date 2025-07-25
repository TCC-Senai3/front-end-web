import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/images/bagulho.svg';
import "./style.css";
import Header from '../../components/Header_padrao';

export default function Login() {
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const navigate = useNavigate();


    const handleSignUpClick = () => {
        setIsSignUpMode(true);
    };

    const handleSignInClick = () => {
        setIsSignUpMode(false);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("Login form submitted");
        navigate('/game');
    };
    
    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        console.log("Sign up form submitted");
        navigate('/');
    };
    return (
        <>
        <Header />
        <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    <form className="sign-in-form">
                        <h2 className="title">LOGIN</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Nome de Usuario pu Email" />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Senha" />
                        </div>
                        <input type="submit" value="Login" className="btn solid" />
                    </form>

                    <form className="sign-up-form">
                        <h2 className="title">CADASTRE-SE</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Nome de Usuario ou Email" />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Senha" />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Confirmação de Senha" />
                        </div>
                        <input type="submit" className="btn" value="Sign up" />
                    </form>
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>Já tem uma conta?</h3>
                        <p></p>
                        <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>
                            CADASTRE-SE
                        </button>
                    </div>
                    <img src={image} className="image" alt="" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>Não está cadastrado?</h3>
                        <p></p>
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
