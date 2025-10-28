import React, { useEffect, useState } from 'react'; // Import hooks
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks
import { Header, Footer } from '../../components'; // Footer não está sendo usado, mas ok
import GameQuiz from '../../components/GameQuiz'; // O componente que executa o quiz
import Loader from '../../components/common/Loader'; // Importe seu Loader
import "./style.css";

// Estilos básicos (opcional)
const pageStyle = { /* ... estilos ... */ };
const errorStyle = { /* ... estilos ... */ };
const buttonStyle = { /* ... estilos ... */ };

export default function Jogo() {
    // Hooks para ler o state da navegação
    const location = useLocation();
    const navigate = useNavigate();
    
    // Estados para guardar o quiz, erro e loading
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Jogo.js: Location state recebido:", location.state);

        // Tenta ler o 'quizSelecionado' que veio do GameContent.js
        const quizDoState = location.state?.quizSelecionado;

        if (quizDoState && quizDoState.perguntas && quizDoState.perguntas.length > 0) {
            console.log("Jogo.js: Quiz válido encontrado no state. Passando para GameQuiz:", quizDoState);
            setQuiz(quizDoState); // Guarda o quiz no estado
            setError(null);
        } else {
            console.error("Jogo.js: Erro - Nenhum quiz válido encontrado no state da navegação.");
            setError("Não foi possível carregar o quiz. Por favor, volte e selecione novamente.");
            setQuiz(null);
        }
        
        setLoading(false); // Terminou de ler o state

    }, [location.state]); // Roda quando o state muda

    // --- Renderização Condicional ---

    if (loading) {
        return (
            <>
                <Header />
                <div style={pageStyle}><Loader /></div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div style={pageStyle}>
                    <div style={errorStyle}>
                        <h2>Erro</h2>
                        <p>{error}</p>
                        <button style={buttonStyle} onClick={() => navigate('/')}>
                            Voltar
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (quiz) {
        // --- CORREÇÃO PRINCIPAL ---
        // Passa o objeto 'quiz' (que veio do state) como prop para GameQuiz
        return (
            <>
                <Header />
                <GameQuiz quizData={quiz} /> {/* Nome da prop: quizData */}
            </>
        );
        // --- FIM DA CORREÇÃO ---
    }

    // Fallback
    return (
        <>
            <Header />
            <div style={pageStyle}>
                <p>Nenhum quiz para jogar.</p>
                <button style={buttonStyle} onClick={() => navigate('/')}>
                    Voltar
                </button>
            </div>
        </>
    );
}