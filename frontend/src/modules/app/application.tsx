import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { Incident } from "../../../../shared/incidents";
import { IncidentRow } from "../incidents/incidentRow";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (Array.isArray(message)) {
        setIncidents(message);
      } else {
        setIncidents((old) => [...old, message]);
      }
    };
    setWebsocket(ws);
  }, []);

  function handleNewIncident(incident: Incident) {
    websocket?.send(JSON.stringify(incident));
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <IncidentRow incident={i} />
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
