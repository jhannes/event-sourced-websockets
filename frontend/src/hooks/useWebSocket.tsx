import { useEffect, useState } from "react";

export function useWebSocket<TO_SERVER, FROM_SERVER>(
  url: string,
  onMessage: (message: FROM_SERVER) => void,
) {
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const webSocket = new WebSocket(url);
    webSocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
      onMessage(messageFromServer);
    };
    setWebsocket(webSocket);
  }, []);

  function sendMessage(messageToServer: TO_SERVER) {
    websocket?.send(JSON.stringify(messageToServer));
  }

  return { sendMessage };
}
