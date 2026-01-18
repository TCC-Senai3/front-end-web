// Serviço de quiz preparado para backend Java
import api from './api';

class QuizService {
  // Buscar todos os temas
  async getTemas() {
    try {
      const response = await api.get('/temas', {
        useCache: true,
        cacheTTL: 600000 // 10 minutos
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
      throw error;
    }
  }

  // Buscar tema por ID
  async getTemaById(temaId) {
    try {
      const response = await api.get(`/temas/${temaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tema:', error);
      throw error;
    }
  }

  // Criar novo tema
  async createTema(temaData) {
    try {
      const response = await api.post('/temas', temaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tema:', error);
      throw error;
    }
  }

  // Atualizar tema
  async updateTema(temaId, temaData) {
    try {
      const response = await api.put(`/temas/${temaId}`, temaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      throw error;
    }
  }

  // Deletar tema
  async deleteTema(temaId) {
    try {
      await api.delete(`/temas/${temaId}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar tema:', error);
      throw error;
    }
  }

  // Buscar todas as perguntas
  async getPerguntas(params = {}) {
    try {
      const response = await api.get('/perguntas', {
        params,
        useCache: true,
        cacheTTL: 300000 // 5 minutos
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
      throw error;
    }
  }

  // Buscar perguntas por tema
  async getPerguntasByTema(temaId, params = {}) {
    try {
      const response = await api.get(`/perguntas/tema/${temaId}`, {
        params,
        useCache: true,
        cacheTTL: 300000 // 5 minutos
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
      throw error;
    }
  }

  // Buscar pergunta por ID
  async getPerguntaById(perguntaId) {
    try {
      const response = await api.get(`/perguntas/${perguntaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pergunta:', error);
      throw error;
    }
  }

  // Criar nova pergunta
  async createPergunta(perguntaData) {
    try {
      const response = await api.post('/perguntas', perguntaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pergunta:', error);
      throw error;
    }
  }

  // Atualizar pergunta
  async updatePergunta(perguntaId, perguntaData) {
    try {
      const response = await api.put(`/perguntas/${perguntaId}`, perguntaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pergunta:', error);
      throw error;
    }
  }

  // Deletar pergunta
  async deletePergunta(perguntaId) {
    try {
      await api.delete(`/perguntas/${perguntaId}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar pergunta:', error);
      throw error;
    }
  }

  // Buscar alternativas de uma pergunta
  async getAlternativas(perguntaId) {
    try {
      const response = await api.get(`/perguntas/${perguntaId}/alternativas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alternativas:', error);
      throw error;
    }
  }

  // Submeter resposta do usuário
  async submitResposta(respostaData) {
    try {
      const response = await api.post('/respostas', respostaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao submeter resposta:', error);
      throw error;
    }
  }

  // Buscar histórico de respostas do usuário
  async getHistoricoUsuario(userId, params = {}) {
    try {
      const response = await api.get(`/usuarios/${userId}/historico`, {
        params,
        useCache: true,
        cacheTTL: 60000 // 1 minuto
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  }

  // Obter estatísticas do usuário por tema
  async getEstatisticasUsuarioTema(userId, temaId) {
    try {
      const response = await api.get(`/usuarios/${userId}/tema/${temaId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  // Buscar perguntas aleatórias por tema
  async getPerguntasAleatorias(temaId, quantidade = 10) {
    try {
      const response = await api.get(`/perguntas/tema/${temaId}/random`, {
        params: { quantidade }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perguntas aleatórias:', error);
      throw error;
    }
  }

  // Validar resposta
  async validarResposta(perguntaId, alternativaId) {
    try {
      const response = await api.post(`/perguntas/${perguntaId}/validar`, {
        alternativaId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao validar resposta:', error);
      throw error;
    }
  }
}

const quizService = new QuizService();

// Named exports para compatibilidade
export const getTemas = () => quizService.getTemas();
export const getPerguntas = (params) => quizService.getPerguntas(params);
export const getPerguntasByTema = (temaId, params) => quizService.getPerguntasByTema(temaId, params);
export const createTema = (temaData) => quizService.createTema(temaData);
export const updateTema = (temaId, temaData) => quizService.updateTema(temaId, temaData);
export const deleteTema = (temaId) => quizService.deleteTema(temaId);
export const createPergunta = (perguntaData) => quizService.createPergunta(perguntaData);
export const updatePergunta = (perguntaId, perguntaData) => quizService.updatePergunta(perguntaId, perguntaData);
export const deletePergunta = (perguntaId) => quizService.deletePergunta(perguntaId);
export const submitResposta = (respostaData) => quizService.submitResposta(respostaData);
export const validarResposta = (perguntaId, alternativaId) => quizService.validarResposta(perguntaId, alternativaId);

export default quizService;