import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IncidentSummaryDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { v4 as uuidv4 } from "uuid";

function useWebSocket<OUTPUT, INPUT>(params: {
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

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSummaryDto[]>([]);

  const [description, setDescription] = useState("");

  function handleMessage(message: MessageFromServerDto) {
    setIncidents(message.summaries);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    sendMessage({
      clientTime: new Date(),
      incidentId: uuidv4(),
      delta: { description },
    });
  }

  const { sendMessage } = useWebSocket<
    MessageFromServerDto,
    MessageToServerDto
  >({
    url: "/ws/incidents",
    onMessage: handleMessage,
  });

  return (
    <>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((m) => (
          <li key={m.id}>{m.description}</li>
        ))}
      </ul>
      <h2>New incident</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Description: </strong>{" "}
            <input
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </>
  );
}
