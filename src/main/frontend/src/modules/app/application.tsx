import React, { useState } from "react";
import {
  IncidentSummaryDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { useWebSocket } from "../../hooks/useWebSocket";
import { NewIncidentForm } from "../incidents/newIncidentForm";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSummaryDto[]>([]);

  function handleMessage(message: MessageFromServerDto) {
    if ("summaries" in message) {
      setIncidents(message.summaries);
    } else if ("delta" in message) {
      const {
        incidentId: id,
        delta: { description },
      } = message;
      setIncidents((old) => [...old, { id, description }]);
    } else {
      const unexpected: never = message;
      console.log("Should never happen: ", unexpected);
    }
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
