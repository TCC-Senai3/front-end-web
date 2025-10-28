import { useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

export const useAuth = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    console.log("useAuth: Executando logout..."); // LOG DE DEBUG
    authService.logout();
    setUserData(null);
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem("authToken");

 
      if (token) {
        try {
 

          const profileData = await authService.getUserProfile();

          setUserData(profileData);
          setIsLoggedIn(true);
        } catch (error) {
          console.log("useAuth (initAuth): Chamando logout() devido à falha.");
          logout();
        }
      } else {
       
        
      }

      setLoading(false);
    };

    initAuth();
  }, [logout]); // ... (O resto do seu hook, como 'login' e 'updateUserData', não precisa mudar) ...

  const login = async (email, senha) => {
    try {
      const loginData = await authService.login(email, senha);
      sessionStorage.setItem("authToken", loginData.token);

      

      setUserData(loginData.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("❌ Erro no hook de login:", error);
      logout();
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Credenciais inválidas. Verifique seu e-mail e senha.";
      throw new Error(errorMessage);
    }
  };

  const updateUserData = async (userId, dataToUpdate) => {
    try {
      const updatedUser = await authService.updateProfile(userId, dataToUpdate);
      setUserData(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      const errorMessage =
        error.response?.data?.message || "Falha ao atualizar perfil.";
      throw new Error(errorMessage);
    }
  };

  return {
    userData,
    isLoggedIn,
    loading,
    login,
    logout,
    updateUserData,
  };
};
