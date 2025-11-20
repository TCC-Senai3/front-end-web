// Sistema de tratamento global de erros
import { toast } from 'react-toastify';
import CONSTANTS from '../config/constants';

// Classe para gerenciar erros da aplicação
class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 50;
    this.retryTimeouts = new Map();
  }

  // Registrar erro
  log(error, context = {}) {
    const errorInfo = {
      message: error.message || error.toString(),
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: sessionStorage.getItem('currentUser') ?
        JSON.parse(sessionStorage.getItem('currentUser')).id : null
    };

    // Adicionar à fila de erros
    this.errorQueue.unshift(errorInfo);

    // Manter tamanho máximo da fila
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.pop();
    }

    // Log no console em desenvolvimento - removido para produção

    // Enviar para serviço de monitoramento (Sentry, etc.) em produção
    if (CONSTANTS.config.SENTRY_DSN && window.Sentry) {
      window.Sentry.captureException(error, { contexts: { errorInfo } });
    }

    return errorInfo;
  }

  // Obter erros recentes
  getRecentErrors(limit = 10) {
    return this.errorQueue.slice(0, limit);
  }

  // Limpar fila de erros
  clearErrors() {
    this.errorQueue = [];
  }

  // Tratar erro de API
  handleApiError(error, context = {}) {
    const errorInfo = this.log(error, { type: 'api', ...context });

    // Determinar tipo de erro baseado no status HTTP
    let errorType = 'unknown';
    let userMessage = CONSTANTS.ERROR_MESSAGES.UNKNOWN_ERROR;

    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case CONSTANTS.HTTP_STATUS.UNAUTHORIZED:
          errorType = 'unauthorized';
          userMessage = CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case CONSTANTS.HTTP_STATUS.FORBIDDEN:
          errorType = 'forbidden';
          userMessage = CONSTANTS.ERROR_MESSAGES.FORBIDDEN;
          break;
        case CONSTANTS.HTTP_STATUS.NOT_FOUND:
          errorType = 'not_found';
          userMessage = CONSTANTS.ERROR_MESSAGES.NOT_FOUND;
          break;
        case CONSTANTS.HTTP_STATUS.UNPROCESSABLE_ENTITY:
          errorType = 'validation';
          userMessage = CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR:
        case CONSTANTS.HTTP_STATUS.BAD_GATEWAY:
        case CONSTANTS.HTTP_STATUS.SERVICE_UNAVAILABLE:
          errorType = 'server';
          userMessage = CONSTANTS.ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          errorType = 'api';
          userMessage = error.response.data?.message || CONSTANTS.ERROR_MESSAGES.UNKNOWN_ERROR;
      }
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      errorType = 'network';
      userMessage = CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR;
    } else if (error.message?.includes('timeout')) {
      errorType = 'timeout';
      userMessage = CONSTANTS.ERROR_MESSAGES.TIMEOUT;
    }

    return {
      errorInfo,
      errorType,
      userMessage,
      shouldRetry: this.shouldRetry(errorType),
      retryDelay: this.getRetryDelay(errorType)
    };
  }

  // Verificar se erro deve ser tentado novamente
  shouldRetry(errorType) {
    const retryableErrors = ['network', 'timeout', 'server'];
    return retryableErrors.includes(errorType);
  }

  // Obter delay para retry baseado no tipo de erro
  getRetryDelay(errorType) {
    const delays = {
      network: 1000,
      timeout: 2000,
      server: 5000
    };
    return delays[errorType] || 3000;
  }

  // Mostrar erro para usuário
  showError(message, type = 'error', options = {}) {
    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      case 'error':
      default:
        toast.error(message, toastOptions);
        break;
    }
  }

  // Mostrar erro de validação
  showValidationErrors(validationErrors) {
    Object.entries(validationErrors).forEach(([field, messages]) => {
      const errorMessage = Array.isArray(messages) ? messages[0] : messages;
      this.showError(`${field}: ${errorMessage}`, 'warning');
    });
  }

  // Executar função com tratamento de erro
  async executeWithErrorHandling(fn, context = {}) {
    try {
      return await fn();
    } catch (error) {
      const errorResult = this.handleApiError(error, context);

      // Mostrar mensagem para usuário
      this.showError(errorResult.userMessage, 'error');

      // Se erro de validação, mostrar erros específicos
      if (errorResult.errorType === 'validation' && error.response?.data?.errors) {
        this.showValidationErrors(error.response.data.errors);
      }

      throw errorResult;
    }
  }

  // Função de retry com backoff exponencial
  async retryWithBackoff(fn, maxAttempts = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Se é o último attempt, não esperar
        if (attempt === maxAttempts) {
          break;
        }

        // Se erro não é retryable, não tentar novamente
        const errorResult = this.handleApiError(error);
        if (!errorResult.shouldRetry) {
          break;
        }

        // Calcular delay com jitter para evitar thundering herd
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;

        // Retry attempt - log removido

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // Configurar tratamento global de erros não capturados
  setupGlobalErrorHandler() {
    // Tratamento de erros não capturados
    window.addEventListener('error', (event) => {
      this.log(event.error, {
        type: 'uncaught',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });

      // Em produção, não mostrar erro padrão do navegador
      if (config.isProduction()) {
        event.preventDefault();
      }
    });

    // Tratamento de promessas rejeitadas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      this.log(event.reason, { type: 'unhandled_promise_rejection' });

      // Em produção, não mostrar erro padrão do navegador
      if (config.isProduction()) {
        event.preventDefault();
      }
    });
  }

  // Gerar relatório de erros para suporte
  generateErrorReport() {
    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      userAgent: navigator.userAgent,
      url: window.location.href,
      errors: this.getRecentErrors(),
      config: {
        apiBaseUrl: CONSTANTS.config.API_BASE_URL,
        debugEnabled: CONSTANTS.DEBUG.ENABLED,
        cacheEnabled: CONSTANTS.CACHE.ENABLED
      }
    };
  }

  // Exportar relatório de erros
  exportErrorReport() {
    const report = this.generateErrorReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Hook personalizado para usar error handler em componentes
export const useErrorHandler = () => {
  const executeWithErrorHandling = async (fn, context) => {
    return errorHandler.executeWithErrorHandling(fn, context);
  };

  const showError = (message, type, options) => {
    errorHandler.showError(message, type, options);
  };

  const retryWithBackoff = (fn, maxAttempts, baseDelay) => {
    return errorHandler.retryWithBackoff(fn, maxAttempts, baseDelay);
  };

  return {
    executeWithErrorHandling,
    showError,
    retryWithBackoff,
    logError: errorHandler.log.bind(errorHandler)
  };
};

// Instância singleton
const errorHandler = new ErrorHandler();

// Configurar tratamento global de erros
errorHandler.setupGlobalErrorHandler();

export default errorHandler;
export { ErrorHandler };
