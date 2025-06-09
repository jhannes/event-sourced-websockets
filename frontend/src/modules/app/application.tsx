import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentPrioritySelect } from "../incidents/incidentPrioritySelect";
import {
  Incident,
  IncidentPriorityEnum,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../../../../shared/incidents/incident";
import { v4 as uuidv4 } from "uuid";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();

  function handleMessage(message: MessageFromServer) {
    if (Array.isArray(message)) {
      setIncidents(message);
    } else if ("delta" in message) {
      const { incidentId, serverTime: updatedAt, delta } = message;
      if (delta.type === "CreateIncident") {
        const { incident } = delta;
        setIncidents((old) => [...old, { incidentId, updatedAt, incident }]);
      } else {
        const unhandled: never = delta.type;
        console.warn({ unhandled, delta });
      }
    } else {
      const unhandled: never = message;
      console.warn({ unhandled });
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

  function handleNewIncident(incidentId: string, incident: Incident) {
    sendMessage({
      eventId: uuidv4(),
      clientTime: new Date(),
      incidentId,
      delta: { type: "CreateIncident", incident },
    });
  }

  function handleUpdatePriority(
    incidentId: string,
    priority: IncidentPriorityEnum,
  ) {}

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map(({ incidentId, incident: { priority, summary } }) => (
        <li key={incidentId}>
          <IncidentPrioritySelect
            value={priority}
            onChange={(priority) => handleUpdatePriority(incidentId, priority)}
          />{" "}
          {summary}
        </li>
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
