import { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import authService from '../services/authService'; // Garanta que este caminho está correto

export const useAuth = () => {
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // Controla o carregamento inicial da autenticação

    // Função de logout é usada em vários lugares, então a definimos com useCallback
    const logout = useCallback(() => {
        authService.logout();
        setUserData(null);
        setIsLoggedIn(false);
    }, []);

    // Verifica a autenticação quando o aplicativo carrega pela primeira vez
    useEffect(() => {
        const initAuth = async () => {
            const token = sessionStorage.getItem('authToken');

            if (token) {
                try {
                    // Se tem token, busca os dados do perfil no backend.
                    // A `api` já está configurada para enviar o token nos headers.
                    const profileData = await authService.getUserProfile();
                    
                    // Se a chamada acima deu certo, o código continua. Se deu erro, vai para o catch.
                    setUserData(profileData);
                    setIsLoggedIn(true);

                } catch (error) {
                    console.error("Falha ao validar token e buscar perfil:", error);
                    // Se o token for inválido/expirado, o backend dará erro e faremos o logout.
                    logout();
                }
            }
            // Avisa que o carregamento inicial terminou, mesmo se não houver token.
            setLoading(false);
        };

        initAuth();
    }, [logout]); // Adicionamos logout como dependência do useEffect

    /**
     * Função de login.
     * Recebe email e senha, chama o serviço e atualiza o estado global.
     */
    const login = async (email, senha) => {
        try {
            // 1. Chama o serviço de login. Se der certo, retorna os dados com o token.
            const loginData = await authService.login(email, senha);

            // 2. Salva o token para manter a sessão
            sessionStorage.setItem('authToken', loginData.token);
            
            // 3. Atualiza o estado da aplicação com os dados do usuário
            // (não precisamos buscar o perfil de novo, pois a resposta do login já pode conter os dados do usuário)
            setUserData(loginData.user); // Supondo que a resposta do login seja { token: "...", user: {...} }
            setIsLoggedIn(true);

        } catch (error) {
            console.error('❌ Erro no hook de login:', error);
            logout(); // Garante que tudo esteja limpo em caso de falha

            // 4. Extrai a mensagem de erro específica do backend para mostrar no formulário
            const errorMessage = 
                error.response?.data?.message || // Mensagem customizada do backend
                error.response?.data ||          // Mensagem de erro genérica do backend
                'Credenciais inválidas. Verifique seu e-mail e senha.';

            // 5. Lança o erro com a mensagem tratada para o componente poder exibi-la
            throw new Error(errorMessage);
        }
    };

    /**
     * Atualiza os dados do usuário.
     * Esta função pode ser chamada de uma página de perfil, por exemplo.
     */
    const updateUserData = async (userId, dataToUpdate) => {
        try {
            const updatedUser = await authService.updateProfile(userId, dataToUpdate);
            setUserData(updatedUser); // Atualiza o estado com os novos dados
            return { success: true, data: updatedUser };
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
            const errorMessage = error.response?.data?.message || 'Falha ao atualizar perfil.';
            throw new Error(errorMessage);
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