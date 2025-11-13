import React from "react";
import "./style.css";


function SignUpForm() {
    return (
        <form action="#" className="sign-up-form">
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
    );
}

export default SignUpForm;
