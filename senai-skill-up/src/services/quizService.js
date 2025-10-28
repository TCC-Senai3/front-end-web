

import api from "./api"; 

class QuizService {
  // Buscar todos os temas
  async getTemas() {
    try {
      const response = await api.get("/temas", {
        useCache: true,
        cacheTTL: 600000, // 10 minutos
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar temas:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar temas",
      };
    }
  } 

  async getFormularios() {
    try {
      const response = await api.get("/formularios");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar formulários:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar formulários",
      };
    }
  } // Buscar tema por ID

  async getTemaById(temaId) {
    try {
      const response = await api.get(`/temas/${temaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar tema:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar tema",
      };
    }
  } // Criar novo tema

  async createTema(temaData) {
    try {
      const response = await api.post("/temas", temaData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao criar tema:", error);
      return { success: false, message: error.message || "Erro ao criar tema" };
    }
  } // Atualizar tema

  async updateTema(temaId, temaData) {
    try {
      const response = await api.put(`/temas/${temaId}`, temaData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao atualizar tema:", error);
      return {
        success: false,
        message: error.message || "Erro ao atualizar tema",
      };
    }
  } // Deletar tema

  async deleteTema(temaId) {
    try {
      await api.delete(`/temas/${temaId}`);
      return { success: true }; // Sucesso sem retorno de dados
    } catch (error) {
      console.error("Erro ao deletar tema:", error);
      return {
        success: false,
        message: error.message || "Erro ao deletar tema",
      };
    }
  } // Buscar todas as perguntas

  async getPerguntas(params = {}) {
    try {
      const response = await api.get("/perguntas", {
        params,
        useCache: true,
        cacheTTL: 300000, // 5 minutos
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar perguntas",
      };
    }
  } // Buscar perguntas por tema

  async getPerguntasByTema(temaId, params = {}) {
    try {
      const response = await api.get(`/perguntas/tema/${temaId}`, {
        params,
        useCache: true,
        cacheTTL: 300000, // 5 minutos
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar perguntas",
      };
    }
  } // Buscar pergunta por ID

  async getPerguntaById(perguntaId) {
    try {
      const response = await api.get(`/perguntas/${perguntaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar pergunta:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar pergunta",
      };
    }
  } // Criar nova pergunta

  async createPergunta(perguntaData) {
    try {
      const response = await api.post("/perguntas", perguntaData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao criar pergunta:", error);
      return {
        success: false,
        message: error.message || "Erro ao criar pergunta",
      };
    }
  } // Atualizar pergunta

  async updatePergunta(perguntaId, perguntaData) {
    try {
      const response = await api.put(`/perguntas/${perguntaId}`, perguntaData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao atualizar pergunta:", error);
      return {
        success: false,
        message: error.message || "Erro ao atualizar pergunta",
      };
    }
  } // Deletar pergunta

  async deletePergunta(perguntaId) {
    try {
      await api.delete(`/perguntas/${perguntaId}`);
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar pergunta:", error);
      return {
        success: false,
        message: error.message || "Erro ao deletar pergunta",
      };
    }
  } // Buscar alternativas de uma pergunta

  async getAlternativas(perguntaId) {
    try {
      const response = await api.get(`/perguntas/${perguntaId}/alternativas`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar alternativas:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar alternativas",
      };
    }
  } // Submeter resposta do usuário

  async submitResposta(respostaData) {
    try {
      const response = await api.post("/respostas", respostaData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao submeter resposta:", error);
      return {
        success: false,
        message: error.message || "Erro ao submeter resposta",
      };
    }
  } // Buscar histórico de respostas do usuário

  async getHistoricoUsuario(userId, params = {}) {
    try {
      const response = await api.get(`/usuarios/${userId}/historico`, {
        params,
        useCache: true,
        cacheTTL: 60000, // 1 minuto
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar histórico",
      };
    }
  } // Obter estatísticas do usuário por tema

  async getEstatisticasUsuarioTema(userId, temaId) {
    try {
      const response = await api.get(
        `/usuarios/${userId}/tema/${temaId}/stats`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar estatísticas",
      };
    }
  } // Buscar perguntas aleatórias por tema

  async getPerguntasAleatorias(temaId, quantidade = 10) {
    try {
      const response = await api.get(`/perguntas/tema/${temaId}/random`, {
        params: { quantidade },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao buscar perguntas aleatórias:", error);
      return {
        success: false,
        message: error.message || "Erro ao buscar perguntas aleatórias",
      };
    }
  } // Validar resposta

  async validarResposta(perguntaId, alternativaId) {
    try {
      const response = await api.post(`/perguntas/${perguntaId}/validar`, {
        alternativaId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao validar resposta:", error);
      return {
        success: false,
        message: error.message || "Erro ao validar resposta",
      };
    }
  }
}

const quizService = new QuizService();

// Named exports para compatibilidade
export const getTemas = () => quizService.getTemas();
export const getFormularios = () => quizService.getFormularios(); // --- NOVO EXPORT ---
export const getPerguntas = (params) => quizService.getPerguntas(params);
export const getPerguntasByTema = (temaId, params) =>
  quizService.getPerguntasByTema(temaId, params);
export const createTema = (temaData) => quizService.createTema(temaData);
export const updateTema = (temaId, temaData) =>
  quizService.updateTema(temaId, temaData);
export const deleteTema = (temaId) => quizService.deleteTema(temaId);
export const createPergunta = (perguntaData) =>
  quizService.createPergunta(perguntaData);
export const updatePergunta = (perguntaId, perguntaData) =>
  quizService.updatePergunta(perguntaId, perguntaData);
export const deletePergunta = (perguntaId) =>
  quizService.deletePergunta(perguntaId);
export const submitResposta = (respostaData) =>
  quizService.submitResposta(respostaData);
export const validarResposta = (perguntaId, alternativaId) =>
  quizService.validarResposta(perguntaId, alternativaId);

export default quizService;
