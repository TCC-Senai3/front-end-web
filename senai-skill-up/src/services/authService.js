// Serviço de autenticação preparado para backend Java
import api from './api';

// Classe para gerenciar autenticação
class AuthService {

  /**
   * Realiza o login enviando os dados no corpo (body) da requisição.
   * Deixa o axios lançar um erro em caso de falha (ex: 401 Unauthorized).
   */
  async login(email, senha) {
    const response = await api.post('/usuarios/login', { email, senha });
    return response.data; // Retorna diretamente os dados em caso de sucesso
  }

  /**
   * Realiza o cadastro de um novo usuário.
   */
  async register(userData) {
    const response = await api.post('/usuarios/cadastro', userData);
    return response.data;
  }

  /**
   * Solicita a redefinição de senha, enviando o email como query param.
   */
  async resetPassword(email) {
    await api.post('/senha/esqueceu', null, { params: { email } });
    // Para este método, podemos retornar uma mensagem de sucesso, pois não há dados para retornar.
    return { success: true, message: 'Se um e-mail cadastrado for encontrado, um link de recuperação será enviado.' };
  }

  /**
   * Confirma a redefinição de senha, enviando o token e a nova senha como query params.
   */
  async confirmPasswordReset(token, newPassword) {
    await api.post('/senha/reset', null, { params: { token, newPassword } });
    return { success: true, message: 'Senha redefinida com sucesso!' };
  }
  
  /**
   * Busca os dados do perfil do usuário logado.
   */
  async getUserProfile() {
    const response = await api.get(`/usuarios/me`);
    return response.data;
  }

  /**
   * Atualiza o perfil de um usuário.
   */
  async updateProfile(userId, userData) {
    const response = await api.put(`/usuarios/${userId}`, userData);
    return response.data;
  }

  // --- MÉTODOS DE GERENCIAMENTO LOCAL (NÃO FAZEM CHAMADA À API) ---

  /**
   * Faz o logout do usuário, limpando os dados da sessão.
   */
  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
  }

  /**
   * Verifica se o usuário está autenticado localmente.
   */
  isAuthenticated() {
    return !!sessionStorage.getItem('authToken');
  }

  /**
   * Obtém os dados do usuário atual salvos na sessão.
   */
  getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }
}

const authService = new AuthService();
export default authService;