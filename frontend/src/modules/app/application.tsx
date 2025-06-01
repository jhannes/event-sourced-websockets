import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import {
  Incident,
  IncidentEvent,
  IncidentPriorityEnum,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../../../../shared/incidents";
import { IncidentRow } from "../incidents/incidentRow";
import { v4 as uuidv4 } from "uuid";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  const [incidentId, setIncidentId] = useState(uuidv4());

  function handleMessage(message: MessageFromServer) {
    if (Array.isArray(message)) {
      setIncidents(message);
    } else {
      const event: IncidentEvent = message;
      const { incidentId, delta } = event;
      if (delta.type === "CreateIncident") {
        const { info } = delta;
        const incident: IncidentSnapshot = { incidentId, info };
        setIncidents((old) => [...old, incident]);
      } else if (delta.type === "UpdateIncident") {
        setIncidents((old) =>
          old.map((o) =>
            o.incidentId !== event.incidentId
              ? o
              : { ...o, info: { ...o.info, ...delta.info } },
          ),
        );
      } else {
        const unhandled: never = delta;
        console.log("Unhandled message", { unhandled });
      }
    }
  }

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      handleMessage(JSON.parse(event.data));
    };
    setWebsocket(ws);
  }, []);

  function sendMessage(message: MessageToServer) {
    websocket?.send(JSON.stringify(message));
  }

  function handleNewIncident(info: Incident) {
    sendMessage({
      eventId: uuidv4(),
      clientTime: new Date(),
      incidentId,
      delta: { type: "CreateIncident", info },
    });
    setIncidentId(uuidv4());
  }

  function handleChangePriority(
    incidentId: string,
    priority: IncidentPriorityEnum,
  ) {
    sendMessage({
      eventId: uuidv4(),
      clientTime: new Date(),
      incidentId,
      delta: { type: "UpdateIncident", info: { priority } },
    });
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <IncidentRow
          key={i.incidentId}
          incident={i}
          onChangePriority={handleChangePriority}
        />
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm key={incidentId} onNewIncident={handleNewIncident} />
    </>
  );
}
