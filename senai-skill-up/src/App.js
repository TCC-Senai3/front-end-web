import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
// 1. IMPORTAR O AuthProvider
import { AuthProvider } from './hooks/useAuth'; // <-- Caminho correto

// Seus imports de páginas
import Login from './pages/Login';
import Home from './pages/Home';
import Contato from './pages/Contato';
import Game from './pages/Game';
import Jogo from './pages/Jogo';
import CreateQuiz from './pages/CreateQuiz';
import CriarSala from './pages/CriarSala';
import Sala from './pages/Sala';
import FimDeJogo from './pages/FimDeJogo';
// import FimRecompensas from './pages/FimRecompensas'; // ✅ CORREÇÃO: Linha removida (não era usada)
import PerfilModal from './pages/PerfilModal';
import Suporte from './pages/Suporte';
import Termos from './pages/Termos';
import PinPage from './pages/PinPage';
import Correto from './components/correto';
import Errado from './components/errado';
import LoadHost from './pages/LoadHost';
import Usuarios from './pages/Usuarios';
import AdminUsers from './pages/AdminUsers';
import ConnectionError from './pages/ConnectionError';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DevRoutes from './pages/DevRoutes';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

import './assets/font/imports.css';

// Componente ScrollToHashElement (sem alterações)
function ScrollToHashElement() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const elementId = location.hash.substring(1);
            const element = document.getElementById(elementId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return null;
}

// Componente AppContent (agora com a lista de rotas COMPLETA)
function AppContent() {
    return (
        <>
            <ScrollToHashElement />
            <Routes>
                {/* ****** Rotas limpas ****** */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/SkillHelp" element={<Contato />} />
                <Route path="/game" element={<Game />} /> 
                <Route path="/jogo" element={<Jogo />} />
                <Route path="/perfil" element={<PerfilModal isMyProfile={true} />} />
                <Route path="/suporte" element={<Suporte />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/home" element={<Home />} />
                <Route path="/Correto" element={<Correto />} />
                <Route path="/Errado" element={<Errado />} />
                <Route path="/LoadHost" element={<LoadHost />} />
                <Route path="/ajuda" element={<Suporte />} />
                <Route path="/pin" element={<PinPage />} />
                <Route path="/createquiz" element={
                    <ProtectedRoute requiredPermission="CRIADOR">
                        <CreateQuiz />
                    </ProtectedRoute>
                } />
                <Route path="/criarsala" element={<CriarSala />} />
                <Route path="/sala" element={<Sala />} />
                <Route path="/fim" element={<FimDeJogo />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/admin/usuarios" element={
                    <ProtectedRoute requiredPermission="ADM">
                        <AdminUsers />
                    </ProtectedRoute>
                } />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/connection-error" element={<ConnectionError />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
                <Route path="/dev" element={<DevRoutes />} />
            </Routes>
        </>
    );
}

// Componente App Principal (Estrutura correta com AuthProvider)
export default function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}