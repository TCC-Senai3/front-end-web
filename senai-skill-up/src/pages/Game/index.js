import React, { useEffect, useState } from "react";
import Header from '../../components/Header_padrao';
import MeioFooter from "../../components/MeioFooter";
import Footer from '../../components/Footer';
import "./style.css";
import { getGlobalRanking } from '../../services/rankingService';
import image6 from '../../assets/images/image 6.svg';
import image7 from '../../assets/images/image 7.svg';
import image8 from '../../assets/images/image 8.svg';
import image31 from '../../assets/images/image 31.svg'; 
import SearchIcon from '../../assets/images/search 1.svg'; 
import ModalQuestionario from '../../components/ModalQuestionario';

function LoadHost() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <img src={require('../../assets/images/Gameboy.svg').default} alt="Gameboy" style={{ width: 120, height: 120, marginBottom: 16 }} />
      <div style={{ fontWeight: 600, fontSize: 18, color: '#fff', marginBottom: 16, textAlign: 'center', textShadow: '0 2px 8px #0003' }}>
        Aguardando o host da Sala
      </div>
      <form style={{ background: '#fff', borderRadius: 6, boxShadow: '0 2px 12px #0001', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 320 }}>
        <input
          type="text"
          placeholder="Carregando..."
          className="pinpage-input"
          disabled
          style={{ marginBottom: 10 }}
        />
        <button
          type="button"
          className="pinpage-btn"
          style={{ background: '#e53935', color: '#fff', fontWeight: 700 }}
          disabled
        >
          Carregando...
        </button>
      </form>
    </div>
  );
}

