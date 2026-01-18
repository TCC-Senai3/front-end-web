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
  const [loading, setLoading] = useState(true); 

  // ✅ NOVA FUNÇÃO: RETORNA O TOKEN JWT
  // Necessária para autenticação de WebSockets e outros serviços que não usam o header padrão do 'api'.
  const getAuthToken = useCallback(() => {
    return sessionStorage.getItem("authToken");
  }, []);

  // --- LOGOUT ---
  const logout = useCallback(() => {
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
  }, []);

  // --- FUNÇÃO PARA BUSCAR E ATUALIZAR DADOS DO USUÁRIO ---
  const fetchAndUpdateUser = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (loading) return userData;
    
    // Tenta obter do cache primeiro (com TTL de 5 minutos)
    const cachedProfile = getCache(CACHE_KEYS.USER_PROFILE, STORAGE_TYPES.SESSION);
    if (cachedProfile) {
      setUserData(cachedProfile);
      setIsLoggedIn(true);
      return cachedProfile;
    }
    
    try {
      const profileData = await authService.getUserProfile();
      
      if (profileData?.id) {
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
        logout();
        throw new Error("Dados de perfil inválidos recebidos.");
      }
    } catch (error) {
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
  }, [logout, loading, userData]); 

  // Initialize auth state on component mount
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      if (!isMounted) return;
      
      const token = getAuthToken(); // Usando a nova função
      
      // Se não tem token, não está autenticado
      if (!token) {
        if (isMounted) {
          setUserData(null);
          setIsLoggedIn(false);
          setLoading(false);
        }
        return;
      }
      
      // Se tem token, tenta validá-lo
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      try {
        // Tenta buscar o perfil do usuário
        const profileData = await authService.getUserProfile();
        
        if (!isMounted) return;
        
        if (profileData?.id) {
          sessionStorage.setItem("userData", JSON.stringify(profileData));
          setUserData(profileData);
          setIsLoggedIn(true);
        } else {
          logout();
        }
      } catch (error) {
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
        const token = getAuthToken(); // Usando a nova função
        if (!token) {
          setUserData(null);
          setIsLoggedIn(false);
        } else if (isLoggedIn) {
          // Verifica se o token está prestes a expirar (nos próximos 2 minutos)
          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const expiresIn = (tokenData.exp * 1000) - Date.now();
            
            if (expiresIn < 120000) { // 2 minutos
              fetchAndUpdateUser().catch(() => {});
            }
          } catch (e) {
            // Erro silencioso ao verificar expiração do token
          }
        }
      }
    }, 300000); // Verifica a cada 5 minutos
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(checkAuthInterval);
    };
    // ATUALIZADO: Inclui getAuthToken, isLoggedIn, logout, fetchAndUpdateUser nas dependências
  }, [getAuthToken, isLoggedIn, logout, fetchAndUpdateUser]); 

  const login = async (email, senha) => {
    try {
      setLoading(true);
      const loginData = await authService.login(email, senha);
      
      if (!loginData?.token) {
        throw new Error("API de login não retornou token.");
      }

      // Save token and update headers
      sessionStorage.setItem("authToken", loginData.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${loginData.token}`;

      // Fetch user profile
      const userProfile = await fetchAndUpdateUser();
      
      if (!userProfile) {
        throw new Error("Falha ao carregar perfil do usuário após login");
      }
      
      setLoading(false);
      return userProfile; // Return user profile on success
    } catch (error) {
      logout(); // Garante logout em caso de falha
      setLoading(false);
      throw error; // Re-lança para o componente Login tratar
    }
  }; 

  // --- UPDATEUSERDATA --- (PARA EDIÇÃO DE PERFIL, NÃO PONTUAÇÃO)
  const updateUserData = async (userId, dataToUpdate) => {
    // IMPORTANTE: NUNCA PERMITIR 'pontuacao' em dataToUpdate vindo do cliente.
    // A validação deve ocorrer no backend (UsuarioService.java).
    try {
      // Chama PUT /usuarios/{id} (ou similar)
      const updatedUser = await authService.updateProfile(userId, dataToUpdate);
      if (updatedUser && typeof updatedUser === "object" && updatedUser.id) {
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
        setUserData(updatedUser); // <<< ATUALIZA O ESTADO LOCAL
        return { success: true, data: updatedUser };
      } else {
        throw new Error("Resposta da API de atualização inesperada.");
      }
    } catch (error) {
      // Re-lança o erro com uma mensagem mais clara se possível
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Falha ao atualizar perfil.";
      throw new Error(errorMessage);
    }
  };

  // --- REFRESH USER DATA ---
  const refreshUserData = useCallback(async () => {
    if (!isLoggedIn) {
      return; // Não faz nada se não estiver logado
    }
    // Reutiliza a lógica centralizada de busca e atualização
    try {
      await fetchAndUpdateUser();
    } catch (error) {
      // O erro já foi tratado (e logout chamado se necessário) em fetchAndUpdateUser
    }
  }, [isLoggedIn, fetchAndUpdateUser]); 

  // --- VALORES FORNECIDOS PELO CONTEXTO ---
  const value = {
    user: userData, 
    isLoggedIn,
    loading, 
    login,
    logout,
    updateUserData, 
    refreshUserData, 
    getAuthToken, // ✅ EXPOSTO
  };

  return (
    <AuthContext.Provider value={value}>
            {children}
    </AuthContext.Provider>
  );
};

// --- HOOK useAuth ---
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
      refreshUserData: async () => {}, 
      getAuthToken: () => null, // ✅ VALOR P
    }
  );
};