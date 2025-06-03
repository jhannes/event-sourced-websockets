import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { Incident } from "../incidents/incident";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    setWebsocket(ws);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (Array.isArray(message)) {
        setIncidents(message);
      } else {
        setIncidents((old) => [...old, message]);
      }
    };
  }, []);

  function handleNewIncident(incident: Incident) {
    websocket?.send(JSON.stringify(incident));
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <li>{i.summary}</li>
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
