// hooks/useAuth.js

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import authService from "../services/authService";
import api from "../services/api";

// 1. CRIAR O CONTEXTO
const AuthContext = createContext(null);

// 2. CRIAR O COMPONENTE PROVEDOR
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Começa carregando

  // --- LOGOUT ---
  const logout = useCallback(() => {
    console.log("AuthProvider: Executando logout...");
    setUserData(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    delete api.defaults.headers.common["Authorization"];
    // authService.logout(); // Se existir API de logout
  }, []);

  // --- INITAUTH --- (Roda uma vez ao carregar)
  useEffect(() => {
    const initAuth = async () => {
      console.log("AuthProvider (initAuth): Verificando token...");
      const token = sessionStorage.getItem("authToken");
      const storedUserData = sessionStorage.getItem("userData"); // Pega o user salvo

      if (token) {
        console.log("AuthProvider (initAuth): Token encontrado.");
        // Define o header imediatamente
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        if (storedUserData) {
          // Se já temos os dados do usuário salvos, usa eles
          console.log("AuthProvider (initAuth): Usando userData do sessionStorage.");
          try {
            const parsedUser = JSON.parse(storedUserData);
            setUserData(parsedUser);
            setIsLoggedIn(true);
          } catch (e) {
            console.error("AuthProvider (initAuth): Erro ao parsear userData. Deslogando.");
            logout();
          }
        } else {
          // Se não temos dados salvos, busca na API /me
          console.log("AuthProvider (initAuth): Buscando perfil na API...");
          try {
            const profileData = await authService.getUserProfile();
            if (profileData && typeof profileData === 'object') {
              sessionStorage.setItem("userData", JSON.stringify(profileData));
              setUserData(profileData);
              setIsLoggedIn(true);
              console.log("AuthProvider (initAuth): Perfil carregado da API e salvo.", profileData);
            } else {
              console.warn("AuthProvider (initAuth): API /me retornou dados inválidos. Deslogando.");
              logout();
            }
          } catch (error) {
            console.error("AuthProvider (initAuth): Falha ao buscar perfil (token inválido?). Deslogando.", error);
            logout();
          }
        }
      } else {
        console.log("AuthProvider (initAuth): Nenhum token encontrado.");
      }
      setLoading(false); // Termina o carregamento inicial
    };

    initAuth();
  }, [logout]);

  // --- LOGIN ---
  const login = async (email, senha) => {
    try {
      setLoading(true); // Começa loading do login
      const loginData = await authService.login(email, senha);
      if (!loginData || !loginData.token) {
        throw new Error("API de login não retornou um token.");
      }

      console.log("AuthProvider (login): Token recebido.");
      sessionStorage.setItem("authToken", loginData.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${loginData.token}`;

      console.log("AuthProvider (login): Buscando perfil após login...");
      const profileData = await authService.getUserProfile();
      if (!profileData || typeof profileData !== 'object') {
        throw new Error("API /me retornou dados de perfil inválidos após o login.");
      }

      sessionStorage.setItem("userData", JSON.stringify(profileData));
      setUserData(profileData);
      setIsLoggedIn(true);
      console.log("AuthProvider (login): Login completo. Perfil salvo.", profileData);
      setLoading(false); // Termina loading do login

    } catch (error) {
      console.error("❌ Erro no hook de login:", error);
      logout();
      setLoading(false); // Termina loading mesmo com erro
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Credenciais inválidas ou erro no login.";
      throw new Error(errorMessage); // Lança o erro para o componente de Login tratar
    }
  };

  // --- UPDATEUSERDATA ---
  const updateUserData = async (userId, dataToUpdate) => {
    try {
      const updatedUser = await authService.updateProfile(userId, dataToUpdate);
      if (updatedUser && typeof updatedUser === 'object') {
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        console.log("AuthProvider (update): UserData atualizado e salvo.");
        return { success: true, data: updatedUser };
      } else {
        throw new Error("Resposta da API de atualização inesperada.");
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Falha ao atualizar perfil.";
      throw new Error(errorMessage);
    }
  };

  // 3. VALORES QUE O CONTEXTO VAI FORNECER
  const value = {
    user: userData, // Renomeado para 'user' para consistência
    isLoggedIn,
    loading,
    login,
    logout,
    updateUserData,
  };

  // 4. RETORNAR O PROVEDOR COM OS VALORES
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. CRIAR E EXPORTAR O HOOK useAuth QUE CONSOME O CONTEXTO
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  // Se o contexto for 'null' (valor inicial antes do useEffect rodar), 
  // ainda assim retorna o objeto vazio para evitar erros, 
  // mas o 'loading' ainda será true.
  return context || { user: null, isLoggedIn: false, loading: true, login: () => { }, logout: () => { }, updateUserData: () => { } };
};