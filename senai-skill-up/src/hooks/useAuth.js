// hooks/useAuth.js

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import authService from "../services/authService"; // Assume que tem getUserProfile e updateProfile
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading inicial // --- LOGOUT --- (sem alterações)

  const logout = useCallback(() => {
    console.log("AuthProvider: Logout");
    setUserData(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    delete api.defaults.headers.common["Authorization"];
  }, []);

  // --- FUNÇÃO PARA BUSCAR E ATUALIZAR DADOS DO USUÁRIO ---
  // Usada no initAuth, login e pode ser chamada manualmente (refreshUserData)
  const fetchAndUpdateUser = useCallback(async () => {
    console.log("AuthProvider: Buscando perfil (/me)...");
    try {
      const profileData = await authService.getUserProfile(); // Chama GET /usuarios/me
      if (profileData && typeof profileData === "object" && profileData.id) {
        console.log("AuthProvider: Perfil recebido:", profileData);
        sessionStorage.setItem("userData", JSON.stringify(profileData));
        setUserData(profileData); // <<< ATUALIZA O ESTADO
        setIsLoggedIn(true);
        return profileData; // Retorna para quem chamou (opcional)
      } else {
        console.warn("AuthProvider: Resposta de /me inválida. Deslogando.");
        logout();
        throw new Error("Dados de perfil inválidos recebidos.");
      }
    } catch (error) {
      console.error(
        "AuthProvider: Falha ao buscar perfil (token pode ter expirado?). Deslogando.",
        error
      );
      logout();
      throw error; // Re-lança o erro
    }
  }, [logout]); // Depende de logout // --- INITAUTH --- (Usa fetchAndUpdateUser)

  useEffect(() => {
    const initAuth = async () => {
      console.log("AuthProvider (initAuth): Verificando token...");
      const token = sessionStorage.getItem("authToken");
      // Não usa mais storedUserData diretamente, sempre busca se tiver token

      if (token) {
        console.log(
          "AuthProvider (initAuth): Token encontrado. Definindo header e buscando perfil."
        );
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          await fetchAndUpdateUser(); // Busca dados frescos
          console.log("AuthProvider (initAuth): Perfil carregado com sucesso.");
        } catch (error) {
          console.log(
            "AuthProvider (initAuth): Falha ao carregar perfil inicial (ignorado)."
          );
          // O erro já foi logado e o logout chamado dentro de fetchAndUpdateUser
        }
      } else {
        console.log("AuthProvider (initAuth): Nenhum token encontrado.");
      }
      setLoading(false); // Termina o carregamento inicial DEPOIS de tentar buscar
    };
    initAuth();
  }, [fetchAndUpdateUser]); // Agora depende de fetchAndUpdateUser // --- LOGIN --- (Usa fetchAndUpdateUser)

  const login = async (email, senha) => {
    try {
      setLoading(true);
      const loginData = await authService.login(email, senha); // Chama POST /usuarios/login
      if (!loginData?.token)
        throw new Error("API de login não retornou token.");

      console.log(
        "AuthProvider (login): Token recebido. Salvando e buscando perfil..."
      );
      sessionStorage.setItem("authToken", loginData.token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginData.token}`;

      await fetchAndUpdateUser(); // Busca e atualiza o usuário após login

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
