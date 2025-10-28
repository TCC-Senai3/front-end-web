import api from './api';

// Buscar ranking global
export const getRankingGlobal = async () => {
  try {
    const response = await api.get('/ranking/geral');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao buscar ranking global:', error);
    return {
      success: false,
      message: error.message || 'Erro ao buscar ranking'
    };
  }
};

// Buscar pontuação do usuário
export const getPontuacaoUsuario = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}/pontuacao`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao buscar pontuação do usuário:', error);
    return {
      success: false,
      message: error.message || 'Erro ao buscar pontuação'
    };
  }
};

// Adicionar pontos ao usuário
export const adicionarPontos = async (userId, pontos) => {
  try {
    const response = await api.post(`/usuarios/${userId}/pontuacao`, { pontos });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao adicionar pontos:', error);
    return {
      success: false,
      message: error.message || 'Erro interno do servidor'
    };
  }
};

// Definir pontuação específica
export const definirPontuacao = async (userId, pontos) => {
  try {
    const response = await api.put(`/usuarios/${userId}/pontuacao`, { pontos });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao definir pontuação:', error);
    return {
      success: false,
      message: error.message || 'Erro interno do servidor'
    };
  }
};

// Buscar histórico de partidas do usuário
export const getHistoricoUsuario = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}/historico`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao buscar histórico do usuário:', error);
    return {
      success: false,
      message: error.message || 'Erro ao buscar histórico'
    };
  }
};

// Obter estatísticas do usuário
export const getEstatisticasUsuario = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}/estatisticas`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error);
    return {
      success: false,
      message: error.message || 'Erro interno do servidor'
    };
  }
};

// Buscar top usuários
export const getTopRanking = async (limit = 10) => {
  try {
    const response = await api.get('/ranking/geral', { params: { limit } });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao buscar top ranking:', error);
    return {
      success: false,
      message: error.message || 'Erro ao buscar top ranking'
    };
  }
};