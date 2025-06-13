import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentPrioritySelect } from "./incidentPrioritySelect";
import {
  Incident,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../../../../shared/incident";
import { v4 as uuidv4 } from "uuid";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();

  function handleMessageFromServer(message: MessageFromServer) {
    if (Array.isArray(message)) {
      setIncidents(message);
    } else {
      const { incidentId, clientTime: updatedAt, delta } = message;

      if (delta.type === "CreateIncident") {
        const { incident } = delta;
        setIncidents((old) => [...old, { incidentId, updatedAt, incident }]);
      } else if (delta.type == "UpdateIncident") {
      } else {
        const unhandled: never = delta;
      }
    }
  }

  useEffect(() => {
    const ws = new WebSocket("/ws/incident");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessageFromServer(message);
    };
    setWebsocket(ws);
  }, []);

  function sendMessage(message: MessageToServer) {
    websocket?.send(JSON.stringify(message));
  }

  function handleNewIncident(incident: Incident) {
    sendMessage({
      incidentId: uuidv4(),
      eventId: uuidv4(),
      clientTime: new Date(),
      delta: { type: "CreateIncident", incident },
    });
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <li>
          <IncidentPrioritySelect /> {i.incident.summary}
        </li>
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
