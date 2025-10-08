# 🚀 Integração com Backend Java - Guia de Implementação

## 📋 Visão Geral

Este projeto atualmente utiliza dados mockados e funcionalidades simuladas. Este guia apresenta as fases necessárias para integrar com um backend Java real, substituindo gradualmente as implementações locais por chamadas de API.

## 🎯 Situação Atual

- ✅ **Frontend React** totalmente funcional
- ✅ **Dados mockados** removidos (pontos, usuários, questionários)
- ✅ **Autenticação** simulada apenas
- ✅ **Componentes** prontos para receber dados reais
- ❌ **Sem integração** com backend externo

## 📊 Fases de Implementação

### **FASE 1: Preparação da Infraestrutura** 🎯

#### 1.1 Configuração do Backend Java
```java
// Exemplo de estrutura sugerida para o backend
@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        // Implementação
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Implementação
    }
}
```

#### 1.2 Configuração de CORS
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        // Configurar CORS para aceitar requisições do frontend
    }
}
```

#### 1.3 Variáveis de Ambiente
```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=5000
```

### **FASE 2: Substituição da Autenticação** 🔐

#### 2.1 Modificar `authService.js`
```javascript
// ANTES (simulado)
async login(email, senha) {
  // Simulação local
}

// DEPOIS (API real)
async login(email, senha) {
  try {
    const response = await api.post('/auth/login', { email, senha });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro no servidor'
    };
  }
}
```

#### 2.2 Atualizar `localStorageService.js`
```javascript
// Remover métodos mockados
// Manter apenas sessionStorage para tokens
```

### **FASE 3: Integração de Usuários** 👥

#### 3.1 Modificar `userService.js`
```javascript
// services/userService.js
import api from './api';

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    return true;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};
```

#### 3.2 Atualizar `AdminUsers/index.js`
```javascript
// Remover mockUsers
// Usar apenas chamadas reais da API
// Remover fallbacks para dados mockados
```

### **FASE 4: Sistema de Jogos e Questionários** 🎮

#### 4.1 Modificar `quizService.js`
```javascript
// services/quizService.js
export const getTemas = async () => {
  try {
    const response = await api.get('/temas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPerguntasByTema = async (temaId) => {
  try {
    const response = await api.get(`/perguntas/tema/${temaId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitResposta = async (respostaData) => {
  try {
    const response = await api.post('/respostas', respostaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

#### 4.2 Atualizar `rankingService.js`
```javascript
// services/rankingService.js
export const getRankingGlobal = async () => {
  try {
    const response = await api.get('/ranking/global');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adicionarPontos = async (userId, pontos) => {
  try {
    const response = await api.post(`/usuarios/${userId}/pontos`, { pontos });
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

### **FASE 5: Melhorias e Otimizações** ⚡

#### 5.1 Implementar Cache Inteligente
```javascript
// utils/cacheManager.js
class CacheManager {
  set(key, data, ttl = 300000) { // 5 minutos
    // Implementar cache com TTL
  }

  get(key) {
    // Buscar do cache primeiro
  }

  invalidate(key) {
    // Invalidar cache específico
  }
}
```

#### 5.2 Tratamento de Erros Global
```javascript
// services/api.js - Adicionar interceptors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 5.3 Loading States e Offline Mode
```javascript
// hooks/useApiCall.js
const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
```

## 🔧 Estrutura da API Java Sugerida

### **Endpoints Necessários:**

#### **Autenticação**
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

#### **Usuários**
```
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
```

#### **Temas**
```
GET    /api/temas
POST   /api/temas
GET    /api/temas/{id}
PUT    /api/temas/{id}
DELETE /api/temas/{id}
```

#### **Perguntas**
```
GET    /api/perguntas
GET    /api/perguntas/tema/{temaId}
POST   /api/perguntas
GET    /api/perguntas/{id}
PUT    /api/perguntas/{id}
DELETE /api/perguntas/{id}
```

#### **Respostas e Pontuação**
```
POST   /api/respostas
GET    /api/usuarios/{id}/historico
POST   /api/usuarios/{id}/pontos
GET    /api/ranking/global
GET    /api/ranking/top/{limit}
```

## 📋 Checklist de Implementação

### **Pré-requisitos:**
- [ ] Backend Java rodando em `http://localhost:8080`
- [ ] CORS configurado
- [ ] Variáveis de ambiente configuradas

### **Por Fase:**
- [ ] **Fase 1:** Backend básico implementado
- [ ] **Fase 2:** Autenticação funcionando
- [ ] **Fase 3:** CRUD de usuários completo
- [ ] **Fase 4:** Sistema de jogos integrado
- [ ] **Fase 5:** Melhorias implementadas

## 🚨 Considerações Importantes

### **Tratamento de Estados:**
- Loading states durante requisições
- Estados de erro com retry
- Offline mode para melhor UX

### **Segurança:**
- Sanitização de dados
- Validação de tokens JWT
- Proteção contra ataques comuns

### **Performance:**
- Implementar paginação para listas grandes
- Cache inteligente para dados estáticos
- Compressão de respostas

## 🛠️ Scripts Úteis para Desenvolvimento

```bash
# Iniciar backend Java
./mvnw spring-boot:run

# Iniciar frontend com proxy para API
npm start

# Build para produção
npm run build
```

## 📞 Suporte

Para dúvidas sobre implementação específica de algum endpoint ou integração, consulte:
- Documentação da API Java
- Exemplos nos comentários do código
- Issues no repositório

---

**Status:** 🔄 Aguardando implementação do backend Java
**Próxima fase:** Implementar autenticação real após backend estar disponível
