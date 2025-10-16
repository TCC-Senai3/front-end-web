# Integração com Backend - Página Sala

## Estrutura de Dados Esperada

### GET `/api/salas/{codigo}/usuarios`
**Response:**
```json
[
  {
    "id": "uuid-123",
    "nome": "João Silva",
    "avatar": "https://exemplo.com/avatar.jpg"
  },
  {
    "id": "uuid-456",
    "nome": "Maria Santos",
    "avatar": "https://exemplo.com/avatar2.jpg"
  }
]
```

### DELETE `/api/salas/{codigo}`
**Response:**
```json
{
  "success": true,
  "message": "Sala desmanchada com sucesso"
}
```

### POST `/api/salas/{codigo}/iniciar`
**Response:**
```json
{
  "success": true,
  "jogo_id": "uuid-789",
  "message": "Jogo iniciado com sucesso"
}
```

## Passos para Integração

1. **Definir a URL base da API**
   - Criar arquivo de configuração com a URL da API
   - Exemplo: `const API_URL = process.env.REACT_APP_API_URL`

2. **Implementar chamadas HTTP**
   - Descomentar as linhas marcadas com `TODO` no arquivo `index.js`
   - Substituir as URLs de exemplo pelas URLs reais da API
   - Adicionar headers necessários (Authorization, Content-Type, etc.)

3. **Tratamento de Erros**
   - Implementar feedback visual para erros
   - Adicionar mensagens de erro amigáveis
   - Implementar retry logic se necessário

4. **WebSocket (Opcional)**
   - Para atualização em tempo real da lista de usuários
   - Conectar ao WebSocket quando entrar na sala
   - Desconectar quando sair da sala

## Exemplo de Implementação Completa

```javascript
const fetchUsuarios = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/salas/${codigo}/usuarios`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    
    const data = await response.json();
    setUsuarios(data);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    // Mostrar mensagem de erro para o usuário
  } finally {
    setLoading(false);
  }
};
```

## Estados de Loading

- **Loading**: Mostra "Carregando..."
- **Vazio**: Mostra "Nenhum usuário na sala"
- **Com dados**: Renderiza a lista de usuários
