import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentPrioritySelect } from "../incidents/incidentPrioritySelect";
import { v4 as uuidv4 } from "uuid";
import {
  Incident,
  IncidentPriorityEnum,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../../../../shared/incidents/incident";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();

  function handleMessage(message: MessageFromServer) {
    if (Array.isArray(message)) {
      setIncidents(message);
    } else {
      const { delta, clientTime: updatedAt, incidentId } = message;
      if (delta.type === "CreateIncident") {
        const { incident } = delta;
        const incidentSnapshot = { incidentId, updatedAt, incident };
        setIncidents((old) => [...old, incidentSnapshot]);
      } else if (delta.type === "UpdateIncident") {
        setIncidents((old) =>
          old.map((o) =>
            o.incidentId !== incidentId
              ? o
              : {
                  ...o,
                  incident: { ...o.incident, ...delta.incident },
                  updatedAt,
                },
          ),
        );
      } else {
        const unhandled: never = delta;
        console.log({ unhandled });
      }
    }
  }

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    };
    setWebsocket(ws);
  }, []);

  function sendMessage(incident: MessageToServer) {
    websocket?.send(JSON.stringify(incident));
  }

  function handleNewIncident(incident: Incident) {
    sendMessage({
      incidentId: uuidv4(),
      eventId: uuidv4(),
      clientTime: new Date(),
      delta: { type: "CreateIncident", incident },
    });
  }

  function handlePriorityChange(
    incidentId: string,
    priority: IncidentPriorityEnum,
  ) {
    sendMessage({
      incidentId,
      eventId: uuidv4(),
      clientTime: new Date(),
      delta: { type: "UpdateIncident", incident: { priority } },
    });
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <li>
          <IncidentPrioritySelect
            value={i.incident.priority}
            onChange={(p) => handlePriorityChange(i.incidentId, p)}
          />{" "}
          {i.incident.summary}
        </li>
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
