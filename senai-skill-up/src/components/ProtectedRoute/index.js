import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Componente para proteger rotas baseado em permissões
const ProtectedRoute = ({ 
  children, 
  requiredPermission = null, 
  requiredRole = null,
  fallbackPath = '/login',
  showUnauthorized = true 
}) => {
  const { 
    isLoggedIn, 
    loading, 
    hasPermission, 
    userData,
    isAdmin,
    canCreateQuiz,
    canManageUsers,
    canAccessAdmin
  } = usePermissions();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Se não estiver logado, redirecionar para login
      if (!isLoggedIn) {
        navigate(fallbackPath);
        return;
      }

      // Verificar permissões específicas
      if (requiredPermission && !hasPermission(requiredPermission)) {
        if (showUnauthorized) {
          alert('❌ Você não tem permissão para acessar esta página.');
        }
        navigate('/unauthorized');
        return;
      }

      // Verificar roles específicas
      if (requiredRole) {
        let hasRequiredRole = false;
        
        switch (requiredRole) {
          case 'ADMIN':
            hasRequiredRole = isAdmin;
            break;
          case 'CREATOR':
            hasRequiredRole = canCreateQuiz;
            break;
          case 'USER_MANAGER':
            hasRequiredRole = canManageUsers;
            break;
          default:
            hasRequiredRole = userData?.tipoUsuario === requiredRole || 
                             userData?.role === requiredRole;
        }

        if (!hasRequiredRole) {
          if (showUnauthorized) {
            alert('❌ Você não tem permissão para acessar esta página.');
          }
          navigate('/unauthorized');
          return;
        }
      }
    }
  }, [isLoggedIn, loading, requiredPermission, requiredRole, navigate, fallbackPath, showUnauthorized]);

  // Mostrar loading enquanto verifica permissões
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Verificando permissões...
      </div>
    );
  }

  // Se não estiver logado, não renderizar nada (será redirecionado)
  if (!isLoggedIn) {
    return null;
  }

  // Renderizar o conteúdo protegido
  return children;
};

export default ProtectedRoute;