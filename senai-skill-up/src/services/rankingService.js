import { mockRanking, simulateApiDelay } from '../data/mockQuizData';

// Buscar ranking global - retorna dados mock
  export const getRankingGlobal = async () => {
    try {
      await simulateApiDelay(800); // Simula delay da API
      return {
        success: true,
        data: mockRanking
      };
    } catch (error) {
      console.error('Erro ao buscar ranking global:', error);
      return {
        success: false,
        message: 'Erro ao buscar ranking'
      };
    }
  };

  // Buscar pontuação do usuário - retorna erro
  export const getPontuacaoUsuario = async (userId) => {
    try {
      return {
        success: false,
        message: 'Sistema de pontuação removido'
      };
    } catch (error) {
      console.error('Erro ao buscar pontuação do usuário:', error);
      return {
        success: false,
        message: 'Erro ao buscar pontuação'
      };
    }
  };

  // Adicionar pontos ao usuário - retorna erro
  export const adicionarPontos = async (userId, pontos) => {
    try {
      return {
        success: false,
        message: 'Sistema de pontuação removido'
      };
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  };

  // Definir pontuação específica - retorna erro
  export const definirPontuacao = async (userId, pontos) => {
    try {
      return {
        success: false,
        message: 'Sistema de pontuação removido'
      };
    } catch (error) {
      console.error('Erro ao definir pontuação:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  };

  // Buscar histórico de partidas do usuário - retorna vazio
  export const getHistoricoUsuario = async (userId) => {
    try {
      return {
        success: true,
        data: []
      };
    } catch (error) {
      console.error('Erro ao buscar histórico do usuário:', error);
      return {
        success: false,
        message: 'Erro ao buscar histórico'
      };
    }
  };

  // Obter estatísticas do usuário - retorna estatísticas vazias
  export const getEstatisticasUsuario = async (userId) => {
    try {
      const estatisticas = {
        totalPartidas: 0,
        totalAcertos: 0,
        totalErros: 0,
        pontuacaoAtual: 0,
        melhorPontuacao: 0,
        piorPontuacao: 0,
        posicaoRanking: null,
        taxaAcerto: 0
      };
      
      return {
        success: true,
        data: estatisticas
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  };

  // Buscar top usuários - retorna dados mock
  export const getTopRanking = async (limit = 10) => {
    try {
      await simulateApiDelay(600);
      const topRanking = mockRanking.slice(0, limit);
      return {
        success: true,
        data: topRanking
      };
    } catch (error) {
      console.error('Erro ao buscar top ranking:', error);
      return {
        success: false,
        message: 'Erro ao buscar top ranking'
      };
    }
  };