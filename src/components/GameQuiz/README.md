# GameQuiz Component

## Descrição
Componente de quiz interativo que consome dados do backend.

## Estrutura de Dados Esperada do Backend

### Iniciar Quiz
**Endpoint:** `POST /quiz/iniciar`

**Request:**
```json
{
  "temaId": 1
}
```

**Response:**
```json
{
  "id": 123,
  "perguntaAtual": {
    "id": 1,
    "tema": "FRONT END",
    "pergunta": "COMO O CSS É UTILIZADO PARA ESTILIZAR UMA PÁGINA WEB?",
    "alternativas": [
      {
        "id": "A",
        "texto": "ELE É USADO PARA CRIAR SCRIPTS E FUNÇÕES.",
        "correta": false
      },
      {
        "id": "B",
        "texto": "ELE DEFINE A ESTRUTURA DA PÁGINA E SUAS INTERAÇÕES.",
        "correta": false
      },
      {
        "id": "C",
        "texto": "ELE ALTERA A APARÊNCIA VISUAL DE UMA PÁGINA.",
        "correta": true
      },
      {
        "id": "D",
        "texto": "ELE É RESPONSÁVEL PELA CRIAÇÃO DE BANCOS DE DADOS.",
        "correta": false
      }
    ]
  }
}
```

### Submeter Resposta
**Endpoint:** `POST /quiz/{quizId}/responder`

**Request:**
```json
{
  "perguntaId": 1,
  "alternativaId": "C"
}
```

**Response:**
```json
{
  "correta": true,
  "proximaPergunta": {
    "id": 2,
    "tema": "FRONT END",
    "pergunta": "O QUE É HTML?",
    "alternativas": [...]
  }
}
```

**Response (última pergunta):**
```json
{
  "correta": true,
  "proximaPergunta": null
}
```

### Finalizar Quiz
**Endpoint:** `POST /quiz/{quizId}/finalizar`

**Response:**
```json
{
  "resultados": [
    { "posicao": 1, "nome": "Usuário", "ganho": 50 },
    { "posicao": 2, "nome": "Outro", "ganho": 30 }
  ]
}
```

### Abandonar Quiz
**Endpoint:** `POST /quiz/{quizId}/abandonar`

**Response:**
```json
{
  "success": true
}
```

## Como Usar

### Navegação para o componente

```javascript
// Com temaId (iniciar novo quiz)
navigate('/quiz', { state: { temaId: 1 } });

// Com quizId (continuar quiz existente)
navigate('/quiz', { state: { quizId: 123 } });
```

## Estados do Componente

1. **Loading:** Exibe "Carregando..." enquanto busca dados
2. **Erro:** Exibe mensagem de erro se falhar
3. **Vazio:** Exibe "-" em todos os campos se não houver dados
4. **Normal:** Exibe pergunta e alternativas normalmente

## Service

O componente usa `gameQuizService` localizado em `src/services/gameQuizService.js`

### Métodos disponíveis:
- `iniciarQuiz(temaId)` - Inicia novo quiz
- `getPerguntaAtual(quizId)` - Busca pergunta atual
- `submeterResposta(quizId, perguntaId, alternativaId)` - Submete resposta
- `finalizarQuiz(quizId)` - Finaliza quiz e retorna resultados
- `abandonarQuiz(quizId)` - Abandona quiz em andamento
