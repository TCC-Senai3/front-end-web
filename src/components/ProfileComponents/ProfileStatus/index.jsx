import React, { useState } from "react";
import { DeleteAccountModal } from '../';
import "./style.css";

export default function ProfileStatus() {
    const [modalExcluirOpen, setModalExcluirOpen] = useState(false);

    const handleExcluirConfirm = () => {
        setModalExcluirOpen(false);
        alert('Conta excluída! (mock)');
    };

    return (
        <>
            <section className="perfil-status-card card-harmonico">
                <div className="perfil-status">
                    <span className="perfil-status-dot online"></span> Online
                </div>
                <div className="perfil-criado-em">
                    Criado em: <b>20/10/2005</b>
                </div>
                <button className="perfil-excluir-btn" onClick={() => setModalExcluirOpen(true)}>Excluir</button>
            </section>

            <DeleteAccountModal 
                isOpen={modalExcluirOpen}
                onClose={() => setModalExcluirOpen(false)}
                onConfirm={handleExcluirConfirm}
            />
        </>
    );
}
