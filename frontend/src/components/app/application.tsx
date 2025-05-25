import React, { useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentRow } from "../incidents/incidentRow";
import { v4 as uuidv4 } from "uuid";
import {
  IncidentCommand,
  IncidentInfo,
  MessageFromServer,
  MessageToServer,
} from "../../../../shared/incidents";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useIncidents } from "../../hooks/useIncidents";

export function Application() {
  const { incidents, handleMessageFromServer } = useIncidents();

  const { sendMessage } = useWebSocket<MessageToServer, MessageFromServer>(
    "/ws/incidents",
    handleMessageFromServer,
  );

  function sendCommand(command: Pick<IncidentCommand, "incidentId" | "delta">) {
    sendMessage({ id: uuidv4(), clientTime: new Date(), ...command });
  }

  return (
    <div>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((i, index) => (
          <li key={index}>
            <IncidentRow incident={i} sendCommand={sendCommand} />
          </li>
        ))}
      </ul>

      <NewIncident sendCommand={sendCommand} />
    </div>
  );
}

function NewIncident({
  sendCommand,
}: {
  sendCommand: (command: Pick<IncidentCommand, "incidentId" | "delta">) => void;
}) {
  const [incidentId, setIncidentId] = useState(uuidv4());
  function handleNewIncident(info: IncidentInfo) {
    sendCommand({ incidentId, delta: { delta: "CreateIncidentDelta", info } });
    setIncidentId(uuidv4());
  }

  return (
    <>
      <h2>New incident</h2>
      <NewIncidentForm key={incidentId} onNewIncident={handleNewIncident} />
    </>
  );
}
