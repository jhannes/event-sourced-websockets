import * as React from "react";
import { useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import {
  Incident,
  IncidentDelta,
  IncidentPriorityEnum,
  IncidentSnapshot,
} from "../../../../shared/incidents";
import { IncidentRow } from "../incidents/incidentRow";
import { v4 as uuidv4 } from "uuid";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useIncidents } from "../incidents/useIncidents";

function sortByUpdatedAt(a: IncidentSnapshot, b: IncidentSnapshot) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export function Application() {
  const [incidentId, setIncidentId] = useState(uuidv4());

  const { handleMessage, incidents } = useIncidents();

  const { sendMessage } = useWebSocket(handleMessage, "/ws/incidents");

  function sendCommand(incidentId: string, delta: IncidentDelta) {
    const clientTime = new Date();
    const eventId = uuidv4();
    sendMessage({ eventId, clientTime, incidentId, delta });
  }

  function handleNewIncident(info: Incident) {
    sendCommand(incidentId, { type: "CreateIncident", info });
    setIncidentId(uuidv4());
  }

  function handleChangePriority(
    incidentId: string,
    priority: IncidentPriorityEnum,
  ) {
    sendCommand(incidentId, { type: "UpdateIncident", info: { priority } });
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.toSorted(sortByUpdatedAt).map((i) => (
        <IncidentRow
          key={i.incidentId}
          incident={i}
          onChangePriority={handleChangePriority}
        />
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm key={incidentId} onNewIncident={handleNewIncident} />
    </>
  );
}
