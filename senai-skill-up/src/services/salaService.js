import api from "./api";

/**
 * Retorna todos os usuários cadastrados.
 */
export const listarUsuarios = async () => {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw error;
  }
};

/**
 * Busca um usuário pelo ID.
 * Retorna null se o usuário não for encontrado.
 */
export const getUserById = async (id) => {
  if (!id) throw new Error("ID do usuário é necessário.");
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`Usuário com ID ${id} não encontrado:`, error.response?.status);
    return null; // Retorna null em vez de lançar para não quebrar o polling
  }
};

/**
 * Lista usuários de uma sala pelo código da sala.
 * Pode ser usado em implementações futuras, mas não é obrigatório.
 */
export const listarUsuariosPorSala = async (codigoSala) => {
  if (!codigoSala) throw new Error("Código da sala é necessário.");
  try {
    const response = await api.get(`/salas/${codigoSala}/usuarios`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao listar usuários da sala ${codigoSala}:`, error);
    throw error;
  }
};

export default {
  listarUsuarios,
  getUserById,
  listarUsuariosPorSala,
};
