import api from "./api";

// Listar todas as salas
export const getSalas = async () => {
  try {
    const response = await api.get("/salas");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar salas:", error);
    throw error;
  }
};

// Buscar sala por ID (Numérico)
export const getSalaById = async (id) => {
  if (!id) throw new Error("ID da sala é necessário.");
  try {
    const response = await api.get(`/salas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar sala com ID ${id}:`, error);
    throw error;
  }
};

// Criar nova sala
export const createSala = async (salaData) => {
  if (!salaData) throw new Error("Dados da sala são necessários.");
  try {
    const response = await api.post("/salas", salaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    throw error;
  }
};

// Entrar em uma sala usando o CÓDIGO (String)
export const entrarNaSala = async (codigoSala, idUsuario) => {
  if (!codigoSala || !idUsuario)
    throw new Error("Código da sala e ID do usuário são necessários.");
  try {
    const response = await api.post(`/salas/${codigoSala}/entrar/${idUsuario}`);
    return response.data; // Mensagem de confirmação
  } catch (error) {
    console.error(
      `Erro ao entrar na sala ${codigoSala} para usuário ${idUsuario}:`,
      error
    );
    throw error;
  }
};

// Busca sala pelo código PIN (String)
export const getSalaByPin = async (pin) => {
  if (!pin) throw new Error("PIN é necessário.");
  try {
    const response = await api.get(`/salas/codigo/${pin}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar sala com PIN ${pin}:`, error);
    throw error;
  }
};

// Fechar/Desmanchar uma sala (dono)
export const fecharSala = async (idSala) => {
  if (!idSala) throw new Error("ID da sala é necessário para fechar.");
  try {
    const response = await api.put(`/salas/${idSala}/fechar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao fechar sala com ID ${idSala}:`, error);
    throw error;
  }
};

// --- NOVA FUNÇÃO ADICIONADA ---
// Sair de uma sala (para participantes)
export const sairDaSala = async (codigoSala, idUsuario) => {
  if (!codigoSala || !idUsuario) {
    throw new Error(
      "Código da sala e ID do usuário são necessários para sair."
    );
  }
  try {
    // Chama o endpoint DELETE /salas/{codigoSala}/sair/{idUsuario}
    console.log(
      `salaService: Tentando remover usuário ${idUsuario} da sala ${codigoSala}`
    );
    const response = await api.delete(`/salas/${codigoSala}/sair/${idUsuario}`);
    console.log(`salaService: Resposta da API ao sair:`, response.data);
    return response.data; // Retorna a mensagem de sucesso do backend
  } catch (error) {
    console.error(
      `Erro ao tentar sair da sala ${codigoSala} para usuário ${idUsuario}:`,
      error
    );
    throw error; // Re-lança para o componente tratar
  }
};
// --- FIM DA NOVA FUNÇÃO ---

// Exporta todas as funções
export default {
  getSalas,
  getSalaById,
  createSala,
  entrarNaSala,
  getSalaByPin,
  fecharSala,
  sairDaSala, // <<< ADICIONADA AO EXPORT
};
