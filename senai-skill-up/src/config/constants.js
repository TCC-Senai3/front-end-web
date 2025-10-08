// Constantes e configurações para diferentes ambientes
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

// Configurações por ambiente
const CONFIG = {
  [ENVIRONMENTS.DEVELOPMENT]: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
    ENABLE_DEBUG: process.env.REACT_APP_DEBUG === 'true' || true,
    ENABLE_CACHE: process.env.REACT_APP_CACHE === 'false' ? false : true,
    CACHE_TTL: parseInt(process.env.REACT_APP_CACHE_TTL) || 300000, // 5 minutos
    MAX_RETRY_ATTEMPTS: parseInt(process.env.REACT_APP_MAX_RETRIES) || 3,
    RETRY_DELAY: parseInt(process.env.REACT_APP_RETRY_DELAY) || 1000,
    PAGINATION_LIMIT: parseInt(process.env.REACT_APP_PAGINATION_LIMIT) || 20,
    UPLOAD_MAX_SIZE: parseInt(process.env.REACT_APP_UPLOAD_MAX_SIZE) || 5242880, // 5MB
    ENABLE_SERVICE_WORKER: false,
    ANALYTICS_ID: process.env.REACT_APP_ANALYTICS_ID || null,
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || null
  },

  [ENVIRONMENTS.PRODUCTION]: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.senai-skill-up.com/api',
    API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 15000,
    ENABLE_DEBUG: process.env.REACT_APP_DEBUG === 'true' || false,
    ENABLE_CACHE: process.env.REACT_APP_CACHE !== 'false' ? true : false,
    CACHE_TTL: parseInt(process.env.REACT_APP_CACHE_TTL) || 600000, // 10 minutos
    MAX_RETRY_ATTEMPTS: parseInt(process.env.REACT_APP_MAX_RETRIES) || 2,
    RETRY_DELAY: parseInt(process.env.REACT_APP_RETRY_DELAY) || 2000,
    PAGINATION_LIMIT: parseInt(process.env.REACT_APP_PAGINATION_LIMIT) || 50,
    UPLOAD_MAX_SIZE: parseInt(process.env.REACT_APP_UPLOAD_MAX_SIZE) || 10485760, // 10MB
    ENABLE_SERVICE_WORKER: true,
    ANALYTICS_ID: process.env.REACT_APP_ANALYTICS_ID || 'GA-XXXXXXXXX',
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || 'https://your-sentry-dsn@sentry.io/project-id'
  },

  [ENVIRONMENTS.TEST]: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 5000,
    ENABLE_DEBUG: true,
    ENABLE_CACHE: false,
    CACHE_TTL: 0,
    MAX_RETRY_ATTEMPTS: 1,
    RETRY_DELAY: 100,
    PAGINATION_LIMIT: 10,
    UPLOAD_MAX_SIZE: 1048576, // 1MB
    ENABLE_SERVICE_WORKER: false,
    ANALYTICS_ID: null,
    SENTRY_DSN: null
  }
};

// Obter configuração atual baseada no ambiente
const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT;
  return CONFIG[env] || CONFIG[ENVIRONMENTS.DEVELOPMENT];
};

// Configuração atual
export const config = getCurrentConfig();

