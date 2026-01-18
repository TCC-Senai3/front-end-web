import { useState, useEffect } from 'react';
import authService from '../services/authService'; // Garanta que este caminho está correto

export const useAuth = () => {
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // ESTA É A PARTE ATUALIZADA
    useEffect(() => {
        const initAuth = async () => {
            // 1. Verifica se existe um token salvo (a única coisa que importa)
            const token = sessionStorage.getItem('authToken'); // ou localStorage

            if (token) {
                try {
                    // 2. Se tem token, VAI AO BACKEND buscar os dados frescos do perfil
                    const response = await authService.getUserProfile();
                    
                    if (response.success) {
                        // 3. Se a busca deu certo, atualiza o estado com os dados do backend
                        setUserData(response.data);
                        setIsLoggedIn(true);
                    } else {
                        // 4. Se o token for inválido (expirado, etc.), faz o logout
                        logout();
                    }
                } catch (error) {
                    console.error("Token encontrado, mas falha ao buscar perfil.", error);
                    logout();
                }
            }
            // Avisa que o carregamento inicial terminou
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, senha) => {
        try {
            const result = await authService.login(email, senha);
            
            if (result.success && result.data.token) {
                // Salva o token no storage
                sessionStorage.setItem('authToken', result.data.token);

                // IMPORTANTE: Após o login, busca os dados do perfil imediatamente
                const profileResponse = await authService.getUserProfile();
                if (profileResponse.success) {
                    setUserData(profileResponse.data);
                    setIsLoggedIn(true);
                    return { success: true };
                }
            }
            throw new Error(result.message || 'Falha no login');
        } catch (error) {
            console.error('❌ Erro no hook de login:', error);
            logout(); // Garante que tudo esteja limpo em caso de falha
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUserData(null);
        setIsLoggedIn(false);
    };

    // A função de update pode ser mantida, mas a lógica principal já está no AuthContext
    const updateUserData = async (newUserData) => {
        try {
            const result = await authService.updateProfile(newUserData.id, newUserData);
            if (result.success) {
                setUserData(result.data);
            }
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
        }
    };

    return {
        userData,
        isLoggedIn,
        loading,
        login,
        logout,
        updateUserData
    };
};