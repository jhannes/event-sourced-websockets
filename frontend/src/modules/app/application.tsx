import * as React from "react";
import { useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import {
  Incident,
  IncidentDelta,
  IncidentEvent,
  IncidentPriorityEnum,
  IncidentSnapshot,
  MessageFromServer,
} from "../../../../shared/incidents";
import { IncidentRow } from "../incidents/incidentRow";
import { v4 as uuidv4 } from "uuid";
import { useWebSocket } from "../../hooks/useWebSocket";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);
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

  const { sendMessage } = useWebSocket(handleMessage, "/ws/incidents");

  function sendCommand(incidentId: string, delta: IncidentDelta) {
    const clientTime = new Date();
    const eventId = uuidv4();
    sendMessage({ eventId, clientTime, incidentId, delta });
  }

  function handleNewIncident(info: Incident) {
    sendCommand(incidentId, { type: "CreateIncident", info });
    setIncidentId(uuidv4());
  }

  function handleChangePriority(
    incidentId: string,
    priority: IncidentPriorityEnum,
  ) {
    sendCommand(incidentId, { type: "UpdateIncident", info: { priority } });
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
