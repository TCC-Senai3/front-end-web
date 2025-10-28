import { useAuth } from './useAuth'; // Seu hook de autenticação

// Hook para verificar permissões do usuário
export const usePermissions = () => {
  const { userData, isLoggedIn, loading } = useAuth();

  /**
   * Função interna para extrair as roles do objeto 'userData'.
   * Esta função ESTÁ PRONTA para o seu log: { ... roles: [...] }
   */
  const extractRoles = (user) => {
    if (!user) return [];

    let roles = [];

    // Checa 'tipoUsuario' (se for string ou objeto)
    if (typeof user.tipoUsuario === 'string') {
      roles.push(user.tipoUsuario);
    } else if (user.tipoUsuario && typeof user.tipoUsuario.nome === 'string') {
      roles.push(user.tipoUsuario.nome);
    }
    
    // --- ESTA É A LÓGICA QUE VAI FUNCIONAR ---
    // Checa 'roles' (que é um array de strings, como no seu log)
    if (Array.isArray(user.roles)) {
      user.roles.forEach(role => {
        if (typeof role === 'string') {
          roles.push(role); // Ex: Adiciona "ROLE_CRIADOR_FORMULARIO"
        } else if (role && typeof role.nome === 'string') {
          roles.push(role.nome);
        }
      });
    }
    // --- FIM DA LÓGICA ---

    // Retorna um array de roles únicas
    return [...new Set(roles)];
  };

  // 'userRoles' agora será: ['ROLE_CRIADOR_FORMULARIO']
  const userRoles = extractRoles(userData);

  // --- Funções de verificação ---

  const isAdmin = () => {
    return userRoles.includes('ROLE_ADMIN');
  };

  const canCreateQuiz = () => {
    return userRoles.includes('ROLE_ADMIN') || 
           userRoles.includes('ROLE_CRIADOR_FORMULARIO');
  };

  // 'hasPermission' é a função que o ProtectedRoute usa
  const hasPermission = (permission) => {
    if (!isLoggedIn) return false;
    
  	// Se a permissão for nula ou indefinida (rotas abertas), permite
  	if (!permission) return true; 

  	// Verifica se a permissão está no array de roles
    return userRoles.includes(permission);
  };

  return {
  	// Retorna os valores booleanos
    isAdmin: isAdmin(),
    canCreateQuiz: canCreateQuiz(),
    
    // Retorna a FUNÇÃO para checagens dinâmicas
    hasPermission, 
    
    userRoles, // Para depuração
    userData,
    isLoggedIn,
    loading
  };
};