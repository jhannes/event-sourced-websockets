import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentRow } from "../incidents/incidentRow";
import { useWebSocket } from "../../hooks/useWebSocket";
import {
  Incident,
  IncidentCommand,
  IncidentSummary,
  MessageFromServer,
} from "../../../../shared/incidents";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  function handleMessageFromServer(messageFromServer: MessageFromServer) {
    if (Array.isArray(messageFromServer)) {
      setIncidents(messageFromServer);
    } else if ("delta" in messageFromServer) {
      const { delta, incidentId } = messageFromServer;
      if (delta.type === "CreateIncident") {
        const { info } = delta;
        setIncidents((old) => [...old, { incidentId, info }]);
      } else if (delta.type === "UpdateIncident") {
        const { info } = delta;
        setIncidents((old) =>
          old.map((o) =>
            o.incidentId === incidentId
              ? { ...o, info: { ...o.info, ...info } }
              : o,
          ),
        );
      } else {
        const message: never = delta;
        console.log("Unexpected message", { message });
      }
    }
  }

  const { sendMessage } = useWebSocket(
    "/ws/incidents",
    handleMessageFromServer,
  );

  function sendCommand(command: Pick<IncidentCommand, "incidentId" | "delta">) {
    sendMessage({ clientTime: new Date(), eventId: uuidv4(), ...command });
  }

  return (
    <div>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((i) => (
          <li key={i.incidentId}>
            <IncidentRow incident={i} sendCommand={sendCommand} />
          </li>
        ))}
      </ul>

      <h2>New incident</h2>
      <NewIncident sendCommand={sendCommand} />
    </div>
  );
}

function NewIncident({
  sendCommand,
}: {
  sendCommand: (command: Pick<IncidentCommand, "delta" | "incidentId">) => void;
}) {
  const [incidentId, setIncidentId] = useState(uuidv4());

  function handleSubmit(info: Incident) {
    sendCommand({ incidentId, delta: { type: "CreateIncident", info } });
    setIncidentId(uuidv4());
  }

  return <NewIncidentForm key={incidentId} onSubmit={handleSubmit} />;
}
