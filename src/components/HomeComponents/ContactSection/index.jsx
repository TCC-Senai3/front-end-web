import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function ContactSection() {
    const navigate = useNavigate();
    
    return (
        <div className="productive" id="contato">
            <div className="text-container">
                <h1>PERGUNTAS?</h1>
                <p>Vamos conversar!</p>
                <div
                    className="contact-btn"
                    onClick={() => navigate("/SkillHelp")}
                    style={{ cursor: "pointer" }}
                >
                    Contato
                </div>
            </div>
        </div>
    );
}
