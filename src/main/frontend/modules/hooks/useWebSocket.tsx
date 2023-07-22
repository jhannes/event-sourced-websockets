import { useEffect, useState } from "react";

export type ConnectionState = {
  connected: boolean;
  disconnectedSince?: Date;
  reconnectAttempts?: number;
};

export function useWebSocket<T>(
  onMessage: (event: T) => void,
  path: string
): { sendMessage: (json: object) => void; connectionState: ConnectionState } {
  const [webSocket, setWebSocket] = useState<WebSocket>();
  const [connected, setConnected] = useState(false);
  const [disconnectedSince, setDisconnectedSince] = useState<Date>();
  const [reconnectAttempts, setReconnectAttempts] = useState<number>();

  function handleMessage(event: MessageEvent) {
    setReconnectAttempts(undefined);
    setConnected(true);
    setReconnectAttempts(undefined);
    setDisconnectedSince(undefined);
    onMessage(JSON.parse(event.data) as T);
  }

  function sendMessage(command: object) {
    webSocket?.send(JSON.stringify(command));
  }

  useEffect(() => {
    connect();
    return () => webSocket?.close();
  }, []);

  function connect() {
    webSocket?.close();
    setConnected(false);
    setReconnectAttempts((old) => (old || 0) + 1);

    const proto = window.location.protocol === "http:" ? "ws://" : "wss://";
    const ws = new WebSocket(proto + window.location.host + path);
    ws.onclose = () => {
      setDisconnectedSince((old) => old || new Date());
      setConnected((connected) => {
        setTimeout(connect, connected ? 100 : 10000);
        return false;
      });
    };
    ws.onmessage = handleMessage;
    setWebSocket(ws);
  }

  return {
    connectionState: { connected, reconnectAttempts, disconnectedSince },
    sendMessage,
  };
}
