# SENAI Skill-Up - Services Layer Documentation

## 📋 Visão Geral

Esta pasta contém toda a lógica de comunicação com o backend da aplicação. Cada service é responsável por um domínio específico e encapsula as chamadas à API REST.

## 🏗️ Estrutura de Arquivos

```
src/services/
├── api.js                    # Configuração base do Axios com interceptors
├── authService.js            # Autenticação e autorização
├── userService.js            # Gerenciamento de usuários
├── gameQuizService.js        # Lógica do quiz em tempo real
├── quizService.js            # CRUD de quizzes, temas e perguntas
├── salaService.js            # Gerenciamento de salas multiplayer
├── rankingService.js         # Sistema de ranking e pontuação
└── README.md                 # Esta documentação
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=10000
```

### Ambientes Múltiplos

- `.env.development` - Desenvolvimento local
- `.env.production` - Produção
- `.env.test` - Testes

---

## 📦 Services Disponíveis

### 1. **api.js** - Configuração Base

Instância do Axios com:
- Interceptors de request (adiciona token automaticamente)
- Interceptors de response (tratamento global de erros)
- Sistema de retry automático
- Cache de requisições
- Upload/download de arquivos

**Métodos:**
```javascript
api.get(url, params, options)
api.post(url, data, options)
api.put(url, data, options)
api.patch(url, data, options)
api.delete(url, options)
api.uploadFile(url, file, fieldName, additionalData)
api.downloadFile(url, filename, params)
```

---

### 2. **authService.js** - Autenticação

Gerencia login, registro e sessão do usuário.

**Métodos:**
```javascript
// Login
await authService.login(email, senha)
// Retorna: { success: boolean, data?: {...}, message?: string }

// Registro
await authService.register(userData)
// userData: { nome, email, senha, ... }

// Verificar autenticação
authService.isAuthenticated()
// Retorna: boolean

// Obter usuário atual
authService.getCurrentUser()
// Retorna: { id, nome, email, ... } | null

// Buscar perfil
await authService.getUserProfile(userId)

// Atualizar perfil
await authService.updateProfile(userId, userData)

// Logout
authService.logout()

// Reset de senha
await authService.resetPassword(email)
```

**Endpoints Backend:**
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/reset-password`
- `GET /users/{userId}`
- `PUT /users/{userId}`

---

### 3. **userService.js** - Gerenciamento de Usuários

CRUD completo de usuários e busca avançada.

**Métodos:**
```javascript
// Listar todos
await userService.getAllUsers()

// Buscar por ID
await userService.getUserById(userId)

// Criar usuário
await userService.createUser(userData)

// Atualizar usuário
await userService.updateUser(userId, userData)

// Deletar usuário
await userService.deleteUser(userId)

// Buscar com filtros
await userService.getUsersByFilters({ nome, email, status })

// Estatísticas
await userService.getUserStats()

// Verificar email
await userService.checkEmailExists(email)
```

**Endpoints Backend:**
- `GET /users`
- `GET /users/{id}`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`
- `GET /users/search`
- `GET /users/stats`
- `POST /users/check-email`

---

### 4. **gameQuizService.js** - Quiz em Tempo Real

Gerencia o fluxo de um quiz em andamento.

**Métodos:**
```javascript
// Iniciar novo quiz
await gameQuizService.iniciarQuiz(temaId)
// Retorna: { id, perguntaAtual: {...} }

// Buscar pergunta atual
await gameQuizService.getPerguntaAtual(quizId)

// Submeter resposta
await gameQuizService.submeterResposta(quizId, perguntaId, alternativaId)
// Retorna: { correta: boolean, proximaPergunta?: {...} }

// Finalizar quiz
await gameQuizService.finalizarQuiz(quizId)
// Retorna: { resultados: [...] }

// Obter tempo restante
await gameQuizService.getTempoRestante(quizId)

// Abandonar quiz
await gameQuizService.abandonarQuiz(quizId)
```

**Endpoints Backend:**
- `POST /quiz/iniciar`
- `GET /quiz/{quizId}/pergunta-atual`
- `POST /quiz/{quizId}/responder`
- `POST /quiz/{quizId}/finalizar`
- `GET /quiz/{quizId}/tempo`
- `POST /quiz/{quizId}/abandonar`

**Estrutura de Dados:**
```javascript
// Pergunta
{
  id: number,
  tema: string,
  pergunta: string,
  alternativas: [
    { id: string, texto: string, correta: boolean }
  ]
}

// Resultados
{
  resultados: [
    { posicao: number, nome: string, ganho: number }
  ]
}
```

---

### 5. **quizService.js** - CRUD de Quizzes

Gerenciamento completo de temas, perguntas e alternativas.

