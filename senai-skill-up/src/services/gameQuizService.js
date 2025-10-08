import api from './api';

class GameQuizService {
  // Buscar pergunta atual do quiz em andamento
  async getPerguntaAtual(quizId) {
    try {
      const response = await api.get(`/quiz/${quizId}/pergunta-atual`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pergunta atual:', error);
      throw error;
    }
  }

  // Iniciar novo quiz
  async iniciarQuiz(temaId) {
    try {
      const response = await api.post('/quiz/iniciar', { temaId });
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar quiz:', error);
      throw error;
    }
  }

  // Submeter resposta e obter próxima pergunta
  async submeterResposta(quizId, perguntaId, alternativaId) {
    try {
      const response = await api.post(`/quiz/${quizId}/responder`, {
        perguntaId,
        alternativaId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao submeter resposta:', error);
      throw error;
    }
  }

  // Finalizar quiz e obter resultados
  async finalizarQuiz(quizId) {
    try {
      const response = await api.post(`/quiz/${quizId}/finalizar`);
      return response.data;
    } catch (error) {
      console.error('Erro ao finalizar quiz:', error);
      throw error;
    }
  }

  // Obter tempo restante do quiz
  async getTempoRestante(quizId) {
    try {
      const response = await api.get(`/quiz/${quizId}/tempo`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tempo restante:', error);
      throw error;
    }
  }

  // Abandonar quiz
  async abandonarQuiz(quizId) {
    try {
      const response = await api.post(`/quiz/${quizId}/abandonar`);
      return response.data;
    } catch (error) {
      console.error('Erro ao abandonar quiz:', error);
      throw error;
    }
  }
}

const gameQuizService = new GameQuizService();

export default gameQuizService;
