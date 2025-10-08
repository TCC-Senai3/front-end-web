import React from "react";
import SearchIcon from "../../../assets/images/search 1.svg";
import image31 from "../../../assets/images/image 31.svg";
import "./style.css";

export default function ProfileRanking({ ranking = [] }) {
    const rankingMock = [
        { id: '1', nome: 'Usuario123', pontos: 950 },
        { id: '2', nome: 'Maria', pontos: 600 },
        { id: '3', nome: 'João', pontos: 500 },
    ];

    return (
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
    );
}
