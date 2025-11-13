import React, { useState } from "react";
import image31 from "../../../assets/images/image 31.svg";
import "./style.css";

export default function ProfileHeader({ userScore = null }) {
    const [bio, setBio] = useState('Sonhador(a) em constante evolução | Amante de boas conversas | 🌍 Explorando o mundo, um passo de cada vez! | 📷 Capturando momentos');
    const [editandoBio, setEditandoBio] = useState(false);
    const [novaBio, setNovaBio] = useState(bio);
    const [showLapis, setShowLapis] = useState(false);

    return (
        <section className="perfil-card">
            <div className="perfil-avatar">
                <img src="https://ui-avatars.com/api/?name=Usuario123" alt="Avatar" />
            </div>
            <div className="perfil-info perfil-info-flex">
                <div className="perfil-nome-pontos">
                    <span className="perfil-nome">Usuario123</span>
                    <div className="perfil-pontos">
                        <img src={image31} alt="Medalha" className="perfil-medal-icon" /> {userScore !== null ? userScore : '---'}
                    </div>
                </div>
                <div className="perfil-bio perfil-bio-final"
                     onMouseEnter={() => setShowLapis(true)}
                     onMouseLeave={() => setShowLapis(false)}
                     style={{position: 'relative', cursor: editandoBio ? 'default' : 'pointer'}}
                     onClick={() => { if (!editandoBio) setEditandoBio(true); }}>
                    <b>Biografia:</b>{' '}
                    {editandoBio ? (
                        <>
                            <textarea
                                className="perfil-bio-textarea"
                                value={novaBio}
                                onChange={e => setNovaBio(e.target.value)}
                                rows={3}
                                style={{width: '100%', resize: 'vertical', marginTop: 6}}
                                autoFocus
                                onClick={e => e.stopPropagation()}
                            />
                            <div style={{marginTop: 6, display: 'flex', gap: 8}}>
                                <button className="perfil-bio-btn-salvar" onClick={e => { e.stopPropagation(); setBio(novaBio); setEditandoBio(false); }}>Salvar</button>
                                <button className="perfil-bio-btn-cancelar" onClick={e => { e.stopPropagation(); setNovaBio(bio); setEditandoBio(false); }}>Cancelar</button>
                            </div>
                        </>
                    ) : (
                        <span style={{marginLeft: 4, userSelect: 'none'}}>
                            {bio}
                            {showLapis && (
                                <span className="perfil-bio-lapis" style={{marginLeft: 8, fontSize: '1.1em'}}>✏️</span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}
