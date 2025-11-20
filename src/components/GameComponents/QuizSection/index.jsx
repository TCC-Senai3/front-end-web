import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SearchIcon from "../../../assets/images/search 1.svg";
import "./style.css";
// Importa a função correta
import { getFormularios } from "../../../services/quizService"; 
import Loader from "../../common/Loader";
import quizSlogan from "../../../assets/images/slogan.svg";
// Importação de imagens para o modal
import image2 from "../../../assets/images/image 2.svg";
import vector1 from "../../../assets/images/Vector (1).svg";
import vector2 from "../../../assets/images/Vector (2).svg";
import addIcon from "../../../assets/images/add.svg";

export default function QuizSection({ onQuizSelect }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [questionarios, setQuestionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Esta função agora busca 'formularios'
    const loadFormularios = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Chama a nova função
            const formulariosResponse = await getFormularios();

            // Valida a resposta
            if (!formulariosResponse.success || !Array.isArray(formulariosResponse.data)) {
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

    // Atualiza o estado de isMobile quando a janela for redimensionada
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Funções para o modal
    const handleOpenModal = (quiz) => {
        setSelectedQuiz(quiz);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedQuiz(null);
        setCurrentSlide(0);
    };

    const handleJoinPrivateRoom = () => {
        if (selectedQuiz) {
            navigate('/pin', { state: { idFormulario: selectedQuiz.id } });
        } else {
            navigate('/pin');
        }
    };

    const handleCreateRoom = () => {
        if (selectedQuiz) {
            navigate('/criarsala', { state: { idFormulario: selectedQuiz.id } });
        } else {
            navigate('/criarsala');
        }
    };

    const nextSlide = () => {
        setCurrentSlide(prev => {
            const next = prev + 1;
            return next > 1 ? 0 : next;
        });
    };

    const prevSlide = () => {
        setCurrentSlide(prev => {
            const next = prev - 1;
            return next < 0 ? 1 : next;
        });
    };

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === 1;

    const slideContainerStyle = {
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(${-currentSlide * 100}%)`,
        width: '200%',
    };

    const renderDesktopView = () => (
        <div className="opcoes-container">
            <div className="opcao-card" style={{ backgroundColor: '#A4DCAB' }} onClick={handleJoinPrivateRoom}>
                <h3>SALA PRIVADA</h3>
                <p>Divirta-se com seus <br/> colegas de classe</p>
                <img src={image2} alt="Sala Privada" className="card-img" />
                <div className="btn-container">
                    <img src={vector1} alt="Botão Sala Privada" className="card-btn" />
                    <span className="btn-text">ENTRAR</span>
                </div>
            </div>

            <img src={addIcon} alt="Separador" className="middle-add-icon" />

            <div className="opcao-card" style={{ backgroundColor: '#A3BFDD' }} onClick={handleCreateRoom}>
                <h3>CRIAR SALA</h3>
                <p>Crie uma sala para você e <br/> seus amigos</p>
                <img src={addIcon} alt="Criar Sala" className="card-img" />
                <div className="btn-container">
                    <img src={vector2} alt="Botão Criar Sala" className="card-btn" />
                    <span className="btn-text">CRIAR</span>
                </div>
            </div>
        </div>
    );

    const renderMobileView = () => (
        <div className="carousel-container">
            <button 
                className="nav-arrow left-arrow" 
                onClick={prevSlide}
                disabled={isFirstSlide}
                aria-label="Slide anterior"
            >
                <FaChevronLeft />
            </button>
            
            <div className="slides-wrapper">
                <div className="slides-container" style={slideContainerStyle}>
                    {/* Card Sala Privada */}
                    <div className="mobile-slide">
                        <div className="opcao-card" style={{ backgroundColor: '#A4DCAB' }} onClick={handleJoinPrivateRoom}>
                            <h3>SALA PRIVADA</h3>
                            <p>Divirta-se com seus <br/>colegas de classe</p>
                            <img src={image2} alt="Sala Privada" className="card-img" />
                            <div className="btn-container">
                                <img src={vector1} alt="Botão Sala Privada" className="card-btn" />
                                <span className="btn-text">ENTRAR</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Criar Sala */}
                    <div className="mobile-slide">
                        <div className="opcao-card" style={{ backgroundColor: '#A3BFDD' }} onClick={handleCreateRoom}>
                            <h3>CRIAR SALA</h3>
                            <p>Crie uma sala para você e <br/>seus amigos</p>
                            <img src={addIcon} alt="Criar Sala" className="card-img" />
                            <div className="btn-container">
                                <img src={vector2} alt="Botão Criar Sala" className="card-btn" />
                                <span className="btn-text">CRIAR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <button 
                className="nav-arrow right-arrow" 
                onClick={nextSlide}
                disabled={isLastSlide}
                aria-label="Próximo slide"
            >
                <FaChevronRight />
            </button>
            
            {/* Indicadores de slide (pontos) */}
            <div className="slide-indicators">
                <button 
                    className={`indicator ${currentSlide === 0 ? 'active' : ''}`} 
                    onClick={() => setCurrentSlide(0)}
                    aria-label="Ir para slide 1"
                    aria-current={currentSlide === 0}
                ></button>
                <button
                    className={`indicator ${currentSlide === 1 ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(1)}
                    aria-label="Ir para slide 2"
                    aria-current={currentSlide === 1}
                ></button>
            </div>
        </div>
    );

    
    // O filtro continua funcionando
    const filteredQuestions = questionarios.filter(q =>
        q.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="questionarios-container">
                <img src={quizSlogan} alt="Quiz" className="quiz-slogan" />
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

                <div className="questionarios-lista">
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
                                className={`questionarios-item ${q.error ? 'error' : ''} ${q.error || q.perguntas.length === 0 ? 'disabled' : ''}`}
                                onClick={() => {
                                    if (!q.error && q.perguntas.length > 0) {
                                        handleOpenModal(q);
                                    }
                                }}
                            >
                                <div className="questionarios-item-img"></div>
                                <div className="questionarios-item-content">
                                    <div className="questionarios-item-titulo">
                                        {q.titulo}
                                    </div>
                                    <div className="questionarios-item-desc">
                                        {q.descricao}
                                    </div>
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

            {/* Modal com blur no fundo */}
            {isModalOpen && (
                <div className="quiz-modal-overlay" onClick={handleCloseModal}>
                    <div className="quiz-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="quiz-modal-close" onClick={handleCloseModal}>×</button>
                        {isMobile ? renderMobileView() : renderDesktopView()}
                    </div>
                </div>
            )}
        </>
    );
}