# 🔐 Integração Backend com Sistema de Tokens

## 📋 Visão Geral

Este documento descreve como o frontend React está integrado com o backend Java, incluindo sistema de autenticação, tokens JWT, controle de permissões e gerenciamento de estado.

## 🚀 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Backend
REACT_APP_API_BASE_URL=https://apiosdrake.azurewebsites.net
REACT_APP_API_TIMEOUT=10000

# Configurações de Desenvolvimento
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=info

# Configurações de Cache
REACT_APP_CACHE_ENABLED=true
REACT_APP_CACHE_DEFAULT_TTL=300000

# Configurações de Retry
REACT_APP_RETRY_ATTEMPTS=3
REACT_APP_RETRY_DELAY=1000
```

### 2. Estrutura de Dados do Backend

#### Resposta de Login
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "tipoUsuario": "ADMINISTRADOR",
      "permissoes": "ADM",
      "role": "ADMIN",
      "pontos": 1500,
      "nivel": "Diamante",
      "ultimoAcesso": "2024-12-19T10:30:00Z"
    },
    "expiresIn": 3600
  }
}
```

#### Resposta de Ranking
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Ana Silva",
      "pontos": 2450,
      "posicao": 1,
      "avatar": "https://ui-avatars.com/api/?name=Ana+Silva&background=random",
      "nivel": "Diamante",
      "totalPartidas": 12,
      "taxaAcerto": 85.5
    }
  ]
}
```

#### Resposta de Temas
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Matemática Básica",
      "descricao": "Operações fundamentais",
      "dificuldade": "Fácil",
      "totalPerguntas": 15,
      "tempoLimite": 15,
      "ativo": true,
      "cor": "#FF6B6B",
      "icone": "📊"
    }
  ]
}
```

## 🔐 Sistema de Autenticação

### 1. Fluxo de Login

```javascript
// 1. Usuário faz login
const response = await authService.login(email, senha);

// 2. Token é salvo no sessionStorage
if (response.success) {
  sessionStorage.setItem('authToken', response.data.token);
  sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
}

// 3. Dados do usuário são atualizados no estado
setUserData(response.data.user);
setIsLoggedIn(true);
```

### 2. Interceptor de Autenticação

