import { useCallback, useEffect, useRef, useState } from "react";

export function useWebSocket<OUTPUT, INPUT>(params: {
  url: string;
  onMessage: (message: OUTPUT) => void;
  onConnect?: () => void;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const connect = useCallback(() => {
    const ws = new WebSocket(params.url);
    ws.onmessage = ({ data }) => {
      params.onMessage(JSON.parse(data) as OUTPUT);
    };
    ws.onopen = () => {
      setIsConnected(true);
      websocketRef.current = ws;
      params.onConnect?.();
    };
    ws.onclose = () => {
      websocketRef.current = null;
      setTimeout(() => {
        setIsConnected(false);
        connect();
      }, 3000);
    };
  }, []);
  useEffect(() => {
    connect();
  }, []);

  function sendMessage(message: INPUT) {
    websocketRef.current?.send(JSON.stringify(message));
  }

  return { sendMessage, isConnected };
}
