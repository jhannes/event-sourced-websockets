import { useEffect, useState } from "react";
import { MessageFromServer, MessageToServer } from "../../../shared/incidents";

export function useWebSocket(
  url: string,
  handleMessageFromServer: (messageFromServer: MessageFromServer) => void,
) {
  const [websocket, setWebsocket] = useState<WebSocket>();

  useEffect(() => {
    const websocket = new WebSocket(url);
    websocket.onmessage = (event) => {
      handleMessageFromServer(JSON.parse(event.data));
    };
    setWebsocket(websocket);
  }, []);

  function sendMessage(messageToServer: MessageToServer) {
    websocket?.send(JSON.stringify(messageToServer));
  }

  return { sendMessage };
}
