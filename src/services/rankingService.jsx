import api from "./api";

// Buscar ranking global
export const getRankingGlobal = async () => {
  try {
    const response = await api.get("/ranking/geral"); // MODIFICADO: Simplifiquei a resposta, o FimDeJogo não espera {success: true}
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ranking global:", error);
    throw error; // Re-lança o erro para o componente tratar
  }
};

// Buscar pontuação do usuário
export const getPontuacaoUsuario = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}/pontuacao`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pontuação do usuário:", error);
    throw error;
  }
};

// Buscar pontuação atualizada do usuário logado (sem precisar do userId)
export const getPontuacaoAtual = async () => {
  try {
    const response = await api.get("/usuarios/me");
    const pontuacao = response.data?.pontuacao;
    
    // Retorna a pontuação se existir, caso contrário retorna 0
    // Usa !== undefined para permitir que 0 seja um valor válido
    if (pontuacao !== undefined && pontuacao !== null) {
      return Number(pontuacao);
    }
    return 0;
  } catch (error) {
    console.error("Erro ao buscar pontuação atual do usuário:", error);
    throw error;
  }
};

// Adicionar pontos ao usuário
export const adicionarPontos = async (userId, pontos) => {
  try {
    const response = await api.post(`/usuarios/${userId}/pontuacao`, {
      pontos,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar pontos:", error);
    throw error;
  }
};

// Definir pontuação específica
export const definirPontuacao = async (userId, pontos) => {
  try {
    const response = await api.put(`/usuarios/${userId}/pontuacao`, { pontos });
    return response.data;
  } catch (error) {
    console.error("Erro ao definir pontuação:", error);
    throw error;
  }
};

// Buscar histórico de partidas do usuário
export const getHistoricoUsuario = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}/historico`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar histórico do usuário:", error);
    throw error;
  }
};

// Obter estatísticas do usuário
export const getEstatisticasUsuario = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}/estatisticas`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas do usuário:", error);
    throw error;
  }
};

// Buscar top usuários
export const getTopRanking = async (limit = 10) => {
  try {
    const response = await api.get("/ranking/geral", { params: { limit } });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar top ranking:", error);
    throw error;
  }
};

// =========================================================
// ✅ FUNÇÃO ADICIONADA PARA O FIMDEJOGO
// =========================================================

/**
 * Busca o ranking final de uma sala específica.
 * (Chama o endpoint GET /ranking/sala/{idSala})
 * @param {number} idSala - O ID da sala que terminou.
 * @returns {Promise<Array<object>>} Uma lista de jogadores e suas pontuações na partida.
 */
export const getRankingSala = async (idSala) => {
  if (!idSala)
    throw new Error("ID da Sala é obrigatório para buscar o ranking.");
  try {
    const response = await api.get(`/ranking/sala/${idSala}`);
    return response.data; // Retorna a lista de ranking da partida
  } catch (error) {
    console.error(`Erro ao buscar ranking da sala ${idSala}:`, error);
    throw error;
  }
};

// =========================================================
// ✅ CORREÇÃO DE EXPORTAÇÃO (Para evitar erros de build do Vercel)
// =========================================================

const rankingService = {
  getRankingGlobal,
  getPontuacaoUsuario,
  getPontuacaoAtual,
  adicionarPontos,
  definirPontuacao,
  getHistoricoUsuario,
  getEstatisticasUsuario,
  getTopRanking,
  getRankingSala, // Adicionada a nova função ao objeto
};

export default rankingService;
