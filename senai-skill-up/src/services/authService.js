// Serviço de autenticação preparado para backend Java
import api from './api';

// Classe para gerenciar autenticação
class AuthService {
  // Realizar login
  async login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro no login'
      };
    }
  }

  // Realizar cadastro
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro no cadastro'
      };
    }
  }

  // Verificar autenticação
  isAuthenticated() {
    return !!sessionStorage.getItem('authToken');
  }

  // Obter usuário atual
  getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  // Obter dados do usuário
  async getUserProfile(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao buscar perfil'
      };
    }
  }

  // Atualizar perfil
  async updateProfile(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao atualizar perfil'
      };
    }
  }

  // Fazer logout
  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
  }

  // Reset password
  async resetPassword(email) {
    try {
      await api.post('/auth/reset-password', { email });
      return {
        success: true,
        message: 'Email enviado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao enviar email'
      };
    }
  }
}

const authService = new AuthService();
export default authService; // Substitui o conteúdo existente