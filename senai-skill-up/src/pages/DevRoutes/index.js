import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const DevRoutes = () => {
    const routes = [
        { path: '/', name: 'Home', status: 'ok', description: 'Página inicial' },
        { path: '/login', name: 'Login', status: 'ok', description: 'Página de login' },
        { path: '/contato', name: 'Contato', status: 'ok', description: 'Página de contato' },
        { path: '/SkillHelp', name: 'SkillHelp', status: 'ok', description: 'Ajuda (redireciona para Contato)' },
        { path: '/game', name: 'Game', status: 'ok', description: 'Falta a placa de ranking' },
        { path: '/jogo', name: 'Jogo', status: 'ok', description: 'prontos' },
        { path: '/perfil', name: 'Perfil', status: 'ok', description: 'perfil' },
        { path: '/suporte', name: 'Suporte', status: 'ok', description: 'Página de suporte' },
        { path: '/termos', name: 'Termos', status: 'ok', description: 'Termos de uso' },
        { path: '/home', name: 'Home (alt)', status: 'ok', description: 'Página inicial (rota alternativa)' },
        { path: '/Correto', name: 'Correto', status: 'ok', description: 'Pronto' },
        { path: '/Errado', name: 'Errado', status: 'ok', description: 'Pronto' },
        { path: '/LoadHost', name: 'LoadHost', status: 'ok', description: 'Pronto' },
        { path: '/ajuda', name: 'Ajuda', status: 'ok', description: 'Página de ajuda (redireciona para Suporte)' },
        { path: '/pin', name: 'Pin', status: 'ok', description: 'Página de PIN' },
        { path: '/createquiz', name: 'CreateQuiz', status: 'ok', description: 'CSS - arrumar o estilo' },
        { path: '/criarsala', name: 'CriarSala', status: 'ok', description: 'CSS - arrumar o estilo' },
        { path: '/sala', name: 'Sala', status: 'ok', description: 'CSS - arrumar o estilo' },
        { path: '/fim', name: 'FimDeJogo', status: 'ok', description: 'pronto' },
        { path: '/usuarios', name: 'Usuários', status: 'pending', description: 'CSS - arrumar o estilo' },
        { path: '/admin/usuarios', name: 'Admin Usuários', status: 'pending', description: 'CSS - arrumar o estilo' },
        { path: '/connection-error', name: 'Connection Error', status: 'ok', description: 'Página de erro de conexão' },
        { path: '/ForgotPassword', name: 'Forgot Password', status: 'pending', description: 'CSS - arrumar o estilo' },
        { path: '/ResetPassword', name: 'Reset Password', status: 'pending', description: 'CSS - arrumar o estilo' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'ok':
                return '#4caf50';
            case 'pending':
                return '#ff9800';
            default:
                return '#9e9e9e';
        }
    };

    const okRoutes = routes.filter(r => r.status === 'ok');
    const pendingRoutes = routes.filter(r => r.status === 'pending');

    return (
        <div className="dev-routes-container">
            <div className="dev-routes-header">
                <h1>🛠️ Painel de Desenvolvimento - Rotas</h1>
                <p>Acesso rápido a todas as páginas do projeto</p>
                <div className="stats">
                    <div className="stat-item ok">
                        <span className="stat-number">{okRoutes.length}</span>
                        <span className="stat-label">Completas</span>
                    </div>
                    <div className="stat-item pending">
                        <span className="stat-number">{pendingRoutes.length}</span>
                        <span className="stat-label">Pendentes</span>
                    </div>
                    <div className="stat-item total">
                        <span className="stat-number">{routes.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                </div>
            </div>

            <div className="routes-sections">
                <section className="routes-section">
                    <h2 className="section-title ok-title">✅ Rotas Completas ({okRoutes.length})</h2>
                    <div className="routes-grid">
                        {okRoutes.map((route, index) => (
                            <Link 
                                to={route.path} 
                                key={index} 
                                className="route-card ok-card"
                            >
                                <div className="route-header">
                                    <h3>{route.name}</h3>
                                    <span 
                                        className="status-badge" 
                                        style={{ backgroundColor: getStatusColor(route.status) }}
                                    >
                                        OK
                                    </span>
                                </div>
                                <p className="route-path">{route.path}</p>
                                <p className="route-description">{route.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="routes-section">
                    <h2 className="section-title pending-title">⚠️ Rotas Pendentes ({pendingRoutes.length})</h2>
                    <div className="routes-grid">
                        {pendingRoutes.map((route, index) => (
                            <Link 
                                to={route.path} 
                                key={index} 
                                className="route-card pending-card"
                            >
                                <div className="route-header">
                                    <h3>{route.name}</h3>
                                    <span 
                                        className="status-badge" 
                                        style={{ backgroundColor: getStatusColor(route.status) }}
                                    >
                                        Pendente
                                    </span>
                                </div>
                                <p className="route-path">{route.path}</p>
                                <p className="route-description">{route.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <div className="dev-routes-footer">
                <p>💡 Clique em qualquer card para navegar até a página</p>
            </div>
        </div>
    );
};

export default DevRoutes;
