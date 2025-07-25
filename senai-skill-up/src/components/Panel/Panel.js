import React from "react";
import "./style.css";



export default function Panel({ isSignUpMode, toggleSignUpMode }) {
    return (
        <>
            <div className="panel left-panel">
                <div className="content">
                    <h3>Já tem uma conta?</h3>
                    <button className="btn transparent" onClick={toggleSignUpMode}>
                        CADASTRE-SE
                    </button>
                </div>
                <img src="/src/assets/images/bagulho.svg" className="image" alt="" />
            </div>
            <div className="panel right-panel">
                <div className="content">
                    <h3>Não está cadastrado?</h3>
                    <button className="btn transparent" onClick={toggleSignUpMode}>
                        LOGIN
                    </button>
                </div>
                <img src="/src/assets/images/bagulho.svg" className="image" alt="" />
            </div>
        </>
    );
}

