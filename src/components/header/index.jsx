import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Importações de imagens
import userProfileImage from "../../assets/images/user-profile1.png";
import medalIcon from '../../assets/images/image 33.png';
import settingsIcon from '../../assets/images/settings 1.png';
import bodeIcon from "../../assets/images/bode.svg";
import canetaIcon from "../../assets/images/Canetabic.svg";
import patoIcon from "../../assets/images/Pato.svg";

// Mapeamento de avatares
const avatarMap = {
    "bode.svg": bodeIcon,
    "bode": bodeIcon,
    "Canetabic.svg": canetaIcon,
    "caneta": canetaIcon,
    "Pato.svg": patoIcon,
    "pato": patoIcon,
};

const cleanAvatarName = (avatarString) => {
    if (!avatarString) return null;
    let name = avatarString.trim();
    const viteHashPattern = /(\-[a-zA-Z0-9]+)(\.[^/.]+)$/;
    const cleanedName = name.replace(viteHashPattern, '$2');
    return cleanedName || name;
};

export default function Header() {
    const navigate = useNavigate();

    // O Header consome o 'user' do Contexto.
    // Quando você chama updateUserScore() lá no GameQuiz, o 'user' muda aqui automaticamente.
    const { user, isLoggedIn, logout } = useAuth();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsDropdownRef = useRef(null);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
    const userProfileDropdownRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsSettingsOpen(false);
        setIsUserProfileOpen(false);
    };

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
        setIsUserProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    const toggleUserProfile = () => {
        setIsUserProfileOpen(!isUserProfileOpen);
        setIsSettingsOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleSettingsClick = (option) => {
        setIsSettingsOpen(false);
        setIsMobileMenuOpen(false);

        switch (option) {
            case 'TERMOS': navigate('/termos'); break;
            case 'CONTATO': navigate('/contato'); break;
            case 'SAIR':
                logout();
                navigate('/login');
                break;
            default: break;
        }
    };

    const handleUserProfileClick = (option) => {
        setIsUserProfileOpen(false);
        setIsMobileMenuOpen(false);

        if (!isLoggedIn) {
            alert('Você precisa estar logado para acessar esta funcionalidade. Faça login para continuar.');
            navigate('/login');
            return;
        }

        switch (option) {
            case 'MINHA CONTA': navigate('/perfil'); break;
            case 'CRIAR QUIZ': navigate('/createquiz'); break;
            case 'USUÁRIOS': navigate('/usuarios'); break;
            case 'ADMIN USUÁRIOS': navigate('/admin/usuarios'); break;
            case 'SAIR':
                logout();
                navigate('/login');
                break;
            default: break;
        }
    };

    const handleMobileMenuClick = (option) => {
        setIsMobileMenuOpen(false);

        if ((option === 'MINHA CONTA' || option === 'USUÁRIOS') && !isLoggedIn) {
            alert('Você precisa estar logado para acessar esta funcionalidade. Faça login para continuar.');
            navigate('/login');
            return;
        }

        switch (option) {
            case 'INICIO': navigate('/game'); break;
            case 'TERMOS': navigate('/termos'); break;
            case 'CONTATO': navigate('/contato'); break;
            case 'MINHA CONTA': navigate('/perfil'); break;
            case 'CRIAR QUIZ': navigate('/createquiz'); break;
            case 'USUÁRIOS': navigate('/usuarios'); break;
            case 'SAIR':
                logout();
                navigate('/login');
                break;
            default: break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
            if (userProfileDropdownRef.current && !userProfileDropdownRef.current.contains(event.target)) {
                setIsUserProfileOpen(false);
            }
        };
        if (isSettingsOpen || isUserProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen, isUserProfileOpen]);

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isMobileMenuOpen]);

    const avatarNameFromBackend = user?.avatar;
    const cleanedNameWithExt = cleanAvatarName(avatarNameFromBackend);
    const avatarSrc = user?.avatar 
        ? (avatarMap[cleanedNameWithExt] || avatarMap[cleanedNameWithExt?.replace(/\.[^/.]+$/, "")] || userProfileImage)
        : userProfileImage;

    return (
        <header>
            <div className="header-container">
                <div className="logo-section">
                    <Link to="/" className="logo-link">
                        <span className="logo-text">SENAI SKILL-UP</span>
                    </Link>
                </div>

                <button
                    className="hamburger-btn"
                    onClick={toggleMobileMenu}
                    aria-label="Menu"
                >
                    <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                    <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                    <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
                </button>

                <div className="right-section">
                    <div className="nav-section">
                        <Link to="/game" className="nav-link">INICIO</Link>
                    </div>

                    {/* Perfil do Usuário */}
                    <div className="user-profile" ref={userProfileDropdownRef} onClick={toggleUserProfile}>
                        <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="avatar"
                        />
                        <span className="username">{user?.nome || 'USUARIO'}</span>

                        {isUserProfileOpen && (
                            <div className="user-profile-dropdown">
                                <div className="user-dropdown-arrow"></div>
                                <div className="user-dropdown-content">
                                    <div className="user-dropdown-item" onClick={() => handleUserProfileClick('MINHA CONTA')}>MINHA CONTA</div>
                                    {((user?.permissoes === 'CRIADOR' || user?.tipoUsuario === 'CRIADOR') || 
                                      (Array.isArray(user?.roles) && user.roles.includes('ROLE_CRIADOR_FORMULARIO'))) && 
                                      !(user?.permissoes === 'ADM' || user?.tipoUsuario === 'ADM' || 
                                      (Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN'))) && (
                                      <div className="user-dropdown-item" onClick={() => handleUserProfileClick('CRIAR QUIZ')}>CRIAR QUIZ</div>
                                    )}
                                    <div className="user-dropdown-item" onClick={() => handleUserProfileClick('USUÁRIOS')}>USUÁRIOS</div>
                                    {(user?.permissoes === 'ADM' || user?.tipoUsuario === 'ADM' || 
                                      (Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN'))) && (
                                        <div className="user-dropdown-item" onClick={() => handleUserProfileClick('ADMIN USUÁRIOS')}>ADMIN USUÁRIOS</div>
                                    )}
                                    <div className="user-dropdown-item" onClick={() => handleUserProfileClick('SAIR')}>SAIR</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ======================================================== */}
                    {/* Seção de Pontos (DESKTOP) - OCULTADA */}
                    {/* ======================================================== */}
                    {/* <div className="points-section">
                        <img
                            src={medalIcon}
                            alt="Medalha"
                            className="medal-icon"
                        />
                        <span className="points-number">{user ? user.pontuacao : '0'}</span>
                    </div>
                    */}

                    <div className="settings-section" ref={settingsDropdownRef} onClick={toggleSettings}>
                        <img src={settingsIcon} alt="Configurações" className="settings-icon" />
                        {isSettingsOpen && (
                            <div className="settings-dropdown">
                                <div className="dropdown-arrow"></div>
                                <div className="dropdown-content">
                                    <div className="dropdown-item" onClick={() => handleSettingsClick('TERMOS')}>TERMOS</div>
                                    <div className="dropdown-item" onClick={() => handleSettingsClick('CONTATO')}>CONTATO</div>
                                    <div className="dropdown-item" onClick={() => handleSettingsClick('SAIR')}>SAIR</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
                    <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <span className="mobile-menu-title">MENU</span>
                        </div>

                        <div className="mobile-user-profile">
                            <div className="mobile-user-info">
                                <img src={avatarSrc} alt="Avatar" className="mobile-avatar" />
                                <div className="mobile-user-details">
                                    <span className="mobile-username">{user ? user.nome : 'USUARIO'}</span>
                                    
                                    {/* ======================================================== */}
                                    {/* Seção de Pontos (MOBILE) - OCULTADA */}
                                    {/* ======================================================== */}
                                    {/*
                                    <div className="mobile-points">
                                        <img src={medalIcon} alt="Medalha" className="mobile-medal" />
                                        <span className="mobile-points-number">{user ? user.pontuacao : '0'}</span>
                                    </div>
                                    */}

                                </div>
                            </div>
                        </div>

                        <div className="mobile-menu-options">
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('INICIO')}>INICIO</div>
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('TERMOS')}>TERMOS</div>
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('CONTATO')}>CONTATO</div>
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('MINHA CONTA')}>MINHA CONTA</div>
                            {((user?.permissoes === 'CRIADOR' || user?.tipoUsuario === 'CRIADOR') || 
                              (Array.isArray(user?.roles) && user.roles.includes('ROLE_CRIADOR_FORMULARIO'))) && 
                              !(user?.permissoes === 'ADM' || user?.tipoUsuario === 'ADM' || 
                                (Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN'))) && (
                                <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('CRIAR QUIZ')}>CRIAR QUIZ</div>
                            )}
                            <div className="mobile-menu-item mobile-menu-item-logout" onClick={() => handleMobileMenuClick('SAIR')}>SAIR</div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}