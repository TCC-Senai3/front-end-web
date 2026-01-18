import React, { useState, useEffect } from "react";
import SearchIcon from "../../../assets/images/search 1.svg";
import { getTemas, getPerguntas } from "../../../services/quizService";
import "./style.css";

export default function QuizSection({ onQuizSelect }) {
    const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
    const [filterSearchTerm, setFilterSearchTerm] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [temas, setTemas] = useState([]);
    const [questionarios, setQuestionarios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carrega temas e questionários do localStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                // Carregar temas
                const temasResponse = await getTemas();
                const temasData = temasResponse.data || [];
                setTemas(temasData);

                // Carregar perguntas e agrupar por tema
                const perguntasResponse = await getPerguntas();
                const perguntasData = perguntasResponse.data || [];

                // Criar questionários agrupados por tema
                const questionariosMap = {};
                
                perguntasData.forEach(pergunta => {
                    const tema = temasData.find(t => t.id === pergunta.temaId);
                    if (tema) {
                        if (!questionariosMap[pergunta.temaId]) {
                            questionariosMap[pergunta.temaId] = {
                                id: pergunta.temaId,
                                titulo: `Quiz de ${tema.nome}`,
                                descricao: tema.descricao || `Questionário sobre ${tema.nome}`,
                                materia: tema.nome,
                                temaId: pergunta.temaId,
                                perguntas: []
                            };
                        }
                        questionariosMap[pergunta.temaId].perguntas.push(pergunta);
                    }
                });

                // Converter para array
                const questionariosArray = Object.values(questionariosMap);
                setQuestionarios(questionariosArray);

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setTemas([]);
                setQuestionarios([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        // Atualizar quando localStorage mudar
        const handleStorageChange = () => {
            loadData();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Filtrar temas
    const filteredSubjects = temas.filter(tema =>
        tema.nome.toLowerCase().includes(filterSearchTerm.toLowerCase())
    );

    // Filtrar questionários
    const filteredQuestions = questionarios.filter(questionario => {
        const matchesSearchTerm = questionario.titulo.toLowerCase().includes(subjectSearchTerm.toLowerCase()) ||
                                  questionario.descricao.toLowerCase().includes(subjectSearchTerm.toLowerCase());
        const matchesSubjects = selectedSubjects.length === 0 || selectedSubjects.includes(questionario.materia);
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
    return (
        <div className="questionarios-container">
            <img src={require("../../../assets/images/slogan.svg").default} alt="Quiz" className="quiz-slogan" />
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
                    {filteredSubjects.map(tema => (
                        <div 
                            key={tema.id} 
                            className={`questionarios-filtros-item ${selectedSubjects.includes(tema.nome) ? 'selected' : ''}`}
                            onClick={() => handleSubjectChange(tema.nome)}
                        >
                            <span className="questionarios-filters-item-text">{tema.nome}</span>
                            <span className="questionarios-filters-item-arrow">&#x25BC;</span>
                        </div>
                    ))}
                </div>
                <div className="questionarios-lista">
                    {loading ? (
                        <p>Carregando questionários...</p>
                    ) : filteredQuestions.length > 0 ? (
                        filteredQuestions.map(questionario => (
                            <div 
                                key={questionario.id} 
                                className="questionarios-item" 
                                onClick={() => onQuizSelect(questionario)} 
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="questionarios-item-img"></div>
                                <div>
                                    <div className="questionarios-item-titulo">{questionario.titulo}</div>
                                    <div className="questionarios-item-desc">{questionario.descricao}</div>
                                    <div className="questionarios-item-materia">Matéria: {questionario.materia}</div>
                                    <div className="questionarios-item-perguntas">
                                        {questionario.perguntas?.length || 0} pergunta(s)
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="questionarios-empty">
                            <p>Nenhum questionário encontrado.</p>
                            <p>Crie seu primeiro quiz na página <strong>Criar Quiz</strong>!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}