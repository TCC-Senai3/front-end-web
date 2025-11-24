import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import salaService from "../../services/salaService";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./style.css"; 

// --- 1. IMPORTAÇÃO DAS IMAGENS ---
import userProfileImage from "../../assets/images/user-profile1.png";
import bodeIcon from "../../assets/images/bode.svg";
import canetaIcon from "../../assets/images/Canetabic.svg";
import patoIcon from "../../assets/images/Pato.svg";

export default function Sala() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const codigo = location.state?.codigo || null;
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [salaInfo, setSalaInfo] = useState(null);
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const isMountedRef = useRef(true);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const userCardRefs = useRef({}); 

  // Referência para o contêiner principal da sala para fechar o pop-up ao clicar fora
  const salaContainerRef = useRef(null);

  // --- 2. MAPA DE AVATARES ---
  const avatarMap = {
    "bode.svg": bodeIcon,
    bode: bodeIcon,
    "Canetabic.svg": canetaIcon,
    caneta: canetaIcon,
    "Pato.svg": patoIcon,
    pato: patoIcon,
  };

  const getAvatarSrc = (avatarString) => {
    if (!avatarString) return userProfileImage;
    const cleanName = avatarString.trim();
    if (cleanName.startsWith("data:") || cleanName.startsWith("http")) {
      return cleanName;
    }
    return avatarMap[cleanName] || userProfileImage;
  };

  const handleUserClick = (participanteId) => {
    if (!isDonoDaSala) return;
    
    // Se clicar em si mesmo, deseleciona e sai
    if (participanteId === user.id) {
      setUsuarioSelecionado(null);
      return;
    }

    const userToSelect = usuarios.find((u) => u.id === participanteId);

    if (userToSelect) {
      // CORREÇÃO: Seleciona o usuário e abre o modal em um único clique
      setUsuarioSelecionado(userToSelect);
      setShowConfirmModal(true);
    } else {
        setUsuarioSelecionado(null);
        setShowConfirmModal(false);
    }
  };

  // Efeito para fechar o pop-up ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Checa se o clique foi fora do contêiner principal da sala e fora do modal (se estiver aberto).
      if (
        salaContainerRef.current &&
        !salaContainerRef.current.contains(event.target) &&
        !event.target.closest('.confirm-modal-overlay') // Ignora cliques no overlay/modal
      ) {
        setUsuarioSelecionado(null);
        setShowConfirmModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- FUNÇÃO ATUALIZADA (com remoção local para o dono) ---
  const handleExpulsar = async () => {
    if (!salaInfo || !usuarioSelecionado || actionLoading || !isDonoDaSala)
      return;

    setShowConfirmModal(false);
    setActionLoading(true);
    const idUsuarioExpulso = usuarioSelecionado.id;

    try {
      await salaService.expulsarUsuario(codigo, idUsuarioExpulso);

      // Remove o usuário da lista local do dono
      setUsuarios((prev) => prev.filter((u) => u.id !== idUsuarioExpulso)); 

      setUsuarioSelecionado(null); // Fecha o pop-up
    } catch (err) {
      setErrorMsg("Falha ao expulsar usuário. Apenas o dono pode fazer isso.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelExpulsar = () => {
    setShowConfirmModal(false);
    setUsuarioSelecionado(null);
  };

  const carregarDadosIniciais = useCallback(async () => {
    if (!codigo || !user?.id) return;
    if (!isMountedRef.current) return;
    setLoading(true);

    try {
      const sala = await salaService.getSalaByPin(codigo);
      if (!isMountedRef.current || !sala) return;

      setSalaInfo(sala);
      setIsDonoDaSala(sala.idUsuario === user.id);

      const participantesIds = sala.participantes?.map(p => p.idUsuario) || sala.idParticipantes || [];
      
      if (participantesIds.length > 0) {
        const userPromises = participantesIds.map((id) =>
          userService.getUserById(id)
        );
        const results = await Promise.allSettled(userPromises);

        if (!isMountedRef.current) return;

        const validUsers = results
          .filter((r) => r.status === "fulfilled" && r.value?.id)
          .map((r) => r.value);
        setUsuarios(validUsers);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      if (isMountedRef.current)
        setErrorMsg("Falha ao carregar informações da sala.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [codigo, user?.id]);


  useEffect(() => {
    if (!codigo || !user?.id) return;

    isMountedRef.current = true;
    const socketUrl = "https://tccdrakes.azurewebsites.net/ws";

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      // ✅ ESSENCIAL: Configura o Principal Name para o canal privado /user/queue/...
      connectHeaders: {
          login: String(user.id),
      },
      
      onConnect: () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);

      
        const topic = `/topic/sala/${codigo}`;
        client.subscribe(topic, (message) => {
          if (!isMountedRef.current) return;
          try {
            const payload = JSON.parse(message.body);
            

            if (payload.type === "JOGO_INICIADO") {
              const { idFormulario, idSala, codigoSala } = payload;
              navigate("/jogo", {
                state: { idFormulario, idSala, codigoSala },
              });
            } else if (payload.type === "USUARIO_ENTROU") {
              const novoUsuario = payload.usuario;

              setUsuarios((prev) => {
                if (prev.find((u) => u.id === novoUsuario.id)) return prev;
                return [...prev, novoUsuario];
              });

              // Busca dados completos do usuário (ex: avatar) via API
              userService
                .getUserById(novoUsuario.id)
                .then((fullUser) => {
                  if (isMountedRef.current && fullUser) {
                    setUsuarios((prev) =>
                      prev.map((u) => (u.id === fullUser.id ? fullUser : u))
                    );
                  }
                })
                .catch(() => {});
            } else if (payload.type === "USUARIO_SAIU") {
                setUsuarios((prev) =>
                  prev.filter((u) => u.id !== payload.idUsuario)
                );
                setUsuarioSelecionado(null);
            } else if (payload.type === "SALA_FECHADA") {
                navigate("/game", { replace: true });
            }

          } catch (e) {
            // Erro silencioso no WebSocket
          }
        });


        const privateTopic = `/user/queue/expulso`;
        client.subscribe(privateTopic, (message) => {
            if (!isMountedRef.current) return;
            try {
                const payload = JSON.parse(message.body);
            
              
              if (payload.type === "EXPULSO") {
                  // O WebSocket está responsável por redirecionar.
                  navigate("/game", { replace: true });
              }
          } catch (e) {
              // Erro silencioso no WebSocket privado
          }
        });
        

      },
      onStompError: () => {},
      onWebSocketError: () => {},
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      isMountedRef.current = false;
      if (stompClientRef.current?.active) stompClientRef.current.deactivate();
      setIsConnected(false);
    };
    // As dependências estão corretas, incluindo 'navigate'
  }, [codigo, navigate, user?.id]);

  // Trigger Carga Inicial (Mantido)
  useEffect(() => {
    if (!codigo || !user?.id) {
      navigate("/game");
      return;
    }
    isMountedRef.current = true;
    carregarDadosIniciais();
    return () => {
      isMountedRef.current = false;
    };
  }, [codigo, user?.id, carregarDadosIniciais, navigate]);


// 🚀 NOVO: Efeito de Contingência para Expulsão/Saída
useEffect(() => {
    // Esta lógica monitora se o usuário logado desapareceu da lista de participantes.
    // Se ele desaparecer da lista (via mensagem USUARIO_SAIU) mas o redirecionamento 
    // privado do WebSocket (EXPULSO) falhou, nós forçamos a navegação.
    if (loading || !user || !salaInfo) return;

    const userIsStillInList = usuarios.some(p => p.id === user.id);

    // Se o usuário logado NÃO é o dono E NÃO está mais na lista, ele foi expulso/saiu.
    if (!isDonoDaSala && !userIsStillInList && !actionLoading) {
        // Navega de volta, garantindo que o cliente não fique preso na sala.
        navigate("/game", { replace: true });
    }
    
}, [usuarios, user, isDonoDaSala, loading, navigate, salaInfo, actionLoading]);


  // Actions (Mantidas)
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !isConnected) return;
    setActionLoading(true);
    try {
      const destination = `/app/sala/${codigo}/iniciar`;
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify({ idUsuario: user.id }),
      });
    } catch (err) {
      setErrorMsg("Falha ao enviar comando de iniciar jogo.");
    } finally {
      setActionLoading(false);
    }
  };

// ✅ CORREÇÃO APLICADA: Redirecionamento forçado no sucesso da API (para saída voluntária)
  const handleDesmanchar = async () => {
    if (!salaInfo || !user) return;
    if (!window.confirm(isDonoDaSala ? "Tem certeza que deseja desmanchar a sala e remover todos os participantes?" : "Tem certeza que deseja sair da sala?"))
      return;

    setActionLoading(true);
    try {
      if (isDonoDaSala) {
        await salaService.fecharSala(salaInfo.idSala);
        navigate("/game"); 
      }
      else {
        await salaService.sairDaSala(codigo, user.id);
        
        // Redireciona imediatamente, corrigindo o bug onde o WS falhava
        navigate("/game", { replace: true });
      }
    } catch (err) {
      setErrorMsg("Erro ao sair/desmanchar. Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  
  return (
    <>
      <Header />
      {/* Adiciona a referência para fechar o pop-up ao clicar fora */}
      <div className="sala-container" ref={salaContainerRef}>
        <div className="sala-content">
          <div className="sala-codigo">CODE: {codigo || "ERRO"}</div>
          {errorMsg && <div className="sala-mensagem error">❌ {errorMsg}</div>}

          <div className="sala-actions">
            <button
              className="btn btn-danger"
              onClick={handleDesmanchar}
              disabled={actionLoading || !salaInfo}
            >
              {isDonoDaSala ? "DESMANCHAR SALA" : "SAIR DA SALA"}
            </button>
            {isDonoDaSala && (
              <button
                className="btn btn-warning"
                onClick={handleIniciar}
                disabled={
                  loading ||
                  actionLoading ||
                  usuarios.length < 1 || 
                  !isConnected
                }
              >
                INICIAR
              </button>
            )}
          </div>

          <div className="sala-grid">
            {loading ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : usuarios.length === 0 ? (
              <div className="sala-mensagem">Aguardando jogadores...</div>
            ) : (
              usuarios.map((participante) => {
                const avatarSrc = getAvatarSrc(participante.avatar);
                const isSelected = usuarioSelecionado?.id === participante.id;
                const canBeExpelled = isDonoDaSala && participante.id !== user?.id;

                return (
                  
                  <div
                    key={participante.id}
                    className={`sala-user ${isSelected && canBeExpelled ? "selected-user" : ""}`}
                    onClick={() => handleUserClick(participante.id)}
                    ref={(el) => (userCardRefs.current[participante.id] = el)}
                  >
                    {/* Container do Avatar */}
                    <div className="sala-avatar">
                      <img
                        src={avatarSrc}
                        alt={participante.nome}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div
                      className="nome"
                      style={{
                        fontWeight:
                          user && participante.id === user.id
                            ? "bold"
                            : "normal",
                        marginTop: "8px",
                      }}
                    >
                      {participante.nome || "Jogador"}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Expulsão */}
      {showConfirmModal && usuarioSelecionado && (
        <div className="confirm-modal-overlay" onClick={handleCancelExpulsar}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-modal-title">Confirmar Expulsão</h3>
            <p className="confirm-modal-message">
              Tem certeza que deseja expulsar <strong>{usuarioSelecionado.nome || "este usuário"}</strong> da sala?
            </p>
            <div className="confirm-modal-buttons">
              <button
                className="confirm-btn confirm-btn-cancel"
                onClick={handleCancelExpulsar}
                disabled={actionLoading}
              >
                Cancelar
              </button>
              <button
                className="confirm-btn confirm-btn-confirm"
                onClick={handleExpulsar}
                disabled={actionLoading}
              >
                {actionLoading ? "Expulsando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}//,