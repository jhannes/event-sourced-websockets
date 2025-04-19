import React, { useCallback, useEffect, useState } from "react";

export function Application() {
  const [messages, setMessages] = useState<string[]>(["first message"]);

  const connect = useCallback(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = ({ data }) => {
      setMessages((old) => [...old, data]);
    };
  }, []);
  useEffect(() => {
    connect();
  }, []);

  return (
    <>
      <h1>Hello websocket component</h1>
      <ul>
        {messages.map((m, index) => (
          <li key={index}>{m}</li>
        ))}
      </ul>
    </>
  );
}