```javascript
// api.js - Request Interceptor
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Tratamento de Token Expirado

```javascript
// api.js - Response Interceptor
if (error.response?.status === 401 && !originalRequest._retry) {
  // Limpar dados de autenticação
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('currentUser');
  
  // Redirecionar para login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}
```

## 🛡️ Sistema de Permissões

### 1. Hook usePermissions

```javascript
import { usePermissions } from '../hooks/usePermissions';

const { 
  isAdmin, 
  canCreateQuiz, 
  canManageUsers, 
  userData, 
  isLoggedIn 
} = usePermissions();
```

### 2. Controle de Acesso por Tipo de Usuário

| Tipo de Usuário | AdminUsers | CreateQuiz | Observações |
|-----------------|------------|------------|-------------|
| **ADMINISTRADOR** | ✅ Acesso Total | ✅ Acesso Total | Pode gerenciar usuários e criar quizzes |
| **CRIADOR** | ❌ Acesso Negado | ✅ Acesso Total | Pode criar quizzes, não pode gerenciar usuários |
| **USUARIO** | ❌ Acesso Negado | ❌ Acesso Negado | Apenas pode jogar quizzes |

### 3. Proteção de Rotas

```javascript
// Página protegida para administradores
<ProtectedRoute requiredRole="ADMIN">
  <AdminUsers />
</ProtectedRoute>

// Página protegida para criadores
<ProtectedRoute requiredRole="CREATOR">
  <CreateQuiz />
</ProtectedRoute>

// Página com permissão específica
<ProtectedRoute requiredPermission="MANAGE_USERS">
  <UserManagement />
</ProtectedRoute>
```

## 📡 Endpoints da API

### Autenticação
- `POST /usuarios/login` - Login
- `POST /usuarios/cadastro` - Cadastro
- `GET /usuarios/me` - Perfil do usuário
- `PUT /usuarios/{id}` - Atualizar perfil
- `POST /auth/reset-password` - Reset de senha

### Temas e Perguntas
- `GET /temas` - Listar temas
- `GET /temas/{id}` - Buscar tema por ID
- `POST /temas` - Criar tema
- `PUT /temas/{id}` - Atualizar tema
- `DELETE /temas/{id}` - Deletar tema
- `GET /perguntas/tema/{temaId}` - Perguntas por tema
- `GET /perguntas/tema/{temaId}/random?quantidade=10` - Perguntas aleatórias
- `POST /perguntas` - Criar pergunta
- `PUT /perguntas/{id}` - Atualizar pergunta
- `DELETE /perguntas/{id}` - Deletar pergunta
- `POST /perguntas/{id}/validar` - Validar resposta

### Ranking e Estatísticas
- `GET /ranking/global` - Ranking global
- `GET /ranking/top?limit=10` - Top usuários
- `GET /usuarios/{id}/pontuacao` - Pontuação do usuário
- `POST /usuarios/{id}/pontuacao` - Adicionar pontos
- `PUT /usuarios/{id}/pontuacao` - Definir pontuação
- `GET /usuarios/{id}/historico` - Histórico do usuário
- `GET /usuarios/{id}/estatisticas` - Estatísticas do usuário

### Respostas e Jogos
- `POST /respostas` - Submeter resposta
- `GET /usuarios/{id}/tema/{temaId}/stats` - Estatísticas por tema

### Gerenciamento de Usuários (Admin)
- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/{id}` - Buscar usuário por ID
- `POST /usuarios` - Criar usuário
- `PUT /usuarios/{id}` - Atualizar usuário
- `DELETE /usuarios/{id}` - Deletar usuário

## 🔧 Configuração dos Serviços

### 1. API Service (api.js)

```javascript
// Configuração base
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL,
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Instância do axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

### 2. Auth Service (authService.js)

```javascript
class AuthService {
  async login(email, senha) {
    const response = await api.post('/usuarios/login', { email, senha });
    return {
      success: true,
      data: response.data
    };
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('authToken');
  }

  getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
  }
}
```

### 3. Ranking Service (rankingService.js)

```javascript
export const getRankingGlobal = async () => {
  try {
    const response = await api.get('/ranking/global');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Erro ao buscar ranking'
    };
  }
};
```

## 🗑️ Dados Removidos

### Arquivos Deletados
- ❌ `src/data/mockUsers.js` - Dados mockados de usuários
- ❌ `src/data/mockQuizData.js` - Dados mockados de quiz

### Funcionalidades Atualizadas
- ✅ `rankingService.js` - Agora usa APIs reais
- ✅ `QuizSection` - Carrega temas do backend
- ✅ `RankingSection` - Carrega ranking do backend
- ✅ Removidos listeners de `localStorage`
- ✅ Removidos dados mockados

## 🚨 Tratamento de Erros

### 1. Erros de Autenticação
- **401 Unauthorized**: Token expirado ou inválido
- **403 Forbidden**: Usuário sem permissão
- **404 Not Found**: Recurso não encontrado

### 2. Erros de Rede
- **Timeout**: Requisição demorou muito
- **Network Error**: Sem conexão com internet
- **Server Error**: Erro interno do servidor (500+)

### 3. Tratamento Global
```javascript
// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Limpar token e redirecionar
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📱 Estados de Loading

### 1. Verificação de Permissões
```javascript
if (authLoading) {
  return <div>Verificando permissões...</div>;
}
```

### 2. Carregamento de Dados
```javascript
if (loading) {
  return <Loader />;
}
```

### 3. Estados de Erro
```javascript
if (error) {
  return <div>Erro ao carregar dados: {error.message}</div>;
}
```

## 🔍 Debug e Logs

### 1. Ativar Logs de Debug
```env
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

### 2. Logs Automáticos
- ✅ Todas as requisições são logadas em desenvolvimento
- ✅ Erros são logados com detalhes
- ✅ Tokens são validados automaticamente

## 📋 Checklist de Integração

### Backend
- [ ] Endpoints implementados conforme especificação
- [ ] JWT tokens configurados
- [ ] CORS configurado para o frontend
- [ ] Validação de permissões implementada
- [ ] Estrutura de resposta padronizada

### Frontend
- [x] Variáveis de ambiente configuradas
- [x] Serviços de API implementados
- [x] Sistema de autenticação funcionando
- [x] Controle de permissões implementado
- [x] Tratamento de erros configurado
- [x] Dados mockados removidos

## 🚀 Próximos Passos

1. **Testar integração** com backend real
2. **Ajustar estrutura de dados** se necessário
3. **Implementar testes** de integração
4. **Configurar monitoramento** de erros
5. **Otimizar performance** das requisições

## 📞 Suporte

Para dúvidas sobre a integração:
- Verifique os logs do console (F12)
- Confirme se as variáveis de ambiente estão corretas
- Teste os endpoints diretamente no backend
- Verifique se o token está sendo enviado nas requisições

---

**Status**: ✅ **100% Preparado para Backend**  
**Última Atualização**: Dezembro 2024  
**Versão**: 1.0.0
