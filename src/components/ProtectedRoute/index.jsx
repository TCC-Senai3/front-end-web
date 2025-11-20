import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions'; // Importa o hook corrigido

// Crie ou importe seu componente de Loader
const Loader = () => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
    }}>
        Carregando...
    </div>
);

export default function ProtectedRoute({ children, requiredRole, requiredPermission }) {
  // Pega os dados do hook de permissões
  const { isLoggedIn, loading, hasPermission, isAdmin } = usePermissions();
  const location = useLocation();

  // 1. Se o hook 'useAuth' ainda está carregando, mostra o loader
  if (loading) {
    return <Loader />;
  }

  // 2. Se não estiver logado, redireciona para o login
  if (!isLoggedIn) {
    // Salva a página que o usuário tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Verifica permissão específica (ADM, CRIADOR, etc.)
  const permission = requiredPermission || requiredRole;
  
  if (permission) {
    // Se for ADM, verifica se é admin
    if (permission === 'ADM' || permission === 'ADMIN') {
      if (!isAdmin) {
        return <Navigate to="/unauthorized" replace />;
      }
    } else {
      // Para outras permissões, usa hasPermission
      if (!hasPermission(permission)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  // 4. Se passou em tudo (logado e com permissão), renderiza a página
  return children;
}