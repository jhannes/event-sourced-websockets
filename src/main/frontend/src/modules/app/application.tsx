import React, { useState } from "react";
import {
  IncidentSummaryDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { useWebSocket } from "../../hooks/useWebSocket";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentItem } from "../incidents/incidentItem";
import { IncidentContext } from "../incidents/incidentContext";

function sortByTimestamp(a: IncidentSummaryDto, b: IncidentSummaryDto) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSummaryDto[]>([]);

  function handleMessage(message: MessageFromServerDto) {
    if ("summaries" in message) {
      setIncidents(message.summaries);
    } else if ("delta" in message) {
      const { incidentId: id, clientTime: updatedAt } = message;
      if (message.delta.delta === "CreateIncidentDelta") {
        const {
          delta: { info },
        } = message;
        setIncidents((old) => [
          ...old,
          { id, createdAt: updatedAt, updatedAt, info },
        ]);
      } else if (message.delta.delta === "UpdateIncidentDelta") {
        const {
          delta: { info },
        } = message;
        setIncidents((old) =>
          old.map((o) =>
            o.id === id ? { ...o, updatedAt, info: { ...o.info, ...info } } : o,
          ),
        );
      } else {
        const unexpected: never = message.delta;
        console.log("Should never happen: ", unexpected);
      }
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
    <IncidentContext value={{ sendMessage }}>
      <h1>Incidents</h1>
      <ul>
        {incidents.toSorted(sortByTimestamp).map((m) => (
          <IncidentItem key={m.id} incident={m} />
        ))}
      </ul>
      <h2>New incident</h2>

      <NewIncidentForm />
    </IncidentContext>
  );
}
