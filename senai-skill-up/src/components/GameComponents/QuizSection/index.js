import React, { useState, useEffect } from "react";
import SearchIcon from "../../../assets/images/search 1.svg";
import "./style.css";
import { mockQuestionarios, mockTemas, filtrarQuestionarios, simulateApiDelay } from "../../../data/mockQuizData";
import Loader from "../../common/Loader";

export default function QuizSection({ onQuizSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [questionarios, setQuestionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadQuestionarios = async () => {
            try {
                setLoading(true);
                await simulateApiDelay(1200); // Simula delay da API
                
                // Usa os dados mock dos questionários
                const questionariosComPerguntas = mockQuestionarios.map(quiz => ({
                    id: quiz.id,
                    titulo: quiz.titulo,
                    descricao: quiz.descricao,
                    materia: quiz.materia,
                    dificuldade: quiz.dificuldade,
                    totalPerguntas: quiz.totalPerguntas,
                    tempoLimite: quiz.tempoLimite,
                    perguntas: [] // Será carregado quando o quiz for selecionado
                }));

                setQuestionarios(questionariosComPerguntas);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar questionários:', err);
                setError('Não foi possível carregar os questionários. Tente novamente mais tarde.');
                setQuestionarios([]);
            } finally {
                setLoading(false);
            }
        };

        loadQuestionarios();
    }, []);

    const filteredQuestions = questionarios.filter(q =>
        q.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="questionarios-container">
            <img src={require("../../../assets/images/slogan.svg").default} alt="Quiz" className="quiz-slogan" />
            <div className="questionarios-header">
                <h1>Escolha um Quiz</h1>
                <div className="search-container">
                    <img src={SearchIcon} alt="Buscar" className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por tema ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        disabled={loading || error}
                    />
                </div>
            </div>

            <div className="questionarios-list">
                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button 
                            className="retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : filteredQuestions.length > 0 ? (
                    filteredQuestions.map(q => (
                        <div 
                            key={q.id} 
                            className={`questionarios-item ${q.error ? 'error' : ''}`}
                        >
                            <div className="questionarios-item-img"></div>
                            <div>
                                <div className="questionarios-item-titulo">
                                    {q.titulo}
                                    {q.error && <span className="error-badge">Erro</span>}
                                </div>
                                <div className="questionarios-item-desc">
                                    {q.error ? 'Não foi possível carregar as perguntas deste questionário.' : q.descricao}
                                </div>
                                <button 
                                    className="questionarios-item-btn" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!q.error && q.perguntas.length > 0) {
                                            onQuizSelect(q);
                                        }
                                    }}
                                    disabled={q.error || q.perguntas.length === 0}
                                >
                                    {q.error ? 'Indisponível' : q.perguntas.length === 0 ? 'Sem perguntas' : 'JOGAR'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="questionarios-empty">
                        <p>Nenhum questionário encontrado.</p>
                        {searchTerm && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                            >
                                Limpar busca
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