export default function Game() {
    const [ranking, setRanking] = useState([]);
    const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
    const [filterSearchTerm, setFilterSearchTerm] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [questionarioSelecionado, setQuestionarioSelecionado] = useState(null);

    const availableSubjects = [
        { id: 'redes', name: 'Redes' },
        { id: 'mecanica', name: 'Mecânica' },
        { id: 'programacao', name: 'Programação' },
        { id: 'matematica', name: 'Matemática' },
        { id: 'historia', name: 'História' },
        { id: 'ingles', name: 'Inglês' },
        { id: 'ciencias', name: 'Ciências' },
    ];

    const mockQuestions = [
        { id: 1, titulo: 'Quiz de Matemática Básica', descricao: 'Operações fundamentais.', materia: 'Matemática' },
        { id: 2, titulo: 'Introdução a Redes', descricao: 'Conceitos básicos de redes.', materia: 'Redes' },
        { id: 3, titulo: 'Programação em JavaScript', descricao: 'Fundamentos de JS.', materia: 'Programação' },
        { id: 4, titulo: 'Mecânica Clássica', descricao: 'Leis de Newton.', materia: 'Mecânica' },
        { id: 5, titulo: 'História do Brasil Colonial', descricao: 'Período pré-independência.', materia: 'História' },
        { id: 6, titulo: 'Inglês Básico', descricao: 'Vocabulário e frases.', materia: 'Inglês' },
        { id: 7, titulo: 'Ciências Naturais: Biologia', descricao: 'Reino Animal.', materia: 'Ciências' },
        { id: 8, titulo: 'Algoritmos Avançados', descricao: 'Estruturas de dados.', materia: 'Programação' },
        { id: 9, titulo: 'Geometria Analítica', descricao: 'Coordenadas e vetores.', materia: 'Matemática' },
        { id: 10, titulo: 'Redes sem Fio', descricao: 'Tecnologias Wi-Fi.', materia: 'Redes' },
    ];

    const filteredSubjects = availableSubjects.filter(subject =>
        subject.name.toLowerCase().includes(filterSearchTerm.toLowerCase())
    );

    const filteredQuestions = mockQuestions.filter(question => {
        const matchesSearchTerm = question.titulo.toLowerCase().includes(subjectSearchTerm.toLowerCase()) ||
                                  question.descricao.toLowerCase().includes(subjectSearchTerm.toLowerCase());
        const matchesSubjects = selectedSubjects.length === 0 || selectedSubjects.includes(question.materia);
        return matchesSearchTerm && matchesSubjects;
    });

    const handleSubjectChange = (subjectName) => {
        setSelectedSubjects(prevSelectedSubjects => {
            if (prevSelectedSubjects.includes(subjectName)) {
                return prevSelectedSubjects.filter(s => s !== subjectName);
            } else {
                return [subjectName];
            }
        });
    };

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const { data } = await getGlobalRanking();
                setRanking(data);
            } catch (error) {
                console.error("Erro ao buscar ranking global no jogo:", error);
            }
        };

        fetchRanking();
    }, []);

    const getRankIcon = (iconPath) => {
        switch (iconPath) {
            case '/assets/images/image 6.svg':
                return image6;
            case '/assets/images/image 7.svg':
                return image7;
            case '/assets/images/image 8.svg':
                return image8;
            default:
                return null;
        }
    };

    return (
        <div>

            <Header />
            <img src={require('../../assets/images/Group 13.png')} alt="Background gráfico" style={{ width: '100%', display: 'block' }} />
           
            
            <div className="jogue-agora-container">
                <div className="opcoes-container">
                    <div className="opcao-card" style={{ backgroundColor: '#E5CFB7' }}>
                        <h3>RANQUEADO</h3>
                        <p>Jogue contra outros <br/> jogadores em busca do topo <br/> do rank</p>
                        <img src={require('../../assets/images/image 31.svg').default} alt="Ranqueado" className="card-img" />
                        <div className="btn-container">
                            <img src={require('../../assets/images/Vector.svg').default} alt="Botão Ranqueado" className="card-btn" />
                            <span className="btn-text">PLAY</span>
                        </div>
                    </div>
                    <div className="opcao-card" style={{ backgroundColor: '#A4DCAB' }}>
                        <h3>SALA PRIVADA</h3>
                        <p>Divirta-se com seus <br/> colegas de classe</p>
                        <img src={require('../../assets/images/image 2.svg').default} alt="Sala Privada" className="card-img" />
                        <div className="btn-container">
                            <img src={require('../../assets/images/Vector (1).svg').default} alt="Botão Sala Privada" className="card-btn" />
                            <span className="btn-text">ENTRAR</span>
                        </div>
                    </div>
                    <div className="opcao-card" style={{ backgroundColor: '#A3BFDD' }}>
                        <h3>CRIAR SALA</h3>
                        <p>Crie uma sala para você e <br/> seus amigos</p>
                        <img src={require('../../assets/images/add.svg').default} alt="Criar Sala" className="card-img" />
                        <div className="btn-container">
                            <img src={require('../../assets/images/Vector (2).svg').default} alt="Botão Criar Sala" className="card-btn" />
                            <span className="btn-text">CRIAR</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabelas de Ranking e Questionários */}
            <div className="game-content-wrapper" style={{ display: 'flex', marginTop: '60px' }}>
                {/* Ranking */}
                <div className="ranking-container">
                    <div className="ranking-pesquisa-container">
                        <input placeholder="Pesquisar..." className="ranking-pesquisa-input" />
                        <img src={SearchIcon} alt="Pesquisar" className="ranking-pesquisa-icon" />
                    </div>
                    <div className="ranking-lista">
                    {ranking.length > 0 ? ranking.map((user, idx) => (
                        <div
                            key={user.id || idx}
                            className="ranking-item"
                            onClick={() => {
                                if (user.nome === 'Usuario123') {
                                    alert(`Você é o usuário ${user.nome}`);
                                } else {
                                    alert(`Visualizar perfil de ${user.nome}`);
                                }
                            }}
                        >
                            {idx < 3 && user.icon ? (
                                <img src={getRankIcon(user.icon)} alt={`Rank ${idx + 1}`} className="ranking-pos-icon" /> 
                            ) : (
                                <span className="ranking-pos">{idx + 1}</span>
                            )}
                            <img src="https://ui-avatars.com/api/?name=User" alt="avatar" className="ranking-avatar" />
                            <span className="ranking-nome">{user.nome}</span>
                            <img src={image31} alt="Medalha" className="ranking-medal-icon" />
                            <span className="ranking-pontos">{user.pontos !== undefined ? user.pontos : '-'}</span>
                        </div>
                    )) : <p>Nenhum usuário no ranking ainda.</p>}
                    </div>
                </div>

                {/* Questionários */}
                <div className="questionarios-container">
                    <div className="questionarios-pesquisa-container">
                        <input 
                            placeholder="Pesquisar questionário..." 
                            className="questionarios-pesquisa-input" 
                            value={subjectSearchTerm}
                            onChange={(e) => setSubjectSearchTerm(e.target.value)}
                        />
                        <img src={SearchIcon} alt="Pesquisar" className="questionarios-pesquisa-icon" />
                    </div>
                    <div className="questionarios-filtros-lista">
                        <div className="questionarios-filtros">
                            <div className="questionarios-filtros-header">
                                <div className="questionarios-filtros-titulo">Filtros</div>
                                <input 
                                    type="text" 
                                    placeholder="Pesquisar matéria..." 
                                    value={filterSearchTerm}
                                    onChange={(e) => setFilterSearchTerm(e.target.value)}
                                    className="questionarios-filtros-pesquisa-input"
                                />
                            </div>
                            {filteredSubjects.map(subject => (
                                <div 
                                    key={subject.id} 
                                    className={`questionarios-filtros-item ${selectedSubjects.includes(subject.name) ? 'selected' : ''}`}
                                    onClick={() => handleSubjectChange(subject.name)}
                                >
                                    <span className="questionarios-filters-item-text">{subject.name}</span>
                                    <span className="questionarios-filters-item-arrow">&#x25BC;</span> {/* Ícone de dropdown */}
                                </div>
                            ))}
                        </div>
                        <div className="questionarios-lista">
                            {filteredQuestions.length > 0 ? filteredQuestions.map(question => (
                                <div key={question.id} className="questionarios-item" onClick={() => { setQuestionarioSelecionado(question); setModalOpen(true); }} style={{ cursor: 'pointer' }}>
                                    <div className="questionarios-item-img"></div>
                                    <div>
                                        <div className="questionarios-item-titulo">{question.titulo}</div>
                                        <div className="questionarios-item-desc">{question.descricao}</div>
                                        <div className="questionarios-item-materia">Matéria: {question.materia}</div>
                                    </div>
                                </div>
                            )) : <p>Nenhum questionário encontrado para os filtros.</p>}
                        </div>
                    </div>
                </div>
            </div>
            {/* Espaçamento extra entre as tabelas e o MeioFooter */}
            <div style={{ height: '80px' }}></div>

            <MeioFooter />
            <Footer />
            <ModalQuestionario 
                open={modalOpen} 
                onClose={() => setModalOpen(false)} 
                questionario={questionarioSelecionado || {}} 
            />
        </div>
    );
}
