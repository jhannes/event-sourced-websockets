import { useEffect, useMemo, useState } from "react";

export function useWebSocket<TO_SERVER, FROM_SERVER>(
  url: string,
  onMessage: (message: FROM_SERVER) => void,
) {
  const [websocket, setWebsocket] = useState<WebSocket>();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const webSocket = new WebSocket(url);
    webSocket.onopen = () => setConnected(true);
    webSocket.onclose = () => setConnected(false);
    webSocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
      onMessage(messageFromServer);
    };
    setWebsocket(webSocket);
  }, []);

  function sendMessageInternal(messageToServer: TO_SERVER) {
    websocket?.send(JSON.stringify(messageToServer));
  }
  const sendMessage = useMemo(
    () => (connected ? sendMessageInternal : () => {}),
    [connected],
  );

  return { sendMessage };
}
