import { ReactElement, useEffect, useState } from "react";
import { MessageFromServerDto } from "../../../../../target/generated-sources/openapi-typescript";

export function ChatWebSocketContext({ children }: { children: ReactElement }) {
  const [webSocket, setWebSocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws");
    console.log("Connecting websocket");
    ws.onmessage = ({ data }) => {
      const messageFromServer = JSON.parse(data) as MessageFromServerDto;
      if ("conversations" in messageFromServer) {
        console.log(messageFromServer.conversations);
      }
    };
    setWebSocket(ws);
  }, []);

  return children;
}