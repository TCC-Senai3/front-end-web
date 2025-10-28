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

export default function ProtectedRoute({ children, requiredRole }) {
  // Pega os dados do hook de permissões
  const { isLoggedIn, loading, hasPermission } = usePermissions();
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

  // 3. Se estiver logado, mas não tiver a 'requiredRole'
  // A função 'hasPermission' agora está correta
  if (requiredRole && !hasPermission(requiredRole)) {
    // Redireciona para a página de "Não Autorizado"
    console.warn(`ProtectedRoute: Acesso negado. Rota [${location.pathname}] requer [${requiredRole}]`);
    return <Navigate to="/unauthorized" replace />; 
  }

  // 4. Se passou em tudo (logado e com permissão), renderiza a página
  return children;
}