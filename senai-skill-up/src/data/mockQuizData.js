// Dados mock para quizzes e ranking
export const mockTemas = [
  {
    id: 1,
    nome: "Matemática Básica",
    descricao: "Operações fundamentais e conceitos básicos",
    cor: "#FF6B6B",
    icone: "📊",
    ativo: true,
    totalPerguntas: 15
  },
  {
    id: 2,
    nome: "História do Brasil",
    descricao: "Fatos históricos e personalidades importantes",
    cor: "#4ECDC4",
    icone: "🏛️",
    ativo: true,
    totalPerguntas: 20
  },
  {
    id: 3,
    nome: "Geografia Mundial",
    descricao: "Países, capitais e características geográficas",
    cor: "#45B7D1",
    icone: "🌍",
    ativo: true,
    totalPerguntas: 18
  },
  {
    id: 4,
    nome: "Ciências Naturais",
    descricao: "Biologia, química e física básica",
    cor: "#96CEB4",
    icone: "🔬",
    ativo: true,
    totalPerguntas: 22
  },
  {
    id: 5,
    nome: "Literatura Brasileira",
    descricao: "Autores, obras e movimentos literários",
    cor: "#FFEAA7",
    icone: "📚",
    ativo: true,
    totalPerguntas: 16
  },
  {
    id: 6,
    nome: "Tecnologia",
    descricao: "Programação, internet e inovação",
    cor: "#DDA0DD",
    icone: "💻",
    ativo: true,
    totalPerguntas: 14
  }
];

export const mockQuestionarios = [
  {
    id: 1,
    titulo: "Operações Matemáticas",
    descricao: "Teste seus conhecimentos em adição, subtração, multiplicação e divisão",
    materia: "Matemática Básica",
    temaId: 1,
    totalPerguntas: 10,
    tempoLimite: 15,
    dificuldade: "Fácil",
    ativo: true,
    criadoEm: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    titulo: "Período Colonial",
    descricao: "Conhecimentos sobre o Brasil Colônia e seus principais eventos",
    materia: "História do Brasil",
    temaId: 2,
    totalPerguntas: 12,
    tempoLimite: 20,
    dificuldade: "Médio",
    ativo: true,
    criadoEm: "2024-01-16T14:30:00Z"
  },
  {
    id: 3,
    titulo: "Capitais do Mundo",
    descricao: "Identifique as capitais dos principais países do mundo",
    materia: "Geografia Mundial",
    temaId: 3,
    totalPerguntas: 15,
    tempoLimite: 18,
    dificuldade: "Médio",
    ativo: true,
    criadoEm: "2024-01-17T09:15:00Z"
  },
  {
    id: 4,
    titulo: "Sistema Solar",
    descricao: "Planetas, estrelas e características do nosso sistema solar",
    materia: "Ciências Naturais",
    temaId: 4,
    totalPerguntas: 8,
    tempoLimite: 12,
    dificuldade: "Fácil",
    ativo: true,
    criadoEm: "2024-01-18T16:45:00Z"
  },
  {
    id: 5,
    titulo: "Machado de Assis",
    descricao: "Vida e obra do maior escritor brasileiro",
    materia: "Literatura Brasileira",
    temaId: 5,
    totalPerguntas: 10,
    tempoLimite: 15,
    dificuldade: "Difícil",
    ativo: true,
    criadoEm: "2024-01-19T11:20:00Z"
  },
  {
    id: 6,
    titulo: "Programação Web",
    descricao: "HTML, CSS, JavaScript e conceitos de desenvolvimento web",
    materia: "Tecnologia",
    temaId: 6,
    totalPerguntas: 12,
    tempoLimite: 20,
    dificuldade: "Difícil",
    ativo: true,
    criadoEm: "2024-01-20T13:10:00Z"
  },
  {
    id: 7,
    titulo: "Frações e Decimais",
    descricao: "Operações com números fracionários e decimais",
    materia: "Matemática Básica",
    temaId: 1,
    totalPerguntas: 14,
    tempoLimite: 18,
    dificuldade: "Médio",
    ativo: true,
    criadoEm: "2024-01-21T08:30:00Z"
  },
  {
    id: 8,
    titulo: "Independência do Brasil",
    descricao: "Processo de independência e seus protagonistas",
    materia: "História do Brasil",
    temaId: 2,
    totalPerguntas: 9,
    tempoLimite: 14,
    dificuldade: "Médio",
    ativo: true,
    criadoEm: "2024-01-22T15:45:00Z"
  }
];

