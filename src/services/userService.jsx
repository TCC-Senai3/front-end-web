// Serviço de usuários preparado para backend Java
import api from "./api";

class UserService {
  async getAllUsers() {
    try {
      const response = await api.get("/usuarios", {
        timeout: 20000, // 20 segundos de timeout
        _retryCount: 0 // Inicializa o contador de tentativas
      });
      
      if (!response.data) {
        throw new Error('Nenhum dado retornado da API');
      }
      
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('A requisição demorou muito para responder. Tente novamente mais tarde.');
      }
      
      if (error.response) {
        // Erro retornado pelo servidor (4xx, 5xx)
        const { status, data } = error.response;
        const errorMessage = data?.message || 'Erro ao processar a requisição';
        console.error(`Erro ${status} ao buscar usuários:`, errorMessage);
        throw new Error(`Erro ${status}: ${errorMessage}`);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Sem resposta do servidor:', error.request);
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
      } else {
        // Erro ao configurar a requisição
        console.error('Erro ao configurar a requisição:', error.message);
        throw new Error('Erro ao processar a requisição. Tente novamente.');
      }
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

  // =========================================================
  // ✅ MÉTODOS ADICIONADOS PARA O PERFILMODAL
  // =========================================================

  /**
   * Busca o perfil do usuário atualmente logado.
   * (Chama o endpoint GET /usuarios/me)
   */
  async getMeuPerfil() {
    try {
      const response = await api.get("/usuarios/me");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário logado (/me):", error);
      throw error;
    }
  }

  /**
   * Atualiza a biografia de um usuário.
   * (Chama o endpoint PUT /usuarios/{id}/biografia)
   * @param {number} userId - O ID do usuário a ser atualizado.
   * @param {object} biografiaData - O payload (Ex: { biografia: "Novo texto" }).
   */
  async updateBiografia(userId, biografiaData) {
    if (!userId) throw new Error("ID do usuário é obrigatório para atualizar biografia.");
    try {
      const response = await api.put(`/usuarios/${userId}/biografia`, biografiaData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar biografia do usuário ID ${userId}:`, error);
      throw error;
    }
  }

// ✅ 1. ADICIONE ESTA NOVA FUNÇÃO
  /**
   * Atualiza APENAS as roles de um usuário.
   * (Chama o endpoint PUT /usuarios/{id}/roles)
   * @param {number} userId - O ID do usuário.
   * @param {Array<number>} roleIds - Um array de IDs das novas roles (ex: [1, 3]).
   */
  async updateUserRoles(userId, roleIds) {
    if (!userId) throw new Error("ID do usuário é obrigatório.");
    if (!Array.isArray(roleIds)) throw new Error("roleIds deve ser um array.");
    
    try {
      const payload = { roleIds: roleIds };
      const response = await api.put(`admin/usuarios/${userId}/roles`, payload);
      return response.data; // Retorna o usuário atualizado
    } catch (error) {
      console.error(`Erro ao atualizar roles do usuário ID ${userId}:`, error);
      throw error;
    }
  }

}

const userService = new UserService();
export default userService;