// Constantes gerais da aplicação
export const CONSTANTS = {
  // Estados de loading
  LOADING_STATES: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
  },

  // Tipos de usuário
  USER_ROLES: {
    ADMIN: 'ADMINISTRADOR',
    CREATOR: 'CRIADOR',
    USER: 'USUARIO'
  },

  // Status de usuário
  USER_STATUS: {
    ONLINE: 'online',
    OFFLINE: 'offline',
    AWAY: 'away'
  },

  // Níveis de usuário
  USER_LEVELS: {
    BRONZE: 'Bronze',
    PRATA: 'Prata',
    OURO: 'Ouro',
    PLATINA: 'Platina',
    DIAMANTE: 'Diamante'
  },

  // Códigos de erro HTTP
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
  },

  // Mensagens de erro comuns
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
    UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
    FORBIDDEN: 'Acesso negado. Você não tem permissão.',
    NOT_FOUND: 'Recurso não encontrado.',
    VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
    TIMEOUT: 'Tempo limite excedido. Tente novamente.',
    UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.'
  },

  // Validações
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100
  },

  // Formatação
  FORMAT: {
    DATE: 'DD/MM/YYYY',
    DATETIME: 'DD/MM/YYYY HH:mm:ss',
    TIME: 'HH:mm:ss',
    CURRENCY: 'R$ 0,00'
  },

  // Animações
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    EXTRA_SLOW: 1000
  },

  // Breakpoints para responsividade
  BREAKPOINTS: {
    XS: 0,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1400
  },

  // Cores do tema (consistentes com o design atual)
  COLORS: {
    PRIMARY: '#3498db',
    SECONDARY: '#2ecc71',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#fd7e14',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
    WHITE: '#ffffff',
    GRAY: '#6c757d',
    GRAY_LIGHT: '#e9ecef',
    GRAY_DARK: '#495057'
  },

  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 1000
  },

  // Configurações de upload
  UPLOAD: {
    MAX_FILE_SIZE: config.UPLOAD_MAX_SIZE,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
    MAX_FILES_PER_UPLOAD: 10
  },

  // Configurações de cache
  CACHE: {
    ENABLED: config.ENABLE_CACHE,
    DEFAULT_TTL: config.CACHE_TTL,
    MAX_ITEMS: 100,
    CLEANUP_INTERVAL: 60000 // 1 minuto
  },

  // Configurações de retry
  RETRY: {
    MAX_ATTEMPTS: config.MAX_RETRY_ATTEMPTS,
    BASE_DELAY: config.RETRY_DELAY,
    MAX_DELAY: 10000,
    BACKOFF_MULTIPLIER: 2
  },

  // Configurações de debug
  DEBUG: {
    ENABLED: config.ENABLE_DEBUG,
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
    ENABLE_API_LOGGING: config.ENABLE_DEBUG,
    ENABLE_CACHE_LOGGING: config.ENABLE_DEBUG,
    ENABLE_PERFORMANCE_LOGGING: config.ENABLE_DEBUG
  },

  // Configurações de performance
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100,
    VIRTUAL_SCROLL_THRESHOLD: 100,
    LAZY_LOAD_THRESHOLD: 200
  },

  // Configurações de acessibilidade
  ACCESSIBILITY: {
    HIGH_CONTRAST: false,
    REDUCE_MOTION: false,
    FONT_SIZE_MULTIPLIER: 1,
    FOCUS_VISIBLE: true
  },

  // Configurações de internacionalização
  I18N: {
    DEFAULT_LANGUAGE: 'pt-BR',
    SUPPORTED_LANGUAGES: ['pt-BR', 'en-US', 'es-ES'],
    FALLBACK_LANGUAGE: 'pt-BR'
  }
};

// Funções utilitárias de configuração
export const configUtils = {
  // Verificar se está em ambiente de desenvolvimento
  isDevelopment: () => process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT,

  // Verificar se está em ambiente de produção
  isProduction: () => process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION,

  // Verificar se está em ambiente de teste
  isTest: () => process.env.NODE_ENV === ENVIRONMENTS.TEST,

  // Obter configuração específica
  getConfig: (key, defaultValue = null) => {
    return config[key] !== undefined ? config[key] : defaultValue;
  },

  // Verificar se funcionalidade está habilitada
  isFeatureEnabled: (feature) => {
    return config[feature] === true;
  },

  // Obter ambiente atual
  getCurrentEnvironment: () => process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT,

  // Verificar se é ambiente específico
  isEnvironment: (env) => process.env.NODE_ENV === env,

  // Log condicional baseado no ambiente
  log: (message, level = 'info') => {
    if (config.ENABLE_DEBUG && CONSTANTS.DEBUG.ENABLED) {
      const levels = ['debug', 'info', 'warn', 'error'];
      const shouldLog = levels.indexOf(level) >= levels.indexOf(CONSTANTS.DEBUG.LOG_LEVEL);

      if (shouldLog) {
        console.log(`[${level.toUpperCase()}] ${message}`);
      }
    }
  }
};

// Exportar constantes e configurações
export { ENVIRONMENTS };
export default CONSTANTS;
