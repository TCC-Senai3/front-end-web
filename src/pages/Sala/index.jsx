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

    if (participanteId === user.id) {
      setUsuarioSelecionado(null); // Desseleciona se já estiver selecionado
      return;
    }

    // Se já estiver selecionado, desseleciona. Senão, seleciona.
    if (usuarioSelecionado && usuarioSelecionado.id === participanteId) {
      setUsuarioSelecionado(null);
    } else {
      const userToSelect = usuarios.find((u) => u.id === participanteId);
      setUsuarioSelecionado(userToSelect || null);
    }
  };

  // Efeito para fechar o pop-up ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Checa se o clique foi fora do contêiner principal da sala.
      if (
        salaContainerRef.current &&
        !salaContainerRef.current.contains(event.target)
      ) {
        setUsuarioSelecionado(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- FUNÇÃO ATUALIZADA (com remoção local para o dono) ---
  const handleExpulsar = async () => {
    if (!salaInfo || !usuarioSelecionado || actionLoading || !isDonoDaSala)
      return;

    const nomeExpulso = usuarioSelecionado.nome || "este usuário";
    if (
      !window.confirm(`Tem certeza que deseja expulsar ${nomeExpulso} da sala?`)
    )
      return;

    setActionLoading(true);
    const idUsuarioExpulso = usuarioSelecionado.id;

    try {
      await salaService.expulsarUsuario(codigo, idUsuarioExpulso);

      // ✅ Remove o usuário da lista local do dono
      setUsuarios((prev) => prev.filter((u) => u.id !== idUsuarioExpulso)); 

      setUsuarioSelecionado(null); // Fecha o pop-up
    } catch (err) {
      console.error(
        "Erro ao expulsar usuário:",
        err.response?.data || err.message
      );
      setErrorMsg("Falha ao expulsar usuário. Apenas o dono pode fazer isso.");
    } finally {
      setActionLoading(false);
    }
  };
// ... O RESTO DO CÓDIGO PERMANECE O MESMO ...
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
      console.error("Erro ao carregar dados iniciais:", err);
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
                .catch((err) =>
                  console.error("Erro ao atualizar avatar via API:", err)
                );
            } else if (payload.type === "USUARIO_SAIU") {
              setUsuarios((prev) =>
                prev.filter((u) => u.id !== payload.idUsuario)
              );
              // Fechar o pop-up se o usuário que saiu/foi expulso era o selecionado
              // Nota: O estado `usuarioSelecionado` é atualizado fora deste closure
              // Para garantir que o pop-up feche, você pode refinar o uso do estado
              // ou confiar na atualização do estado no `handleExpulsar` para o dono.
              // Para não-donos, a lista de usuários será atualizada.
              // if (usuarioSelecionado?.id === payload.idUsuario)
              //   setUsuarioSelecionado(null);
            
            // ✅ NOVO TRATAMENTO: Fechamento da Sala
            } else if (payload.type === "SALA_FECHADA") {
                console.log(`Sala ${payload.codigoSala} foi fechada. Redirecionando.`);
                navigate("/game", { replace: true });
            }

          } catch (e) {
            console.error("Erro no WebSocket público:", e);
          }
        });


        const privateTopic = `/user/queue/expulso`;
        client.subscribe(privateTopic, (message) => {
            if (!isMountedRef.current) return;
            try {
                const payload = JSON.parse(message.body);
            
                
                if (payload.type === "EXPULSO") {
                    console.warn("Notificação privada recebida: Você foi expulso! Redirecionando...");
                    
                    // ESTA LINHA DEVE REDIRECIONAR O USUÁRIO EXPULSO
                    navigate("/game", { replace: true });
                }
            } catch (e) {
                console.error("Erro no WebSocket privado:", e);
            }
        });
        

      },
      onStompError: (frame) =>
        console.error("Erro STOMP:", frame.headers["message"]),
      onWebSocketError: (err) => console.error("Erro WebSocket:", err),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      isMountedRef.current = false;
      if (stompClientRef.current?.active) stompClientRef.current.deactivate();
      setIsConnected(false);
    };
    // ✅ Ajuste: 'usuarioSelecionado' foi removido das dependências para evitar problemas de closure/reconexão.
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
      console.error("Erro ao iniciar:", err);
      setErrorMsg("Falha ao enviar comando de iniciar jogo.");
    } finally {
      setActionLoading(false);
    }
  };

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
        navigate("/game");
      }
    } catch (err) {
      setErrorMsg("Erro ao sair/desmanchar. Tente novamente.");
      console.error("Erro handleDesmanchar:", err.response?.data || err.message);
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

                return (
                  
                  <div
                    key={participante.id}
                    className={`sala-user ${isSelected ? "selected-user" : ""}`}
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

                    {isDonoDaSala &&
                      isSelected &&
                      participante.id !== user.id && (
                        <div className="expulsar-overlay">
                          <button
                            className="btn btn-danger btn-expulsar"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpulsar();
                            }}
                            disabled={actionLoading}
                          >
                               Expulsar
                          </button>
                        </div>
                      )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}