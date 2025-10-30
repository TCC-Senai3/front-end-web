// Serviço de usuários preparado para backend Java
import api from "./api";

class UserService {
  async getAllUsers() {
    try {
      const response = await api.get("/usuarios");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  async getUserById(userId) {
    if (!userId) throw new Error("ID do usuário é obrigatório.");
    try {
      const response = await api.get(`/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário ID ${userId}:`, error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await api.post("/usuarios", userData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/usuarios/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ID ${userId}:`, error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await api.delete(`/usuarios/${userId}`);
      return true;
    } catch (error) {
      console.error(`Erro ao deletar usuário ID ${userId}:`, error);
      throw error;
    }
  }

  async getUsersByFilters(filters = {}) {
    try {
      const response = await api.get("/usuarios/search", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários por filtros:", error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      const response = await api.get("/usuarios/stats");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  }

  async checkEmailExists(email) {
    try {
      const response = await api.post("/usuarios/check-email", { email });
      return response.data.exists;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
