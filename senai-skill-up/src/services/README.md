# Guia Completo – pasta `src/services`

Esta pasta concentra toda a lógica de comunicação com a sua API REST. A regra principal é **nunca** chamar `axios` diretamente em componentes: use as funções desta camada.

---
## 1. Estrutura recomendada
```
src/
  services/
    api.js            -> instância Axios
    authService.js    -> operações de autenticação (exemplo)
    gameService.js    -> (exemplo) domínio de jogo
    ...Service.js     -> um arquivo por domínio
    README.md         -> este guia
```

Você cria um novo serviço sempre que tiver um conjunto de endpoints relacionados (usuariosService, rankingService etc.).

---
## 2. Configuração da baseURL
1. Crie o arquivo `.env` na raiz do projeto:
   ```env
   REACT_APP_API_URL=https://meu-servidor.herokuapp.com/api
   ```
2. Reinicie o `npm start` para que o CRA leia a variável.
3. Se a variável não existir, `api.js` usa `http://localhost:3000` como padrão.

> Dica: para múltiplos ambientes (dev, staging, prod) crie arquivos `.env.development`, `.env.production`, etc.

---
## 3. api.js – detalhes úteis
```js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000, // 10 s evita requests pendurados
});

// • Interceptador de requisição: automatiza inclusão de token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// • Interceptador de resposta: trata erros globais
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // token expirado → redireciona ou faz logout
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
```

---
## 4. Criando um novo serviço (exemplo Game)
```js
// src/services/gameService.js
import api from './api';

export const getQuestions = () => api.get('/questions');
export const answerQuestion = (id, payload) => api.post(`/questions/${id}/answer`, payload);
```

### Convenções
* Usar nomes de função claros: `get…`, `create…`, `update…`, `delete…`.  
* Retornar sempre a *promessa* (`api.get`) – o componente decide `.then`/`await`.

---
## 5. Consumindo no componente
```js
import { login } from '../services/authService';

async function handleSubmit(e) {
  e.preventDefault();
  try {
    const { data } = await login(email, password);
    // salvar token, navegar, etc.
  } catch (err) {
    setError(err.response?.data?.message || 'Erro inesperado');
  }
}
```

---
## 6. Boas práticas gerais
1. **Responsabilidade única**: componente apenas chama serviço e trata retorno.  
2. **Tratamento de erros** centralizado em `api.interceptors.response` sempre que possível.  
3. **Cache**: se tiver dados que mudam pouco, avalie usar React Query ou SWR sobre a instância `api` para cache automático.
4. **Paginação / filtros**: documente os parâmetros de query no serviço (`getUsers({ page, limit })`).
5. **Tipos** (opcional): usar TypeScript ou JSDoc ajuda a identificar o payload correto dos endpoints.

---
## 7. Checklist antes do deploy
- [ ] Variável `REACT_APP_API_URL` apontando para produção.  
- [ ] `token` salvo em `localStorage` ou `cookie` (HttpOnly).  
- [ ] Tratamento de 401/403 nos interceptadores.  
- [ ] Serviços agrupados por domínio.

Pronto! Sua camada de dados fica separada, reutilizável e fácil de manter. 