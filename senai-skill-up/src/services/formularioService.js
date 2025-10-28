import api from './api';

// Listar todos os formulários
// (Esta função não precisa do { success: ... } porque seu useAuth não usa,
// mas vou manter seu código original por consistência)
export const getFormularios = async () => {
  const response = await api.get('/formularios');
  return response.data;
};

// --- FUNÇÃO ATUALIZADA ---
// Agora ela recebe o objeto 'quizData' completo (o JSON)
// e o 'api.js' cuida do token de autorização automaticamente.
export const createFormulario = async (quizData) => {
  const response = await api.post('/formularios/completo', quizData);
  return response.data;
};

// (Você pode querer adicionar as outras funções do quizService aqui também,
// como getFormularioById, deleteFormulario, etc.)

export default {
  getFormularios,
  createFormulario
};