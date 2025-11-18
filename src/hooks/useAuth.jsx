// hooks/useAuth.js

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import authService from "../services/authService";
import api from "../services/api";
import { 
  clearUserCache, 
  CACHE_KEYS, 
  STORAGE_TYPES, 
  setCache, 
  getCache, 
  removeCache 
} from "../services/cacheService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading inicial // --- LOGOUT --- (sem alterações)

  const logout = useCallback(() => {
    console.log("AuthProvider: Logout - Iniciando limpeza de autenticação");
    
    // Limpa os dados de autenticação
    setUserData(null);
    setIsLoggedIn(false);
    
    // Remove tokens e dados do usuário
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userData");
    
    // Remove o cabeçalho de autorização
    delete api.defaults.headers.common["Authorization"];
    
    // Limpa o cache do usuário
    clearUserCache();
    
    console.log("AuthProvider: Logout concluído - Dados do usuário removidos");
  }, []);

  // --- FUNÇÃO PARA BUSCAR E ATUALIZAR DADOS DO USUÁRIO ---
  // Usada no initAuth, login e pode ser chamada manualmente (refreshUserData)
  const fetchAndUpdateUser = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (loading) return userData;
    
    console.log("AuthProvider: Buscando perfil (/me)...");
    
    // Tenta obter do cache primeiro (com TTL de 5 minutos)
    const cachedProfile = getCache(CACHE_KEYS.USER_PROFILE, STORAGE_TYPES.SESSION);
    if (cachedProfile) {
      console.log("AuthProvider: Usando perfil do cache");
      setUserData(cachedProfile);
      setIsLoggedIn(true);
      return cachedProfile;
    }
    
    try {
      const profileData = await authService.getUserProfile();
      
      if (profileData?.id) {
        console.log("AuthProvider: Perfil recebido:", profileData);
        
        // Armazena no cache da sessão (expira em 5 minutos)
        setCache(
          CACHE_KEYS.USER_PROFILE, 
          profileData, 
          STORAGE_TYPES.SESSION, 
          300 // 5 minutos em segundos
        );
        
        // Atualiza o estado
        setUserData(profileData);
        setIsLoggedIn(true);
        
        return profileData;
      } else {
        console.warn("AuthProvider: Resposta de /me inválida. Deslogando.");
        logout();
        throw new Error("Dados de perfil inválidos recebidos.");
      }
    } catch (error) {
      console.error("AuthProvider: Falha ao buscar perfil:", error.message);
      
      // Se for um erro 401, limpa o cache do perfil
      if (error.response?.status === 401) {
        removeCache(CACHE_KEYS.USER_PROFILE, STORAGE_TYPES.SESSION);
      } else {
        // Para outros erros, faz logout
        logout();
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [logout, loading, userData]); // Added loading and userData to dependencies

  // Initialize auth state on component mount
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      if (!isMounted) return;
      
      console.log("AuthProvider (initAuth): Verificando token...");
      const token = sessionStorage.getItem("authToken");
      
      // Se não tem token, não está autenticado
      if (!token) {
        console.log("AuthProvider (initAuth): Nenhum token encontrado.");
        if (isMounted) {
          setUserData(null);
          setIsLoggedIn(false);
          setLoading(false);
        }
        return;
      }
      
      // Se tem token, tenta validá-lo
      console.log("AuthProvider (initAuth): Token encontrado. Verificando...");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      try {
        // Tenta buscar o perfil do usuário
        const profileData = await authService.getUserProfile();
        
        if (!isMounted) return;
        
        if (profileData?.id) {
          console.log("AuthProvider (initAuth): Perfil carregado com sucesso.", profileData);
          sessionStorage.setItem("userData", JSON.stringify(profileData));
          setUserData(profileData);
          setIsLoggedIn(true);
        } else {
          console.warn("AuthProvider: Resposta de /me inválida. Deslogando.");
          logout();
        }
      } catch (error) {
        console.warn("AuthProvider (initAuth): Falha ao carregar perfil:", error.message);
        // Não faz logout aqui para evitar loops
        if (isMounted) {
          setUserData(null);
          setIsLoggedIn(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Inicializa a autenticação apenas uma vez ao montar
    initAuth();
    
    // Configura um intervalo para verificar periodicamente se o token ainda é válido (a cada 5 minutos)
    const checkAuthInterval = setInterval(() => {
      if (isMounted) {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          setUserData(null);
          setIsLoggedIn(false);
        } else if (isLoggedIn) {
          // Verifica se o token está prestes a expirar (nos próximos 2 minutos)
          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const expiresIn = (tokenData.exp * 1000) - Date.now();
            
            if (expiresIn < 120000) { // 2 minutos
              console.log("Token prestes a expirar, renovando...");
              fetchAndUpdateUser().catch(console.error);
            }
          } catch (e) {
            console.error("Erro ao verificar expiração do token:", e);
          }
        }
      }
    }, 300000); // Verifica a cada 5 minutos
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(checkAuthInterval);
    };
  }, []); // Sem dependências para executar apenas uma vez on mount

  const login = async (email, senha) => {
    try {
      setLoading(true);
      const loginData = await authService.login(email, senha);
      
      if (!loginData?.token) {
        throw new Error("API de login não retornou token.");
      }

      console.log("AuthProvider (login): Token recebido. Salvando e buscando perfil...");
      
      // Save token and update headers
      sessionStorage.setItem("authToken", loginData.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${loginData.token}`;

      // Fetch user profile
      const userProfile = await fetchAndUpdateUser();
      
      if (!userProfile) {
        throw new Error("Falha ao carregar perfil do usuário após login");
      }
      
      return userProfile; // Return user profile on success

      console.log("AuthProvider (login): Login completo.");
      setLoading(false);
    } catch (error) {
      console.error("❌ Erro no hook de login:", error);
      logout(); // Garante logout em caso de falha
      setLoading(false);
      throw error; // Re-lança para o componente Login tratar
    }
  }; // --- UPDATEUSERDATA --- (PARA EDIÇÃO DE PERFIL, NÃO PONTUAÇÃO)

  // Mantém a função, mas ela NÃO deve ser usada para pontuação.
  const updateUserData = async (userId, dataToUpdate) => {
    // IMPORTANTE: NUNCA PERMITIR 'pontuacao' em dataToUpdate vindo do cliente.
    // A validação deve ocorrer no backend (UsuarioService.java).
    console.log("AuthProvider (update): Tentando atualizar perfil:", {
      userId,
      dataToUpdate,
    });
    try {
      // Chama PUT /usuarios/{id} (ou similar)
      const updatedUser = await authService.updateProfile(userId, dataToUpdate);
      if (updatedUser && typeof updatedUser === "object" && updatedUser.id) {
        console.log(
          "AuthProvider (update): Perfil atualizado pela API:",
          updatedUser
        );
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
        setUserData(updatedUser); // <<< ATUALIZA O ESTADO LOCAL
        return { success: true, data: updatedUser };
      } else {
        throw new Error("Resposta da API de atualização inesperada.");
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      // Re-lança o erro com uma mensagem mais clara se possível
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Falha ao atualizar perfil.";
      throw new Error(errorMessage);
    }
  };

  // --- NOVA FUNÇÃO: REFRESH USER DATA ---
  // Simplesmente chama fetchAndUpdateUser novamente.
  const refreshUserData = useCallback(async () => {
    if (!isLoggedIn) {
      console.warn(
        "AuthProvider (refresh): Usuário não está logado, não pode atualizar."
      );
      return; // Não faz nada se não estiver logado
    }
    // Reutiliza a lógica centralizada de busca e atualização
    try {
      await fetchAndUpdateUser();
      console.log("AuthProvider (refresh): Dados do usuário atualizados.");
    } catch (error) {
      console.error(
        "AuthProvider (refresh): Falha ao atualizar dados do usuário.",
        error
      );
      // O erro já foi tratado (e logout chamado se necessário) em fetchAndUpdateUser
    }
  }, [isLoggedIn, fetchAndUpdateUser]); // Depende de isLoggedIn e da função de busca // --- VALORES FORNECIDOS PELO CONTEXTO ---

  const value = {
    user: userData, // <<<<<<< NOME CORRETO É 'user'
    isLoggedIn,
    loading, // Loading inicial da autenticação
    login,
    logout,
    updateUserData, // Para edição de perfil (NÃO PONTUAÇÃO)
    refreshUserData, // <<< NOVA FUNÇÃO EXPOSTA
  };

  return (
    <AuthContext.Provider value={value}>
            {children}
    </AuthContext.Provider>
  );
};

// --- HOOK useAuth --- (Adiciona refreshUserData)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  // Retorna um objeto padrão consistente enquanto carrega ou se o contexto for nulo
  return (
    context || {
      user: null,
      isLoggedIn: false,
      loading: true,
      login: async () => {},
      logout: () => {},
      updateUserData: async () => {},
      refreshUserData: async () => {}, // <<< VALOR PADRÃO
    }
  );
};
