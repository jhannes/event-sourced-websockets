import { MessageFromServer, MessageToServer } from "../../../shared/incidents";
import { useEffect, useState } from "react";

export function useWebSocket(
  handleMessage: (message: MessageFromServer) => void,
  url: string,
) {
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      handleMessage(JSON.parse(event.data));
    };
    setWebsocket(ws);
  }, []);

  function sendMessage(message: MessageToServer) {
    websocket?.send(JSON.stringify(message));
  }

  return { sendMessage };
}
