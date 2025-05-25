import React, { useEffect, useState } from "react";
import { Incident, NewIncidentForm } from "../incidents/newIncidentForm";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  useEffect(() => {
    const webSocket = new WebSocket("/ws/incidents");
    webSocket.onmessage = (event) => {
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
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </div>
  );
}
