import { useEffect, useState } from "react";

export function useWebSocket(
  url: string,
  handleMessageFromServer: (messageFromServer: any) => void,
) {
  const [websocket, setWebsocket] = useState<WebSocket>();

  useEffect(() => {
    const websocket = new WebSocket(url);
    websocket.onmessage = (event) => {
      handleMessageFromServer(JSON.parse(event.data));
    };
    setWebsocket(websocket);
  }, []);

  function sendMessage(messageToServer: object) {
    websocket?.send(JSON.stringify(messageToServer));
  }

  return { sendMessage };
}
