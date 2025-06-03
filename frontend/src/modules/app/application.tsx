import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import {
  Incident,
  IncidentPriorityEnum,
  MessageFromServer,
  MessageToServer,
} from "../incidents/incident";
import { IncidentPrioritySelect } from "../incidents/incidentPrioritySelect";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();

  function handleMessage(message: MessageFromServer) {
    if (Array.isArray(message)) {
      setIncidents(message);
    } else {
      setIncidents((old) => [...old, message]);
    }
  }

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    setWebsocket(ws);
    ws.onmessage = (event) => {
      handleMessage(JSON.parse(event.data) as MessageFromServer);
    };
  }, []);

  function sendMessage(message: MessageToServer) {
    websocket?.send(JSON.stringify(message));
  }

  function handleNewIncident(incident: Incident) {
    sendMessage(incident);
  }

  function handleUpdatePriority(id: string, priority: IncidentPriorityEnum) {}

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <li>
          <IncidentPrioritySelect
            value={i.priority}
            onChange={(priority) => handleUpdatePriority(i.id, priority)}
          />{" "}
          {i.summary}
        </li>
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
