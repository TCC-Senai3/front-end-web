import { useAuth } from './useAuth';

// Hook para verificar permissões do usuário
export const usePermissions = () => {
  const { userData, isLoggedIn, loading } = useAuth();

  // Verificar se o usuário é administrador
  const isAdmin = () => {
    if (!isLoggedIn || !userData) return false;
    return userData.tipoUsuario === 'ADMINISTRADOR' || 
           userData.permissoes === 'ADM' ||
           userData.role === 'ADMIN';
  };

  // Verificar se o usuário pode criar quizzes
  const canCreateQuiz = () => {
    if (!isLoggedIn || !userData) return false;
    return userData.tipoUsuario === 'ADMINISTRADOR' || 
           userData.tipoUsuario === 'CRIADOR' ||
           userData.permissoes === 'ADM' ||
           userData.permissoes === 'CRIADOR' ||
           userData.role === 'ADMIN' ||
           userData.role === 'CREATOR';
  };

  // Verificar se o usuário pode gerenciar usuários
  const canManageUsers = () => {
    if (!isLoggedIn || !userData) return false;
    return userData.tipoUsuario === 'ADMINISTRADOR' || 
           userData.permissoes === 'ADM' ||
           userData.role === 'ADMIN';
  };

  // Verificar se o usuário pode acessar área administrativa
  const canAccessAdmin = () => {
    if (!isLoggedIn || !userData) return false;
    return userData.tipoUsuario === 'ADMINISTRADOR' || 
           userData.permissoes === 'ADM' ||
           userData.role === 'ADMIN';
  };

  // Verificar se o usuário tem uma permissão específica
  const hasPermission = (permission) => {
    if (!isLoggedIn || !userData) return false;
    
    const userPermissions = userData.permissoes || [];
    const userRole = userData.tipoUsuario || userData.role;
    
    // Verificar por role
    if (userRole === 'ADMINISTRADOR' || userRole === 'ADMIN') return true;
    
    // Verificar por permissão específica
    if (Array.isArray(userPermissions)) {
      return userPermissions.includes(permission);
    }
    
    return userPermissions === permission;
  };

  return {
    isAdmin: isAdmin(),
    canCreateQuiz: canCreateQuiz(),
    canManageUsers: canManageUsers(),
    canAccessAdmin: canAccessAdmin(),
    hasPermission,
    userData,
    isLoggedIn,
    loading
  };
};
