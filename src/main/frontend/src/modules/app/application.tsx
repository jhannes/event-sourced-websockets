import React, { useState } from "react";
import {
  IncidentSummaryDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { v4 as uuidv4 } from "uuid";
import { useWebSocket } from "../../hooks/useWebSocket";
import { NewIncidentForm } from "../incidents/newIncidentForm";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSummaryDto[]>([]);

  function handleMessage(message: MessageFromServerDto) {
    setIncidents(message.summaries);
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

      <NewIncidentForm sendMessage={sendMessage} />
    </>
  );
}
