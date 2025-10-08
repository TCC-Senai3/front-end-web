import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            // Verifica se já está autenticado
            const currentUser = authService.getCurrentUser();
            
            if (currentUser && authService.isAuthenticated()) {
                setUserData(currentUser);
                setIsLoggedIn(true);
            } else {
                setUserData(null);
                setIsLoggedIn(false);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, senha) => {
        try {
            console.log('🔐 Iniciando login com email:', email);
            const result = await authService.login(email, senha);
            
            if (result.success) {
                setUserData(result.data.user);
                setIsLoggedIn(true);
                return result;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUserData(null);
        setIsLoggedIn(false);
    };

    const updateUserData = async (newUserData) => {
        try {
            const result = await authService.updateProfile(newUserData.userId || newUserData.id, newUserData);
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
