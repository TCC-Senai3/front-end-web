import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Verificar se usuário está autenticado
  if (!authService.isAuthenticated()) {
    // Redirecionar para login com o caminho atual salvo
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Usuário autenticado - permitir acesso
  return children;
};

export default ProtectedRoute;
