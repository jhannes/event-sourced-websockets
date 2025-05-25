import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { Incident } from "../../incidents";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  useEffect(() => {
    const websocket = new WebSocket("/ws/incidents");
    websocket.onmessage = (event) => {
      setIncidents(JSON.parse(event.data));
    };
  }, []);

  function handleNewIncident(incident: Incident) {
    setIncidents((old) => [...old, incident]);
  }

  return (
    <div>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((i, index) => (
          <li key={index}>{i.title}</li>
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
