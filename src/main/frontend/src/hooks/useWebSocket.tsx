import { useCallback, useEffect, useRef } from "react";

export function useWebSocket<OUTPUT, INPUT>(params: {
  url: string;
  onMessage: (message: OUTPUT) => void;
}) {
  const websocketRef = useRef<WebSocket | null>(null);
  const connect = useCallback(() => {
    const ws = new WebSocket(params.url);
    ws.onmessage = ({ data }) => {
      params.onMessage(JSON.parse(data) as OUTPUT);
    };
    ws.onopen = () => {
      websocketRef.current = ws;
    };
  }, []);
  useEffect(() => {
    connect();
  }, []);

  function sendMessage(message: INPUT) {
    websocketRef.current?.send(JSON.stringify(message));
  }

  return { sendMessage };
}
