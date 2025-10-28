import React, { useState, useEffect, useCallback } from "react";
import SearchIcon from "../../../assets/images/search 1.svg";
import "./style.css";
// Importa a função correta
import { getFormularios } from "../../../services/quizService"; 
import Loader from "../../common/Loader";

export default function QuizSection({ onQuizSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [questionarios, setQuestionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Esta função agora busca 'formularios'
    const loadFormularios = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Chama a nova função
            const formulariosResponse = await getFormularios();

            // Valida a resposta
            if (!formulariosResponse.success || !Array.isArray(formulariosResponse.data)) {
                console.error('Falha ao buscar formulários:', formulariosResponse.message);
                throw new Error('Não foi possível carregar os questionários.');
            }

            const formularios = formulariosResponse.data;

            // Mapeia os dados de 'formulario' para 'questionario'
            // JSON esperado: { idFormulario, titulo, perguntas: [...] }
            const questionariosMapeados = formularios.map(form => {
                const perguntas = form.perguntas || [];
                return {
                    id: form.idFormulario,
                    titulo: form.titulo,
                    // Criamos uma descrição padrão
                    descricao: `Um quiz baseado no ${form.titulo}.`, 
                    materia: form.titulo,
                    dificuldade: 'Média', 
                    tempoLimite: 15, 
                    perguntas: perguntas,
                    totalPerguntas: perguntas.length,
                    error: false 
                };
            });

            // Filtramos quizzes que podem ter vindo sem perguntas
            const quizzesValidos = questionariosMapeados.filter(q => q.totalPerguntas > 0);
            setQuestionarios(quizzesValidos);
            
        } catch (err) {
            console.error('Erro ao carregar questionários (formulários):', err);
            setError(err.message || 'Não foi possível carregar os questionários. Tente novamente mais tarde.');
            setQuestionarios([]);
        } finally {
            setLoading(false);
        }
    }, []); // Array de dependências do useCallback

    // O useEffect chama a função de carregar
    useEffect(() => {
        loadFormularios();
    }, [loadFormularios]);

    
    // O filtro continua funcionando
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
                        {/* O botão de retry agora chama a função correta */}
                        <button 
                            className="retry-button"
                            onClick={loadFormularios} 
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
                            {/* Recomendação: Adicionar uma imagem de placeholder */}
                            <div className="questionarios-item-img"></div>
                            <div>
                                <div className="questionarios-item-titulo">
                                    {q.titulo}
                                </div>
                                <div className="questionarios-item-desc">
                                    {q.descricao}
                                </div>
                                <button 
                                    className="questionarios-item-btn" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!q.error && q.perguntas.length > 0) {
                                            onQuizSelect(q);
                                        }
                                    }}
                                    // A lógica do botão agora funciona
                                    disabled={q.error || q.perguntas.length === 0}
                                >
                                    {q.error ? 'Indisponível' : q.perguntas.length === 0 ? 'Sem perguntas' : 'JOGAR'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="questionarios-empty">
                        <p>{searchTerm ? 'Nenhum questionário encontrado.' : 'Nenhum questionário disponível no momento.'}</p>
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