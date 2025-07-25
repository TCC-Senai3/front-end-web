import React, { useEffect, useState } from 'react';
import Header from '../../components/Header_padrao';
import MeioFooter from "../../components/MeioFooter";
import Footer from '../../components/Footer';
import './style.css';
import slogan2 from '../../assets/images/slogan (2).svg';
import image6 from '../../assets/images/image 6.svg';
import image7 from '../../assets/images/image 7.svg';
import image8 from '../../assets/images/image 8.svg';
import image31 from '../../assets/images/image 31.svg';
import SearchIcon from '../../assets/images/search 1.svg';
import ModalHistoricoResultado from '../../components/ModalQuestionario';
import { getGlobalRanking, getUserScore } from '../../services/rankingService';

export default function Perfil() {
    const [ranking, setRanking] = useState([]);
    const [userScore, setUserScore] = useState(null);
    const [modalResultadoOpen, setModalResultadoOpen] = useState(false);
    const [resultadoSelecionado, setResultadoSelecionado] = useState([]);
    const [modalInfo, setModalInfo] = useState({ titulo: '', materia: '', descricao: '', criador: { nome: 'Usuario123', avatar: 'https://ui-avatars.com/api/?name=Usuario123' } });
    const [bio, setBio] = useState('Sonhador(a) em constante evolução | Amante de boas conversas | 🌍 Explorando o mundo, um passo de cada vez! | 📷 Capturando momentos');
    const [editandoBio, setEditandoBio] = useState(false);
    const [novaBio, setNovaBio] = useState(bio);
    const [modalExcluirOpen, setModalExcluirOpen] = useState(false);
    const userId = "mockUserId";
    const [showLapis, setShowLapis] = useState(false);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = [
                    { id: 'user2', nome: 'Maria', pontos: 1500, icon: '/assets/images/image 7.svg' },
                    { id: 'mockUserId', nome: 'Usuario123', pontos: 1200, icon: '/assets/images/image 6.svg' },
                    { id: 'user3', nome: 'João', pontos: 1100, icon: '/assets/images/image 8.svg' },
                    { id: 'user4', nome: 'Ana', pontos: 900 },
                    { id: 'user5', nome: 'Carlos', pontos: 800 },
                ];
                setRanking(data);
            } catch (error) {
                console.error("Erro ao buscar ranking global:", error);
            }
        };

        const fetchUserScore = async () => {
            try {
                const { data } = await getUserScore(userId);
                setUserScore(data.score);
            } catch (error) {
                console.error("Erro ao buscar pontuação do usuário:", error);
            }
        };

        fetchRanking();
        fetchUserScore();
    }, [userId]);

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

    const rankingMock = [
        { id: '1', nome: 'Usuario123', pontos: 950 },
        { id: '2', nome: 'Maria', pontos: 600 },
        { id: '3', nome: 'João', pontos: 500 },
    ];

    return (
        <div>
            <Header />
            <div className="perfil-container">
               
                <main className="perfil-main">
                 
                    <section className="perfil-card">
                       
                        <div className="perfil-avatar">
                            <img src="https://ui-avatars.com/api/?name=Usuario123" alt="Avatar" />
                        </div>
                        <div className="perfil-info perfil-info-flex">
                            <div className="perfil-nome-pontos">
                                <span className="perfil-nome">Usuario123</span>
                                <div className="perfil-pontos">
                                    <img src={image31} alt="Medalha" className="perfil-medal-icon" /> {userScore !== null ? userScore : '---'}
                                </div>
                            </div>
                            <div className="perfil-bio perfil-bio-final"
                                 onMouseEnter={() => setShowLapis(true)}
                                 onMouseLeave={() => setShowLapis(false)}
                                 style={{position: 'relative', cursor: editandoBio ? 'default' : 'pointer'}}
                                 onClick={() => { if (!editandoBio) setEditandoBio(true); }}>
                                <b>Biografia:</b>{' '}
                                {editandoBio ? (
                                    <>
                                        <textarea
                                            className="perfil-bio-textarea"
                                            value={novaBio}
                                            onChange={e => setNovaBio(e.target.value)}
                                            rows={3}
                                            style={{width: '100%', resize: 'vertical', marginTop: 6}}
                                            autoFocus
                                            onClick={e => e.stopPropagation()}
                                        />
                                        <div style={{marginTop: 6, display: 'flex', gap: 8}}>
                                            <button className="perfil-bio-btn-salvar" onClick={e => { e.stopPropagation(); setBio(novaBio); setEditandoBio(false); }}>Salvar</button>
                                            <button className="perfil-bio-btn-cancelar" onClick={e => { e.stopPropagation(); setNovaBio(bio); setEditandoBio(false); }}>Cancelar</button>
                                        </div>
                                    </>
                                ) : (
                                    <span style={{marginLeft: 4, userSelect: 'none'}}>
                                        {bio}
                                        {showLapis && (
                                            <span className="perfil-bio-lapis" style={{marginLeft: 8, fontSize: '1.1em'}}>✏️</span>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Cards harmonizados */}
                    <div className="cards-harmonicos-container">
                        <section className="perfil-status-card card-harmonico">
                            <div className="perfil-status">
                                <span className="perfil-status-dot online"></span> Online
                            </div>
                            <div className="perfil-criado-em">
                                Criado em: <b>20/10/2005</b>
                            </div>
                            <button className="perfil-excluir-btn" onClick={() => setModalExcluirOpen(true)}>Excluir</button>
                        </section>

                        <section className="perfil-ranking-card card-harmonico">
                            <div className="perfil-ranking-top-mock" style={{background: '#eaf2fa'}}>
                                <img src="https://ui-avatars.com/api/?name=Usuario123" alt="Avatar" className="perfil-ranking-avatar-mock" />
                                <span className="perfil-nome-mock">Usuario123</span>
                                <span className="perfil-pontos-mock">
                                    <img src={image31} alt="Medalha" className="perfil-medal-icon-mock" /> 950
                                </span>
                            </div>
                            <div className="perfil-ranking-search-mock">
                                <input type="text" placeholder="Pesquisar..." />
                                <img src={SearchIcon} alt="Pesquisar" className="perfil-ranking-search-icon-mock" />
                            </div>
                            <div className="perfil-ranking-lista-mock">
                                {rankingMock.map((user, i) => (
                                    <div
                                        key={user.id}
                                        className={`perfil-ranking-item-mock${user.nome === 'Usuario123' ? ' perfil-ranking-item-mock-atual' : ''}`}
                                        style={user.nome === 'Usuario123' ? {background: '#fff'} : {background: '#eaf2fa'}}
                                        onClick={() => {
                                            if (user.nome === 'Usuario123') {
                                                alert(`Você é o usuário ${user.nome}`);
                                            } else {
                                                alert(`Visualizar perfil de ${user.nome}`);
                                            }
                                        }}
                                    >
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}`} alt="Avatar" className="perfil-ranking-avatar-mock" />
                                        <span className="perfil-nome-mock">{user.nome}</span>
                                        <span className="perfil-pontos-mock">
                                            <img src={image31} alt="Medalha" className="perfil-medal-icon-mock" /> {user.pontos}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="perfil-historico-ranking-container card-harmonico">
                            
                            <div className="perfil-historico-ranking-pesquisa-container">
                                <input placeholder="Pesquisar..." className="perfil-historico-ranking-pesquisa-input" />
                                <img src={SearchIcon} alt="Pesquisar" className="perfil-historico-ranking-pesquisa-icon" />
                            </div>
                            <div className="perfil-historico-ranking-lista">
                            {[ 
                                { nome: 'Quiz de Matemática', descricao: 'Resolva desafios matemáticos!', materia: 'Matemática', resultado: [
                                    { pergunta: '2 + 2?', respostaUsuario: '4', respostaCorreta: '4', acertou: true },
                                    { pergunta: '5 x 3?', respostaUsuario: '15', respostaCorreta: '15', acertou: true },
                                    { pergunta: 'Raiz de 9?', respostaUsuario: '6', respostaCorreta: '3', acertou: false },
                                ] },
                                { nome: 'História do Brasil', descricao: 'Teste seus conhecimentos históricos.', materia: 'História', resultado: [
                                    { pergunta: 'Ano da independência?', respostaUsuario: '1822', respostaCorreta: '1822', acertou: true },
                                    { pergunta: 'Primeiro presidente?', respostaUsuario: 'Deodoro', respostaCorreta: 'Deodoro', acertou: true },
                                ] },
                                { nome: 'Ciências Naturais', descricao: 'Perguntas sobre biologia e química.', materia: 'Ciências', resultado: [
                                    { pergunta: 'Qual é o principal órgão do corpo humano?', respostaUsuario: 'Coração', respostaCorreta: 'Coração', acertou: true },
                                    { pergunta: 'Quais são os principais gases que compõem o ar?', respostaUsuario: 'Oxigênio, Nitrogênio, Argônio', respostaCorreta: 'Oxigênio, Nitrogênio, Argônio', acertou: true },
                                ] },
                                { nome: 'Geografia Mundial', descricao: 'Descubra curiosidades sobre o mundo.', materia: 'Geografia', resultado: [
                                    { pergunta: 'Qual é o maior rio do mundo?', respostaUsuario: 'Amazonas', respostaCorreta: 'Amazonas', acertou: true },
                                    { pergunta: 'Qual é a maior floresta tropical do mundo?', respostaUsuario: 'Floresta Amazônica', respostaCorreta: 'Floresta Amazônica', acertou: true },
                                ] },
                                { nome: 'Quiz de Inglês', descricao: 'Vocabulário e gramática.', materia: 'Inglês', resultado: [
                                    { pergunta: 'What is the capital of France?', respostaUsuario: 'Paris', respostaCorreta: 'Paris', acertou: true },
                                    { pergunta: 'How do you say "hello" in Spanish?', respostaUsuario: 'Hola', respostaCorreta: 'Hola', acertou: true },
                                ] },
                            ].map((partida, idx) => (
                                <div key={idx} className="perfil-historico-ranking-card-item" onClick={() => {
                                    setResultadoSelecionado(partida.resultado);
                                    setModalInfo({ titulo: partida.nome, materia: partida.materia, descricao: partida.descricao, criador: { nome: 'Usuario123', avatar: 'https://ui-avatars.com/api/?name=Usuario123' } });
                                    setModalResultadoOpen(true);
                                }} style={{ cursor: 'pointer' }}>
                                    <div className="perfil-historico-ranking-card-avatar" style={{width: 60, height: 60, background: '#e3eefd', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        X
                                    </div>
                                    <div className="perfil-historico-ranking-card-info">
                                        <div className="perfil-historico-ranking-card-nome">{partida.nome}</div>
                                        <div className="perfil-historico-ranking-card-pontos">{partida.descricao}</div>
                                        <div className="perfil-historico-ranking-card-materia">Matéria: {partida.materia}</div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <ModalHistoricoResultado 
                open={modalResultadoOpen} 
                onClose={() => setModalResultadoOpen(false)} 
                resultados={resultadoSelecionado} 
                titulo={modalInfo.titulo}
                materia={modalInfo.materia}
                descricao={modalInfo.descricao}
                criador={modalInfo.criador}
            />
            {/* Modal de confirmação de exclusão de conta */}
            {modalExcluirOpen && (
                <div className="modal-questionario-overlay">
                    <div className="modal-questionario-box" style={{minWidth: 400, maxWidth: '90vw', textAlign: 'center'}}>
                        <button className="modal-questionario-close" onClick={() => setModalExcluirOpen(false)} style={{position: 'absolute', top: 18, right: 24}}>
                            <span style={{fontSize: 28, color: '#888'}}>&times;</span>
                        </button>
                        <h2 style={{marginTop: 16, color: '#d32f2f'}}>Confirmar exclusão</h2>
                        <p style={{margin: '24px 0 32px 0', color: '#444'}}>Tem certeza que deseja <b>excluir sua conta</b>?<br/>Esta ação não poderá ser desfeita.</p>
                        <div style={{display: 'flex', justifyContent: 'center', gap: 16}}>
                            <button className="perfil-excluir-btn-cancelar" onClick={() => setModalExcluirOpen(false)} style={{padding: '10px 24px'}}>Cancelar</button>
                            <button className="perfil-excluir-btn-confirmar" style={{background: '#d32f2f', color: '#fff', padding: '10px 24px', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer'}} onClick={() => { setModalExcluirOpen(false); alert('Conta excluída! (mock)'); }}>Excluir conta</button>
                        </div>
                    </div>
                </div>
            )}
            <MeioFooter />
            <Footer />
        </div>
    );
}
