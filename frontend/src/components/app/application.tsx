import React, { useEffect, useState } from "react";
import { Incident, NewIncidentForm } from "../incidents/newIncidentForm";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const webSocket = new WebSocket("/ws/incidents");
    webSocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
      if (Array.isArray(messageFromServer)) {
        setIncidents(messageFromServer);
      } else {
        setIncidents((old) => [...old, messageFromServer]);
      }
    };
    setWebsocket(webSocket);
  }, []);

  function handleNewIncident(incident: Incident) {
    websocket?.send(JSON.stringify(incident));
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
