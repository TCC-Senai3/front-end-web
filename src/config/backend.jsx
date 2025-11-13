// Configurações do Backend
export const BACKEND_CONFIG = {
  // URL base da API
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://apiosdrake.azurewebsites.net',
  
  // Timeout das requisições (em ms)
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  
  // Configurações de retry
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Endpoints da API
  ENDPOINTS: {
    // Autenticação
    LOGIN: '/usuarios/login',
    REGISTER: '/usuarios/cadastro',
    PROFILE: '/usuarios/me',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Temas e Perguntas
    TEMAS: '/temas',
    PERGUNTAS: '/perguntas',
    PERGUNTAS_BY_TEMA: '/perguntas/tema',
    PERGUNTAS_RANDOM: '/perguntas/tema',
    ALTERNATIVAS: '/perguntas',
    VALIDAR_RESPOSTA: '/perguntas',
    
    // Ranking e Estatísticas
    RANKING_GLOBAL: '/ranking/global',
    RANKING_TOP: '/ranking/top',
    USUARIO_PONTUACAO: '/usuarios',
    USUARIO_HISTORICO: '/usuarios',
    USUARIO_ESTATISTICAS: '/usuarios',
    
    // Respostas
    SUBMIT_RESPOSTA: '/respostas',
    
    // Salas de Jogo
    SALAS: '/salas',
    CRIAR_SALA: '/salas',
    ENTRAR_SALA: '/salas',
    SAIR_SALA: '/salas'
  },
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Configurações de cache (em ms)
  CACHE_TTL: {
    TEMAS: 600000,        // 10 minutos
    PERGUNTAS: 300000,    // 5 minutos
    RANKING: 60000,       // 1 minuto
    USUARIO: 300000       // 5 minutos
  }
};

// Função para construir URLs completas
export const buildUrl = (endpoint, params = {}) => {
  let url = `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
  
  // Adicionar parâmetros de query se existirem
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, params[key]);
    }
  });
  
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }
  
  return url;
};

// Função para obter token de autenticação
export const getAuthToken = () => {
  return sessionStorage.getItem('authToken');
};

// Função para obter headers de autenticação
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = { ...BACKEND_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

export default BACKEND_CONFIG;
