import { useAuth } from "./useAuth"; // Seu hook de autenticação

// Hook para verificar permissões do usuário
export const usePermissions = () => {
  // ****** CORREÇÃO 1: Pegar 'user' em vez de 'userData' ******
  const { user, isLoggedIn, loading } = useAuth();
  /**
  * Função interna para extrair as roles do objeto 'user'.
  * Esta função ESTÁ PRONTA para o seu log: { ... roles: [...] }
  */

  const extractRoles = (currentUser) => {
    // Renomeado parâmetro para clareza
    if (!currentUser) return [];

    let roles = []; // Checa 'tipoUsuario' (se existir)

    if (typeof currentUser.tipoUsuario === "string") {
      roles.push(currentUser.tipoUsuario);
    } else if (
      currentUser.tipoUsuario &&
      typeof currentUser.tipoUsuario.nome === "string"
    ) {
      roles.push(currentUser.tipoUsuario.nome);
    } // Checa 'roles' (array de strings, como no seu log)
    if (Array.isArray(currentUser.roles)) {
      currentUser.roles.forEach((role) => {
        if (typeof role === "string") {
          roles.push(role); // Ex: Adiciona "ROLE_CRIADOR_FORMULARIO"
        }
        // Adicione aqui se a role puder ser um objeto { nome: "..." } dentro do array
        // else if (role && typeof role.nome === 'string') {
        //   roles.push(role.nome);
        // }
      });
    } // Retorna um array de roles únicas

    // Adicione aqui se as roles vierem de 'authorities: [{ authority: "..." }]'
    // if (Array.isArray(currentUser.authorities)) {
    //   currentUser.authorities.forEach(auth => {
    //     if (auth && typeof auth.authority === 'string') {
    //        roles.push(auth.authority);
    //     }
    //   });
    // }

    return [...new Set(roles)];
  };

  // ****** CORREÇÃO 2: Passar 'user' para extractRoles ******
  const userRoles = extractRoles(user);
  // Adiciona um log para depuração
  console.log("usePermissions - User:", user);
  console.log("usePermissions - Extracted Roles:", userRoles); // --- Funções de verificação (sem alterações na lógica interna) ---

  const isAdmin = () => {
    return userRoles.includes("ROLE_ADMIN");
  };

  const canCreateQuiz = () => {
    // Permite se for ADMIN ou CRIADOR_FORMULARIO
    // (Verifica se userRoles não está vazio antes para evitar falso positivo se extractRoles falhar)
    return (
      userRoles.length > 0 &&
      (userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_CRIADOR_FORMULARIO"))
    );
  };

  const hasPermission = (permission) => {
    if (!isLoggedIn) return false;
    if (!permission) return true; // Permite se nenhuma permissão for exigida
    // Verifica se userRoles não está vazio antes de checar
    return userRoles.length > 0 && userRoles.includes(permission);
  };

  return {
    // Retorna os valores booleanos calculados
    isAdmin: isAdmin(),
    canCreateQuiz: canCreateQuiz(), // Retorna a FUNÇÃO para checagens dinâmicas no ProtectedRoute
    hasPermission,
    userRoles, // Array de roles extraídas (para depuração)
    user, // O objeto 'user' completo (substitui userData)
    isLoggedIn,
    loading,
  };
};