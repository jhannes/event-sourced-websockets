import React, { useEffect, useState } from "react";
import { Incident, NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentRow } from "../incidents/incidentRow";
import { v4 as uuidv4 } from "uuid";

function useWebSocket(url: string, onMessage: (message: any) => void) {
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const webSocket = new WebSocket(url);
    webSocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
      onMessage(messageFromServer);
    };
    setWebsocket(webSocket);
  }, []);

  function sendMessage(messageToServer: unknown) {
    websocket?.send(JSON.stringify(messageToServer));
  }

  return { sendMessage };
}

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const [newIncidentId, setNewIncidentId] = useState(uuidv4());

  function handleMessageFromServer(messageFromServer: any) {
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
    sendMessage({ ...incident, id: newIncidentId });
    setNewIncidentId(uuidv4());
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
      <NewIncidentForm key={newIncidentId} onNewIncident={handleNewIncident} />
    </div>
  );
}
