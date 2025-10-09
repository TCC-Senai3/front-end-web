import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Contato from './pages/Contato'; 
import Game from './pages/Game';
import Jogo from './pages/Jogo';
import CreateQuiz from './pages/CreateQuiz';
import CriarSala from './pages/CriarSala';
import Sala from './pages/Sala';
import FimDeJogo from './pages/FimDeJogo';
import FimRecompensas from './pages/FimRecompensas';
import PerfilModal from './pages/PerfilModal';
import Suporte from './pages/Suporte';
import Termos from './pages/Termos';
import PinPage from './pages/PinPage';
import Correto from'./components/correto';
import Errado from'./components/errado';
import LoadHost from './pages/LoadHost';
import Usuarios from './pages/Usuarios';
import AdminUsers from './pages/AdminUsers';
import ConnectionError from './pages/ConnectionError';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import './assets/font/imports.css';

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

function AppContent() {
    return (
        <>
            <ScrollToHashElement />
            <Routes>
                <Route path="/" element={<Home />} />                 {/* ok */}
                <Route path="/login" element={<Login />} />         {/* ok */}
                <Route path="/contato" element={<Contato />} />  {/* ok */}
                <Route path="/SkillHelp" element={<Contato />} />   {/* ok */}
                <Route path="/game" element={<Game />} />  {/* Falta a placa de ranking */}
                <Route path="/jogo" element={<Jogo />} />  {/* css arrumar o tamanho dos  elementos */}
                <Route path="/perfil" element={<PerfilModal isMyProfile={true} />} />{/* falta a placa de perfil */} 
                <Route path="/suporte" element={<Suporte />} />  {/*  ok */}
                <Route path="/termos" element={<Termos />} />  {/* ok */}
                <Route path="/home" element={<Home />} />  {/* ok*/}    
                <Route path="/Correto" element={<Correto />} /> {/* arruam a img*/}    
                <Route path="/Errado" element={<Errado />} /> {/* arruam a img*/}
                <Route path="/LoadHost" element={<LoadHost />} />  {/* css arrumar o tamanho dos  elementos */}
                <Route path="/ajuda" element={<Suporte />} /> {/*ok*/}
                <Route path="/pin" element={<PinPage />} /> {/* ok */}
                <Route path="/createquiz" element={<CreateQuiz />} /> {/* css arrumar o estilo */}
                <Route path="/criarsala" element={<CriarSala />} />{/* css arrumar o estilo */}
                <Route path="/sala" element={<Sala />} />   {/* css arrumar o estilo */}
                <Route path="/fim" element={<FimDeJogo />} /> {/* css arrumar o estilo pequenos detalhes */}
                <Route path="/usuarios" element={<Usuarios />} />   {/* css arrumar o estilo */}
                <Route path="/admin/usuarios" element={<AdminUsers />} /> {/* css arrumar o estilo */}
                <Route path="/connection-error" element={<ConnectionError />} /> {/* ok */}
                <Route path="/ForgotPassword" element={<ForgotPassword />} /> {/* css arrumar o estilo */}
                <Route path="/ResetPassword" element={<ResetPassword />} />{/* css arrumar o estilo */}

            </Routes>
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
