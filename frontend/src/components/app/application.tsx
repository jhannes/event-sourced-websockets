import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentRow } from "../incidents/incidentRow";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Incident, MessageFromServer } from "../../../../shared/incidents";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  function handleMessageFromServer(messageFromServer: MessageFromServer) {
    if (Array.isArray(messageFromServer)) {
      setIncidents(messageFromServer);
    } else {
      setIncidents((old) => [...old, messageFromServer]);
    }
  }

  const { sendMessage } = useWebSocket(
    "/ws/incidents",
    handleMessageFromServer,
  );

  function handleNewIncident(incident: Incident) {
    sendMessage(incident);
  }

  return (
    <div>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((i, index) => (
          <li key={index}>
            <IncidentRow incident={i} />
          </li>
        ))}
      </ul>

      <h2>New incident</h2>
      <NewIncident onNewIncident={handleNewIncident} />
    </div>
  );
}

function NewIncident({
  onNewIncident,
}: {
  onNewIncident: (incident: Incident) => void;
}) {
  const [incidentId, setIncidentId] = useState(uuidv4());

  function handleSubmit(incident: Incident) {
    onNewIncident(incident);
    setIncidentId(uuidv4());
  }

  return <NewIncidentForm key={incidentId} onSubmit={handleSubmit} />;
}
