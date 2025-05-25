import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { Incident } from "../../incidents";
import { IncidentRow } from "../incidents/incidentRow";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const websocket = new WebSocket("/ws/incidents");
    websocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
      if (Array.isArray(messageFromServer)) {
        setIncidents(messageFromServer);
      } else {
        setIncidents((old) => [...old, messageFromServer]);
      }
    };
    setWebsocket(websocket);
  }, []);

  function handleNewIncident(incident: Incident) {
    websocket?.send(JSON.stringify(incident));
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
