import React, { useState, useEffect, useRef } from "react"; // Adicionado useRef
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import salaService from "../../services/salaService";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import SockJS from "sockjs-client"; // <<< Adicionado import SockJS
import { Client } from "@stomp/stompjs"; // <<< Adicionado import Cliente STOMP
import "./style.css";

export default function Sala() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega usuário logado

  const codigo = location.state?.codigo || null;
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [salaInfo, setSalaInfo] = useState(null);
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const stompClientRef = useRef(null); // Ref para o cliente STOMP

  // <<< NOVO ESTADO para rastrear a conexão real >>>
  const [isConnected, setIsConnected] = useState(false); // --- Efeito para Conexão WebSocket ---

  useEffect(() => {
    // Só conecta se tivermos código E se o usuário já estiver carregado
    if (!codigo || !user?.id) {
      // Se desconectar enquanto estiver na sala (ex: logout), limpa o estado
      setIsConnected(false);
      console.log("WebSocket: Aguardando código da sala e usuário...");
      return; // Sai se não tiver código ou usuário ainda
    }

    const socketUrl = "http://localhost:8080/ws";
    console.log("Sala.js: Configurando conexão WebSocket...");
    setIsConnected(false); // Garante que começa como desconectado a cada tentativa

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // debug: (str) => { console.log('STOMP:', str); }, // Descomente para debug
      onConnect: (frame) => {
        console.log("WebSocket Conectado via STOMP:", frame);
        // <<< ATUALIZA O ESTADO isConnected PARA true >>>
        setIsConnected(true);
        setErrorMsg(""); // Limpa erros de conexão anteriores se conectar com sucesso

        const topic = `/topic/sala/${codigo}`;
        console.log(`Inscrevendo-se em ${topic}`);
        client.subscribe(topic, (message) => {
          try {
            const payload = JSON.parse(message.body);
            console.log(`Mensagem recebida em ${topic}:`, payload);

            if (payload.type === "JOGO_INICIADO") {
              console.log("Mensagem de início de jogo recebida! Navegando...");
              const { idFormulario, idSala, codigoSala } = payload;
              navigate("/jogo", {
                state: { idFormulario, idSala, codigoSala },
              });
            }
          } catch (e) {
            console.error(
              "Erro ao processar mensagem WebSocket:",
              e,
              message.body
            );
          }
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame.headers["message"], frame.body);
        setErrorMsg("Erro de comunicação com o servidor.");
        // <<< ATUALIZA O ESTADO isConnected PARA false >>>
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("Erro WebSocket:", error);
        if (error?.message?.includes("403")) {
          setErrorMsg(
            "Falha ao conectar (403). Verifique permissões do backend para /ws."
          );
        } else {
          setErrorMsg("Erro de conexão WebSocket. Tentando reconectar..."); // Mensagem pode indicar reconexão
        }
        // <<< ATUALIZA O ESTADO isConnected PARA false >>>
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log("WebSocket Desconectado");
        // <<< ATUALIZA O ESTADO isConnected PARA false >>>
        setIsConnected(false);
      },
    });

    console.log("Ativando cliente WebSocket...");
    client.activate();
    stompClientRef.current = client; // --- Função de Limpeza ---

    return () => {
      console.log("Sala.js: Limpeza - Desativando cliente WebSocket...");
      setIsConnected(false); // Garante que fica false ao sair/desmontar
      if (stompClientRef.current && stompClientRef.current.active) {
        stompClientRef.current.deactivate();
        console.log("Cliente WebSocket desativado.");
      }
    };
    // Dependências: Reconecta se código ou ID do usuário mudar.
  }, [codigo, user?.id, navigate]); // --- useEffect do Polling (Mantido) ---

  useEffect(() => {
    /* ... sua lógica de polling ... */
  }, [codigo, navigate, user?.id, loading, usuarios]); // --- Handler Desmanchar/Sair (Mantido) ---

  const handleDesmanchar = async () => {
    /* ... sua lógica ... */
  }; // --- Handler Iniciar (Usa isConnected e verifica .connected) ---

  const handleIniciar = async () => {
    // <<< USA isConnected NA VERIFICAÇÃO INICIAL >>>
    if (!salaInfo || !isDonoDaSala || actionLoading || !isConnected) {
      const motivoErro = !isConnected
        ? "Não conectado ao servidor."
        : "Faltam dados ou não é o dono.";
      console.error("Não pode iniciar o jogo:", motivoErro);
      setErrorMsg(`Não é possível iniciar. ${motivoErro}`);
      return;
    }

    setActionLoading(true);
    setErrorMsg("");

    try {
      const destination = `/app/sala/${codigo}/iniciar`;
      console.log(`Sala.js: Publicando mensagem 'iniciar' para ${destination}`);

      // <<< VERIFICAÇÃO EXTRA antes de publicar >>>
      // Usa a propriedade 'connected' do cliente STOMP que indica se a conexão STOMP está estabelecida
      if (!stompClientRef.current?.connected) {
        console.error("Tentativa de publicar sem conexão STOMP estabelecida.");
        throw new Error("Não conectado ao STOMP. Aguarde a conexão."); // Lança erro
      } // Envia a mensagem

      stompClientRef.current.publish({ destination: destination }); // A navegação acontece no 'subscribe'
    } catch (error) {
      console.error("Erro ao publicar mensagem 'iniciar':", error);
      // Mostra a mensagem de erro específica ou uma genérica
      setErrorMsg(
        error.message || "Falha ao enviar comando de início. Tente novamente."
      );
      setActionLoading(false);
    }
  }; // --- Renderização ---

  return (
    <>
            <Header />     {" "}
      <div className="sala-container">
               {" "}
        <div className="sala-content">
                    <div className="sala-codigo">CODE: {codigo || "ERRO"}</div> 
                 {" "}
          {errorMsg && <div className="sala-mensagem error">{errorMsg}</div>}   
               {" "}
          <div className="sala-actions">
                       {" "}
            <button
              className="btn btn-danger"
              onClick={handleDesmanchar}
              disabled={loading || actionLoading}
            >
                           {" "}
              {isDonoDaSala ? "DESMANCHAR\nSALA" : "SAIR DA\nSALA"}           {" "}
            </button>
                       {" "}
            {isDonoDaSala && (
              <button
                className="btn btn-warning"
                onClick={handleIniciar}
                disabled={
                  // <<< USA isConnected NO disabled >>>
                  loading ||
                  actionLoading ||
                  !isConnected || // Desabilita se não estiver conectado via STOMP
                  usuarios.length < 1
                }
              >
                                INICIAR              {" "}
              </button>
            )}
                     {" "}
          </div>
                   {" "}
          <div className="sala-grid">
                       {" "}
            {loading ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : usuarios.length === 0 ? (
              <div className="sala-mensagem">Aguardando jogadores...</div>
            ) : (
              usuarios.map((participante) => (
                <div key={participante.id} className="sala-user">
                                     {" "}
                  <div
                    className="sala-avatar"
                    style={{
                      backgroundImage: participante.avatar
                        ? `url(${participante.avatar})`
                        : undefined,
                    }}
                  />
                                     {" "}
                  <div
                    className="nome"
                    style={{
                      fontWeight:
                        user && participante.id === user.id ? "bold" : "normal",
                    }}
                  >
                                         {" "}
                    {participante.nome || "Nome não encontrado"}               
                       {" "}
                  </div>
                                   {" "}
                </div>
              ))
            )}
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </>
  );
}
