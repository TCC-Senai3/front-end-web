import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Importações de imagens
import userProfileImage from '../../assets/images/user-profile 1.png';
import medalIcon from '../../assets/images/image 33.png';
import settingsIcon from '../../assets/images/settings 1.png';

// Logs para depuração
console.log('userProfileImage:', userProfileImage);
console.log('medalIcon:', medalIcon);
console.log('settingsIcon:', settingsIcon);

export default function Header() {
    const navigate = useNavigate();

    // ****** CORREÇÃO AQUI ******
    // Pegar 'user' em vez de 'userData'
    const { user, isLoggedIn, logout } = useAuth();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsDropdownRef = useRef(null);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
    const userProfileDropdownRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Todas as suas funções (toggleMobileMenu, toggleSettings, handleSettingsClick, etc.)
    // permanecem EXATAMENTE IGUAIS. Não precisam de alteração.
    // ... (suas funções aqui) ...

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
            case 'USUÁRIOS': navigate('/usuarios'); break;
            case 'SAIR':
                logout();
                navigate('/login');
                break;
            default: break;
        }
    };

    // UseEffects para fechar dropdowns (sem alterações)
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


    return (
        <header>
            <div className="header-container">
                <div className="logo-section">
                    <Link to="/" className="logo-link">
                        <span className="logo-text">SENAI SKILL-UP</span>
                    </Link>
                </div>

                {/* Botão Hamburger (sem alterações) */}
                <button
                    className="hamburger-btn"
                    onClick={toggleMobileMenu}
                    aria-label="Menu"
                >
                    {/* ... spans do hamburger ... */}
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
                            src={userProfileImage}
                            alt="Avatar"
                            className="avatar"
                        />
                        {/* ****** CORREÇÃO AQUI ****** */}
                        {/* Usar 'user' em vez de 'userData' */}
                        <span className="username">{user?.nome || 'USUARIO'}</span>

                        {/* Dropdown Menu do Perfil */}
                        {isUserProfileOpen && (
                            <div className="user-profile-dropdown">
                                {/* ... (conteúdo do dropdown, sem alterações, mas a condição abaixo agora usa 'user') ... */}
                                <div className="user-dropdown-arrow"></div>
                                <div className="user-dropdown-content">
                                    <div className="user-dropdown-item" onClick={() => handleUserProfileClick('MINHA CONTA')}>MINHA CONTA</div>
                                    <div className="user-dropdown-item" onClick={() => handleUserProfileClick('USUÁRIOS')}>USUÁRIOS</div>
                                    {/* ****** CORREÇÃO AQUI (se aplicável) ****** */}
                                    {/* Usar 'user' para verificar permissões */}
                                    {(user?.permissoes === 'ADM' || user?.tipoUsuario === 'ADM') && (
                                        <div className="user-dropdown-item admin-item" onClick={() => handleUserProfileClick('ADMIN USUÁRIOS')}>ADMIN USUÁRIOS</div>
                                    )}
                                    <div className="user-dropdown-item" onClick={() => handleUserProfileClick('SAIR')}>SAIR</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Seção de Pontos */}
                    <div className="points-section">
                        <img
                            src={medalIcon}
                            alt="Medalha"
                            className="medal-icon"
                        />
                        {/* ****** CORREÇÃO AQUI ****** */}
                        {/* Usar 'user' em vez de 'userData' */}
                        <span className="points-number">{user ? user.pontuacao : '0'}</span>
                    </div>

                    {/* Seção de Configurações (sem alterações na lógica de dados) */}
                    <div className="settings-section" ref={settingsDropdownRef} onClick={toggleSettings}>
                        {/* ... (ícone e dropdown de configurações) ... */}
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

            {/* Menu Mobile Overlay (sem alterações na lógica de dados, mas a condição abaixo usa 'user') */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
                    <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                        {/* ... (Header do menu mobile) ... */}
                        <div className="mobile-menu-header">
                            <span className="mobile-menu-title">MENU</span>
                        </div>

                        {/* Perfil no Menu Mobile */}
                        <div className="mobile-user-profile">
                            <div className="mobile-user-info">
                                <img src={userProfileImage} alt="Avatar" className="mobile-avatar" />
                                <div className="mobile-user-details">
                                    {/* ****** CORREÇÃO AQUI ****** */}
                                    {/* Usar 'user' */}
                                    <span className="mobile-username">{user ? user.nome : 'USUARIO'}</span>
                                    <div className="mobile-points">
                                        <img src={medalIcon} alt="Medalha" className="mobile-medal" />
                                        {/* ****** CORREÇÃO AQUI ****** */}
                                        {/* Usar 'user' */}
                                        <span className="mobile-points-number">{user ? user.pontuacao : '0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Opções do Menu Mobile (sem alterações na lógica de dados) */}
                        <div className="mobile-menu-options">
                            {/* ... (itens do menu mobile) ... */}
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('INICIO')}>INICIO</div>
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('TERMOS')}>TERMOS</div>
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('CONTATO')}>CONTATO</div>
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('MINHA CONTA')}>MINHA CONTA</div>
                            <div className="mobile-menu-item" onClick={() => handleMobileMenuClick('USUÁRIOS')}>USUÁRIOS</div>
                            <div className="mobile-menu-item mobile-menu-item-logout" onClick={() => handleMobileMenuClick('SAIR')}>SAIR</div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}