import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="contact-sidebar">
            <button 
                className={`contact-sidebar-btn${location.pathname === "/contato" ? " active" : ""}`}
                onClick={() => navigate("/contato")}
            >
                Contato
            </button>
            <button 
                className={`contact-sidebar-btn${location.pathname === "/suporte" ? " active" : ""}`}
                onClick={() => navigate("/suporte")}
            >
                Suporte
            </button>
            <button 
                className={`contact-sidebar-btn${location.pathname === "/termos" ? " active" : ""}`}
                onClick={() => navigate("/termos")}
            >
                Termos
            </button>
        </aside>
    );
}
