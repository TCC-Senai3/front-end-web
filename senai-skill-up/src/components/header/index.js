import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
    const navigate = useNavigate();
    const { userData, isLoggedIn, logout } = useAuth();
    
    
    // Estado para controlar o dropdown de configurações
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsDropdownRef = useRef(null);
    
    // Estado para controlar o dropdown do perfil do usuário
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
    const userProfileDropdownRef = useRef(null);
    
    // Estado para controlar o menu hamburger
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Função para controlar o menu hamburger
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsSettingsOpen(false);
        setIsUserProfileOpen(false);
    };

    // Funções para controlar o dropdown de configurações
    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
        setIsUserProfileOpen(false); // Fecha o dropdown do usuário
        setIsMobileMenuOpen(false); // Fecha o menu mobile
    };

    // Funções para controlar o dropdown do perfil do usuário
    const toggleUserProfile = () => {
        setIsUserProfileOpen(!isUserProfileOpen);
        setIsSettingsOpen(false); // Fecha o dropdown de configurações
        setIsMobileMenuOpen(false); // Fecha o menu mobile
    };

    const handleSettingsClick = (option) => {
        console.log(`Opção selecionada: ${option}`);
        setIsSettingsOpen(false);
        setIsMobileMenuOpen(false);
        
        // Aqui você pode adicionar a lógica para cada opção
        switch(option) {
                // Redirecionar para página de termos
            case 'TERMOS':
                navigate('/termos');
                break;
                // Redirecionar para página de contato
            case 'CONTATO':
                navigate('/contato');
                break;            
                case 'SAIR':
                // Implementar logout
                logout();
                navigate('/login');
                break;
            default:
                break;
        }
    };

    const handleUserProfileClick = (option) => {
        console.log(`Opção do perfil selecionada: ${option}`);
        setIsUserProfileOpen(false);
        setIsMobileMenuOpen(false);

        // Verificar se usuário está logado
        if (!isLoggedIn) {
            alert('Você precisa estar logado para acessar esta funcionalidade. Faça login para continuar.');
            navigate('/login');
            return;
        }

        // Aqui você pode adicionar a lógica para cada opção do perfil
        switch(option) {
            case 'MINHA CONTA':
                // Redirecionar para página de perfil
                navigate('/perfil');
                break;
            case 'USUÁRIOS':
                // Redirecionar para página de usuários
                navigate('/usuarios');
                break;
            case 'GERENCIAR USUÁRIOS':
                // Redirecionar para página de administração de usuários
                navigate('/admin/usuarios');
                break;
            default:
                break;
        }
    };

    // Função para lidar com cliques no menu mobile
    const handleMobileMenuClick = (option) => {
        setIsMobileMenuOpen(false);

        // Verificar se usuário está logado para opções que requerem autenticação
        if ((option === 'MINHA CONTA' || option === 'USUÁRIOS') && !isLoggedIn) {
            alert('Você precisa estar logado para acessar esta funcionalidade. Faça login para continuar.');
            navigate('/login');
            return;
        }

        switch(option) {
            case 'INICIO':
                navigate('/');
                break;
            case 'TERMOS':
                navigate('/termos');
                break;
            case 'CONTATO':
                navigate('/contato');
                break;
            case 'MINHA CONTA':
                navigate('/perfil');
                break;
            case 'USUÁRIOS':
                navigate('/usuarios');
                break;
            case 'SAIR':
                logout();
                navigate('/login');
                break;
            default:
                break;
        }
    };

    // Hook para fechar dropdowns ao clicar fora
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

    // Hook para fechar menu mobile ao pressionar ESC
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

                {/* Botão Hamburger para Mobile */}
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
                        <Link to="/" className="nav-link">INICIO</Link>
                    </div>


                    {/* Perfil do Usuário */}
                    <div className="user-profile" ref={userProfileDropdownRef} onClick={toggleUserProfile}>
                        <img 
                            src={require("../../assets/images/user-profile 1.png")} 
                            alt="Avatar" 
                            className="avatar" 
                        />
                        <span className="username">{userData?.nome || 'USUARIO'}</span>
                        <span className="dropdown-arrow">▼</span>
                        
                        {/* Dropdown Menu do Perfil */}
                        {isUserProfileOpen && (
                            <div className="user-profile-dropdown">
                                <div className="user-dropdown-arrow"></div>
                                <div className="user-dropdown-content">
                                    <div 
                                        className="user-dropdown-item" 
                                        onClick={() => handleUserProfileClick('MINHA CONTA')}
                                    >
                                        MINHA CONTA
                                    </div>
                                    <div 
                                        className="user-dropdown-item" 
                                        onClick={() => handleUserProfileClick('USUÁRIOS')}
                                    >
                                        USUÁRIOS
                                    </div>
                                    {/* Opção de administrador pode ser adicionada baseada no tipo de usuário */}
                                    <div 
                                        className="user-dropdown-item admin-item" 
                                        onClick={() => handleUserProfileClick('GERENCIAR USUÁRIOS')}
                                    >
                                        GERENCIAR USUÁRIOS
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TESTE: Sempre mostrar para debug */}
                    <div className="points-section">
                        <img 
                            src={require("../../assets/images/image 33.png")} 
                            alt="Medalha" 
                            className="medal-icon" 
                        />
                        <span className="points-number">{userData ? userData.pontuacao : '0'}</span>
                    </div>

                    <div className="settings-section" ref={settingsDropdownRef} onClick={toggleSettings}>
                        <img 
                            src={require("../../assets/images/settings 1.png")} 
                            alt="Configurações" 
                            className="settings-icon"
                        />
                        
                        {/* Dropdown Menu */}
                        {isSettingsOpen && (
                            <div className="settings-dropdown">
                                <div className="dropdown-arrow"></div>
                                <div className="dropdown-content">
                                    <div 
                                        className="dropdown-item" 
                                        onClick={() => handleSettingsClick('TERMOS')}
                                    >
                                        TERMOS
                                    </div>
                                    <div 
                                        className="dropdown-item" 
                                        onClick={() => handleSettingsClick('CONTATO')}
                                    >
                                        CONTATO
                                    </div>
                                    <div 
                                        className="dropdown-item" 
                                        onClick={() => handleSettingsClick('SAIR')}
                                    >
                                        SAIR
                                    </div>
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
                        {/* Header do Menu Mobile */}
                        <div className="mobile-menu-header">
                            <button 
                                className="mobile-menu-close"
                                onClick={toggleMobileMenu}
                                aria-label="Fechar menu"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Perfil do Usuário no Menu Mobile */}
                        <div className="mobile-user-profile">
                            <div className="mobile-user-info">
                                <img 
                                    src={require("../../assets/images/user-profile 1.png")} 
                                    alt="Avatar" 
                                    className="mobile-avatar" 
                                />
                                <div className="mobile-user-details">
                                    <span className="mobile-username">{userData ? userData.nome : 'USUARIO'}</span>
                                    <div className="mobile-points">
                                        <img 
                                            src={require("../../assets/images/image 33.png")} 
                                            alt="Medalha" 
                                            className="mobile-medal" 
                                        />
                                        <span className="mobile-points-number">{userData ? userData.pontuacao : '0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Opções do Menu Mobile */}
                        <div className="mobile-menu-options">
                            <div 
                                className="mobile-menu-item"
                                onClick={() => handleMobileMenuClick('INICIO')}
                            >
                                INICIO
                            </div>
                            <div 
                                className="mobile-menu-item"
                                onClick={() => handleMobileMenuClick('TERMOS')}
                            >
                                TERMOS
                            </div>
                            <div 
                                className="mobile-menu-item"
                                onClick={() => handleMobileMenuClick('CONTATO')}
                            >
                                CONTATO
                            </div>
                            <div 
                                className="mobile-menu-item"
                                onClick={() => handleMobileMenuClick('MINHA CONTA')}
                            >
                                MINHA CONTA
                            </div>
                            <div 
                                className="mobile-menu-item"
                                onClick={() => handleMobileMenuClick('USUÁRIOS')}
                            >
                                USUÁRIOS
                            </div>
                            <div 
                                className="mobile-menu-item mobile-menu-item-logout"
                                onClick={() => handleMobileMenuClick('SAIR')}
                            >
                                SAIR
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}