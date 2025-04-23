import * as React from "react";
import { useEffect, useState } from "react";
import {
  Incident,
  MessageToServer,
  schema,
  uuidv4,
} from "../../../../shared/incidents";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentItem } from "../incidents/incidentItem";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = schema.MessageFromServer.parse(JSON.parse(event.data));
      const type = message.type;
      if (type === "IncidentEvent") {
        const delta = message.delta.delta;
        if (delta === "CreateIncidentDelta") {
          setIncidents((old) => [...old, message.delta.incident]);
        } else {
          const unexpectedDelta: never = delta;
          console.log({ unexpectedDelta });
        }
      } else if (type === "IncidentSummaryList") {
        setIncidents(message.summaries);
      } else {
        const unexpectedMessage: never = type;
        console.log({ unexpectedMessage });
      }
    };
    setWs(ws);
  }, []);

  function send(message: MessageToServer) {
    ws?.send(JSON.stringify(message));
  }

  function handleNewIncident(incident: Incident) {
    send({
      id: uuidv4(),
      clientTime: new Date().toISOString(),
      type: "IncidentCommand",
      incidentId: incident.id,
      delta: {
        delta: "CreateIncidentDelta",
        incident,
      },
    });
  }

  return (
    <>
      <h1>Incidents</h1>
      {incidents.map((i) => (
        <IncidentItem key={i.id} incident={i} />
      ))}

      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
