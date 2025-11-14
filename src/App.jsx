import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Importações de páginas
import Login from './pages/Login';
import Home from './pages/Home';
import Contato from './pages/Contato';
import Game from './pages/Game';
import Jogo from './pages/Jogo';
import CreateQuiz from './pages/CreateQuiz';
import CriarSala from './pages/CriarSala';
import Sala from './pages/Sala';
import FimDeJogo from './pages/FimDeJogo';
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


import './assets/font/imports.css';

// scroll suave
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

// Componente de conteúdo principal
function AppContent() {
  return (
    <div className="app">
      <ScrollToHashElement />
      <ErrorBoundary>
        <Routes>
          {/* Rotas públicas */}
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
          
          {/* Rotas protegidas */}
          <Route path="/createquiz" element={
            <ProtectedRoute requiredPermission="CRIADOR">
              <CreateQuiz />
            </ProtectedRoute>
          } />
          
          <Route path="/criarsala" element={<CriarSala />} />
          <Route path="/sala" element={<Sala />} />
          <Route path="/sala/:id" element={<Sala />} />
          <Route path="/fim" element={<FimDeJogo />} />
          <Route path="/fim-de-jogo" element={<FimDeJogo />} />
          
          <Route path="/usuarios" element={<Usuarios />} />
          
          <Route path="/admin/usuarios" element={
            <ProtectedRoute requiredPermission="ADM">
              <AdminUsers />
            </ProtectedRoute>
          } />
          
          {/* Rotas de autenticação */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Rotas de erro */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/connection-error" element={<ConnectionError />} />
          
          {/* Rotas de desenvolvimento */}
          <Route path="/dev/*" element={<DevRoutes />} />
          
          {/* Rota de fallback para rotas não encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

// Componente principal
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
