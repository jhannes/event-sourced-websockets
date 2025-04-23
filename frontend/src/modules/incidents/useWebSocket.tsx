import {
  MessageFromServer,
  MessageToServer,
  schema,
} from "../../../../shared/incidents";
import { useEffect, useState } from "react";

export function useWebSocket(props: {
  url: string;
  onMessage: (message: MessageFromServer) => void;
  onConnect?: () => MessageToServer;
}) {
  const [ws, setWs] = useState<WebSocket>();

  function sendMessage(message: MessageToServer) {
    ws?.send(JSON.stringify(message));
  }

  useEffect(() => {
    const ws = new WebSocket(props.url);
    ws.onopen = () => {
      if (props.onConnect) ws.send(JSON.stringify(props.onConnect()));
    };
    ws.onmessage = (event) => {
      const message = schema.MessageFromServer.parse(JSON.parse(event.data));
      props.onMessage(message);
    };
    setWs(ws);
  }, [props.url]);

  return { sendMessage };
}
