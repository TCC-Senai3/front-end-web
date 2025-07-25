import React from "react";
import "./style.css";
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header_padrao() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const navigateToHomeSection = (sectionId) => {
        if (location.pathname === '/') {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/#${sectionId}`);
        }
    };

    return (
        <header>
            <div className="cabecalho flex-container">
                <Link to="/">
                    <img 
                        src={require("../../assets/images/SENAI SKILL-UP.svg").default} 
                        alt="SENAI SKILL-UP"
                    />
                </Link>
                <ul className="cabecalho__lista">
                    <li className="cabecalho__item">
                        <Link to="/">INICIO</Link>
                    </li>
                    <li className="cabecalho__item">
                        <Link to="/contato">CONTATO</Link>
                    </li>
                    <li className="cabecalho__item">
                        <a 
                            onClick={() => navigateToHomeSection('informacoes')} 
                            style={{cursor: 'pointer'}}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') navigateToHomeSection('informacoes');
                            }}
                        >
                            SOBRE
                        </a>
                    </li>
                    <li className="cabecalho__item">
                        <Link to="/ajuda">AJUDA</Link>
                    </li>
                    
                </ul>
            </div>
        </header>
    );
}
