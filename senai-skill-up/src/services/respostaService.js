import api from './api'; // Importa a instância configurada do Axios

/**
 * Envia a resposta selecionada pelo usuário para o backend.
 * O token de autenticação é adicionado automaticamente pelo interceptor do 'api.js'.
 * @param {object} respostaData - Objeto contendo os dados da resposta.
 * @param {number} respostaData.idUsuario - ID do usuário logado.
 * @param {number} respostaData.idPergunta - ID da pergunta respondida.
 * @param {number} respostaData.idAlternativaSelecionada - ID da alternativa escolhida.
 * @param {number} [respostaData.tempoGasto] - Tempo (em segundos) gasto na pergunta (opcional).
 * @param {number|null} [respostaData.idSala] - ID da sala (se aplicável, null caso contrário).
 * @returns {Promise<object>} A resposta da API.
 */
export const enviarResposta = async (respostaData) => {
  // Apenas faz a chamada POST. O 'api' cuida da baseURL e do token.
  const response = await api.post('/respostas', respostaData);
  return response.data; // Retorna os dados da resposta da API
};

// Exporta a função para ser usada em outros lugares
export default {
  enviarResposta
};