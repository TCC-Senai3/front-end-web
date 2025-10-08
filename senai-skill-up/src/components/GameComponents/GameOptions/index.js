import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function GameOptions() {
    const navigate = useNavigate();

    const handlePlayRanked = () => {
        // Scroll para a seção de quiz ou apenas deixar o usuário escolher um quiz
        const gameContent = document.querySelector('.game-content-wrapper');
        if (gameContent) {
            gameContent.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleJoinPrivateRoom = () => {
        navigate('/pin'); // Vai para a página de entrar com PIN
    };

    const handleCreateRoom = () => {
        navigate('/criarsala'); // Vai para página de criar sala
    };

    return (
        <>
            <img src={require("../../../assets/images/Group 13.png")} alt="Background gráfico" className="game-background" />
            <div className="jogue-agora-container">
                <img src={require("../../../assets/images/slogan (1).svg").default} alt="Jogue Agora" className="jogue-agora-slogan" />
                <div className="opcoes-container">
                    <div className="opcao-card" style={{ backgroundColor: '#E5CFB7' }} onClick={handlePlayRanked}>
                        <h3>RANQUEADO</h3>
                        <p>Jogue contra outros <br/> jogadores em busca do topo <br/> do rank</p>
                        <img src={require("../../../assets/images/image 31.svg").default} alt="Ranqueado" className="card-img" />
                        <div className="btn-container">
                            <img src={require("../../../assets/images/Vector.svg").default} alt="Botão Ranqueado" className="card-btn" />
                            <span className="btn-text">PLAY</span>
                        </div>
                    </div>
                    <div className="opcao-card" style={{ backgroundColor: '#A4DCAB' }} onClick={handleJoinPrivateRoom}>
                        <h3>SALA PRIVADA</h3>
                        <p>Divirta-se com seus <br/> colegas de classe</p>
                        <img src={require("../../../assets/images/image 2.svg").default} alt="Sala Privada" className="card-img" />
                        <div className="btn-container">
                            <img src={require("../../../assets/images/Vector (1).svg").default} alt="Botão Sala Privada" className="card-btn" />
                            <span className="btn-text">ENTRAR</span>
                        </div>
                    </div>
                    <div className="opcao-card" style={{ backgroundColor: '#A3BFDD' }} onClick={handleCreateRoom}>
                        <h3>CRIAR SALA</h3>
                        <p>Crie uma sala para você e <br/> seus amigos</p>
                        <img src={require("../../../assets/images/add.svg").default} alt="Criar Sala" className="card-img" />
                        <div className="btn-container">
                            <img src={require("../../../assets/images/Vector (2).svg").default} alt="Botão Criar Sala" className="card-btn" />
                            <span className="btn-text">CRIAR</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
