// Serviço para gerenciar dados locais da aplicação - APENAS AUTENTICAÇÃO
class LocalStorageService {
  constructor() {
    // Não inicializa dados mockados - apenas autenticação
  }

  // Métodos para autenticação apenas
  getCurrentUser() {
    const currentUserData = sessionStorage.getItem('currentUser');
    return currentUserData ? JSON.parse(currentUserData) : null;
  }

  getAuthToken() {
    return sessionStorage.getItem('authToken');
  }

  getUserData() {
    return this.getCurrentUser();
  }

  setAuthToken(token) {
    sessionStorage.setItem('authToken', token);
  }

  setUserData(userData) {
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  }

  clearUserData() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
  }

  logout() {
    this.clearUserData();
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('authToken');
  }

  // Métodos de compatibilidade removidos - apenas retorna valores vazios
  getUsers() {
    return [];
  }

  getUserById(id) {
    return null;
  }

  getUserByEmail(email) {
    return null;
  }

  createUser(userData) {
    return null;
  }

  updateUser(id, userData) {
    return null;
  }

  authenticateUser(email, senha) {
    return null;
  }

  updateUserPoints(userId, pontos) {
    return null;
  }

  addPointsToUser(userId, pontosAdicionais) {
    return null;
  }

  getGlobalRanking() {
    return [];
  }

  getUserRanking(userId) {
    return null;
  }

  getTemas() {
    return [];
  }

  createTema(temaData) {
    return null;
  }

  getPerguntas() {
    return [];
  }

  getPerguntasByTema(temaId) {
    return [];
  }

  createPergunta(perguntaData) {
    return null;
  }

  savePartida(partidaData) {
    return null;
  }

  getPartidasByUser(userId) {
    return [];
  }
}

// Instância singleton
const localStorageService = new LocalStorageService();
export default localStorageService;