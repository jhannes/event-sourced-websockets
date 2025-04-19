import React, { useCallback, useEffect, useState } from "react";
import {
  IncidentSummaryDto,
  MessageFromServerDto,
} from "../../../../../../target/generated-sources/openapi-typescript";

function useWebSocket<OUTPUT>(params: {
  url: string;
  onMessage: (message: OUTPUT) => void;
}) {
  const connect = useCallback(() => {
    const ws = new WebSocket(params.url);
    ws.onmessage = ({ data }) => {
      params.onMessage(JSON.parse(data) as OUTPUT);
    };
  }, []);
  useEffect(() => {
    connect();
  }, []);
}

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSummaryDto[]>([]);

  function handleMessage(message: MessageFromServerDto) {
    setIncidents(message.summaries);
  }

  useWebSocket({ url: "/ws/incidents", onMessage: handleMessage });

  return (
    <>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((m) => (
          <li key={m.id}>{m.description}</li>
        ))}
      </ul>
    </>
  );
}
