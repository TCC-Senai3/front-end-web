// Serviço de usuários preparado para backend Java
import api from './api';

class UserService {
  // Buscar todos os usuários
  async getAllUsers() {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  async getUserById(userId) {
    try {
      const response = await api.get(`/usuario/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Criar novo usuário
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualizar usuário
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Deletar usuário
  async deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  // Buscar usuários por filtros
  async getUsersByFilters(filters = {}) {
    try {
      const response = await api.get('/users/search', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários por filtros:', error);
      throw error;
    }
  }

  // Obter estatísticas dos usuários
  async getUserStats() {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  // Verificar se email já existe
  async checkEmailExists(email) {
    try {
      const response = await api.post('/users/check-email', { email });
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService; // Substitui o conteúdo existente