export const mockRanking = [
  {
    id: 1,
    nome: "Ana Silva",
    avatar: null,
    pontuacao: 2450,
    posicao: 1,
    totalPartidas: 12,
    taxaAcerto: 85.5,
    ultimaAtividade: "2024-01-22T10:30:00Z"
  },
  {
    id: 2,
    nome: "Carlos Santos",
    avatar: null,
    pontuacao: 2380,
    posicao: 2,
    totalPartidas: 15,
    taxaAcerto: 82.3,
    ultimaAtividade: "2024-01-22T09:15:00Z"
  },
  {
    id: 3,
    nome: "Maria Oliveira",
    avatar: null,
    pontuacao: 2290,
    posicao: 3,
    totalPartidas: 10,
    taxaAcerto: 88.7,
    ultimaAtividade: "2024-01-21T16:20:00Z"
  },
  {
    id: 4,
    nome: "João Costa",
    avatar: null,
    pontuacao: 2150,
    posicao: 4,
    totalPartidas: 18,
    taxaAcerto: 79.2,
    ultimaAtividade: "2024-01-22T08:45:00Z"
  },
  {
    id: 5,
    nome: "Fernanda Lima",
    avatar: null,
    pontuacao: 2080,
    posicao: 5,
    totalPartidas: 14,
    taxaAcerto: 81.4,
    ultimaAtividade: "2024-01-21T20:10:00Z"
  },
  {
    id: 6,
    nome: "Pedro Alves",
    avatar: null,
    pontuacao: 1950,
    posicao: 6,
    totalPartidas: 11,
    taxaAcerto: 83.6,
    ultimaAtividade: "2024-01-22T07:30:00Z"
  },
  {
    id: 7,
    nome: "Juliana Ferreira",
    avatar: null,
    pontuacao: 1870,
    posicao: 7,
    totalPartidas: 16,
    taxaAcerto: 77.8,
    ultimaAtividade: "2024-01-21T14:55:00Z"
  },
  {
    id: 8,
    nome: "Rafael Souza",
    avatar: null,
    pontuacao: 1790,
    posicao: 8,
    totalPartidas: 13,
    taxaAcerto: 80.1,
    ultimaAtividade: "2024-01-22T06:20:00Z"
  },
  {
    id: 9,
    nome: "Camila Rodrigues",
    avatar: null,
    pontuacao: 1720,
    posicao: 9,
    totalPartidas: 9,
    taxaAcerto: 86.2,
    ultimaAtividade: "2024-01-21T19:40:00Z"
  },
  {
    id: 10,
    nome: "Lucas Martins",
    avatar: null,
    pontuacao: 1650,
    posicao: 10,
    totalPartidas: 17,
    taxaAcerto: 75.9,
    ultimaAtividade: "2024-01-22T05:15:00Z"
  }
];

export const mockPerguntas = [
  {
    id: 1,
    pergunta: "Qual é o resultado de 15 + 27?",
    temaId: 1,
    alternativas: [
      { id: 1, texto: "42", correta: true },
      { id: 2, texto: "32", correta: false },
      { id: 3, texto: "52", correta: false },
      { id: 4, texto: "22", correta: false }
    ],
    explicacao: "15 + 27 = 42. Para somar, adicionamos as unidades (5+7=12) e as dezenas (1+2=3), resultando em 42."
  },
  {
    id: 2,
    pergunta: "Quem descobriu o Brasil em 1500?",
    temaId: 2,
    alternativas: [
      { id: 1, texto: "Pedro Álvares Cabral", correta: true },
      { id: 2, texto: "Cristóvão Colombo", correta: false },
      { id: 3, texto: "Vasco da Gama", correta: false },
      { id: 4, texto: "Fernão de Magalhães", correta: false }
    ],
    explicacao: "Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500, na expedição que partiu de Portugal."
  },
  {
    id: 3,
    pergunta: "Qual é a capital da França?",
    temaId: 3,
    alternativas: [
      { id: 1, texto: "Paris", correta: true },
      { id: 2, texto: "Lyon", correta: false },
      { id: 3, texto: "Marselha", correta: false },
      { id: 4, texto: "Nice", correta: false }
    ],
    explicacao: "Paris é a capital e maior cidade da França, conhecida como a 'Cidade Luz'."
  }
];

// Função para simular delay de API
export const simulateApiDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Função para filtrar questionários por busca
export const filtrarQuestionarios = (questionarios, termoBusca) => {
  if (!termoBusca) return questionarios;
  
  const termo = termoBusca.toLowerCase();
  return questionarios.filter(quiz => 
    quiz.titulo.toLowerCase().includes(termo) ||
    quiz.descricao.toLowerCase().includes(termo) ||
    quiz.materia.toLowerCase().includes(termo)
  );
};

// Função para filtrar ranking por busca
export const filtrarRanking = (ranking, termoBusca) => {
  if (!termoBusca) return ranking;
  
  const termo = termoBusca.toLowerCase();
  return ranking.filter(usuario => 
    usuario.nome.toLowerCase().includes(termo)
  );
};
