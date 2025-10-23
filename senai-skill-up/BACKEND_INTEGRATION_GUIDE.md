# Guia de Integração com Backend

## 🚀 Configuração Inicial

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

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

### 2. Estrutura de Dados Esperada

#### Ranking
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "pontos": 1500,
      "posicao": 1,
      "avatar": "https://ui-avatars.com/api/?name=João+Silva&background=random"
    }
  ]
}
```

#### Temas
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
      "ativo": true
    }
  ]
}
```

#### Perguntas
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pergunta": "Qual é o resultado de 2 + 2?",
      "temaId": 1,
      "alternativas": [
        {
          "id": 1,
          "texto": "4",
          "correta": true
        },
        {
          "id": 2,
          "texto": "3",
          "correta": false
        }
      ],
      "explicacao": "2 + 2 = 4"
    }
  ]
}
```

## 🔧 Endpoints Necessários

### Autenticação
- `POST /usuarios/login` - Login
- `POST /usuarios/cadastro` - Cadastro
- `GET /usuarios/me` - Perfil do usuário
- `POST /auth/reset-password` - Reset de senha

### Temas e Perguntas
- `GET /temas` - Listar temas
- `GET /temas/{id}` - Buscar tema por ID
- `GET /perguntas/tema/{temaId}` - Perguntas por tema
- `GET /perguntas/tema/{temaId}/random?quantidade=10` - Perguntas aleatórias
- `POST /perguntas/{id}/validar` - Validar resposta

### Ranking
- `GET /ranking/global` - Ranking global
- `GET /ranking/top?limit=10` - Top usuários
- `GET /usuarios/{id}/pontuacao` - Pontuação do usuário
- `POST /usuarios/{id}/pontuacao` - Adicionar pontos
- `PUT /usuarios/{id}/pontuacao` - Definir pontuação

### Estatísticas
- `GET /usuarios/{id}/historico` - Histórico do usuário
- `GET /usuarios/{id}/estatisticas` - Estatísticas do usuário
- `GET /usuarios/{id}/tema/{temaId}/stats` - Estatísticas por tema

### Respostas
- `POST /respostas` - Submeter resposta

## 🗑️ Dados Removidos

### Arquivos Deletados
- `src/data/mockUsers.js` - Dados mockados de usuários
- `src/data/mockQuizData.js` - Dados mockados de quiz

### Funcionalidades Atualizadas
- ✅ `rankingService.js` - Agora usa APIs reais
- ✅ `QuizSection` - Carrega temas do backend
- ✅ `RankingSection` - Carrega ranking do backend
- ✅ Removidos listeners de `localStorage`
- ✅ Removidos dados mockados

## 🔄 Migração Completa

### Antes (Mock)
```javascript
// Dados mockados
import { mockRanking } from '../data/mockQuizData';
const ranking = mockRanking;

// localStorage
const data = localStorage.getItem('ranking');
```

### Depois (Backend)
```javascript
// APIs reais
import { getRankingGlobal } from '../services/rankingService';
const response = await getRankingGlobal();
const ranking = response.data;

// sessionStorage apenas para token
const token = sessionStorage.getItem('authToken');
```

## 🚨 Pontos de Atenção

1. **Autenticação**: Apenas `sessionStorage` para tokens
2. **Cache**: Implementado no `api.js` com TTL configurável
3. **Retry**: Sistema automático de retry para falhas de rede
4. **Error Handling**: Tratamento global de erros no interceptor
5. **Loading States**: Mantidos nos componentes para UX

## 📝 Próximos Passos

1. Configurar variáveis de ambiente
2. Testar endpoints do backend
3. Ajustar estrutura de dados se necessário
4. Implementar testes de integração
5. Configurar monitoramento de erros

## 🔍 Debug

Para debug, ative no `.env`:
```env
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

Isso habilitará logs detalhados no console para todas as requisições.