**Métodos:**
```javascript
// Temas
await quizService.getTemas()
await quizService.getTemaById(temaId)
await quizService.createTema(temaData)
await quizService.updateTema(temaId, temaData)
await quizService.deleteTema(temaId)

// Perguntas
await quizService.getPerguntas(params)
await quizService.getPerguntasByTema(temaId, params)
await quizService.getPerguntaById(perguntaId)
await quizService.createPergunta(perguntaData)
await quizService.updatePergunta(perguntaId, perguntaData)
await quizService.deletePergunta(perguntaId)

// Alternativas
await quizService.getAlternativas(perguntaId)

// Respostas
await quizService.submitResposta(respostaData)
await quizService.validarResposta(perguntaId, alternativaId)

// Histórico
await quizService.getHistoricoUsuario(userId, params)
await quizService.getEstatisticasUsuarioTema(userId, temaId)

// Perguntas aleatórias
await quizService.getPerguntasAleatorias(temaId, quantidade)
```

**Endpoints Backend:**
- `GET/POST/PUT/DELETE /temas`
- `GET/POST/PUT/DELETE /perguntas`
- `GET /perguntas/tema/{temaId}`
- `GET /perguntas/{id}/alternativas`
- `POST /respostas`
- `POST /perguntas/{id}/validar`

---

### 6. **salaService.js** - Salas Multiplayer

Gerenciamento de salas de jogo multiplayer.

**Métodos:**
```javascript
// Listar salas
await salaService.getSalas()

// Buscar sala por ID
await salaService.getSalaById(id)

// Criar sala
await salaService.createSala(salaData)
// salaData: { nome, temaId, maxJogadores, ... }

// Entrar na sala
await salaService.entrarNaSala(idSala, idUsuario)
```

**Endpoints Backend:**
- `GET /salas`
- `GET /salas/{id}`
- `POST /salas`
- `POST /salas/{id}/entrar/{userId}`

---

### 7. **rankingService.js** - Sistema de Ranking

Gerenciamento de pontuação e ranking (retorna dados vazios - aguardando implementação backend).

**Métodos:**
```javascript
await rankingService.getRankingGlobal()
await rankingService.getPontuacaoUsuario(userId)
await rankingService.getHistoricoUsuario(userId)
await rankingService.getEstatisticasUsuario(userId)
await rankingService.getTopRanking(limit)
```

**Status:** Aguardando implementação do backend

---

## 🎯 Como Usar nos Componentes

### Exemplo: Login

```javascript
import authService from '../services/authService';

function LoginPage() {
  const handleLogin = async (email, senha) => {
    try {
      const result = await authService.login(email, senha);
      
      if (result.success) {
        sessionStorage.setItem('authToken', result.data.token);
        navigate('/home');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro ao fazer login');
    }
  };
}
```

### Exemplo: Quiz

```javascript
import gameQuizService from '../services/gameQuizService';

function GameQuiz() {
  useEffect(() => {
    const iniciar = async () => {
      const quiz = await gameQuizService.iniciarQuiz(temaId);
      setQuizId(quiz.id);
      setPergunta(quiz.perguntaAtual);
    };
    iniciar();
  }, []);

  const responder = async (alternativaId) => {
    const resultado = await gameQuizService.submeterResposta(
      quizId, 
      pergunta.id, 
      alternativaId
    );
    
    if (resultado.proximaPergunta) {
      setPergunta(resultado.proximaPergunta);
    } else {
      const resultados = await gameQuizService.finalizarQuiz(quizId);
      navigate('/fim', { state: { resultados } });
    }
  };
}
```

---

## ✅ Boas Práticas

1. **Nunca chame axios diretamente nos componentes** - sempre use os services
2. **Trate erros nos componentes** - os services lançam exceções
3. **Use try/catch** em todas as chamadas assíncronas
4. **Verifique autenticação** antes de chamar endpoints protegidos
5. **Não armazene dados sensíveis** no localStorage
6. **Use sessionStorage para tokens** (mais seguro)

---

## 🔒 Segurança

- Tokens são enviados automaticamente via interceptor
- Sessão expira em 401 (redirecionamento automático)
- Dados sensíveis nunca são logados em produção
- CORS configurado no backend

---

## 🐛 Debug

Para ativar logs detalhados, defina:
```env
NODE_ENV=development
```

Os logs mostrarão:
- 🚀 Requisições enviadas
- ✅ Respostas recebidas
- ❌ Erros detalhados
- 🔄 Tentativas de retry

---

## 📝 Checklist de Deploy

- [ ] `REACT_APP_API_BASE_URL` configurada para produção
- [ ] Tokens armazenados em `sessionStorage`
- [ ] Interceptors de erro configurados
- [ ] Logs de debug desabilitados
- [ ] CORS configurado no backend
- [ ] Timeout adequado (10s recomendado)

---

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme que o backend está rodando
3. Valide as variáveis de ambiente
4. Teste os endpoints no Postman/Insomnia
