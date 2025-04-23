import {
  IncidentDelta,
  IncidentEvent,
  IncidentSnapshot,
  MessageFromServer,
  uuidv4,
} from "../../../../shared/incidents";
import { useState } from "react";
import { useWebSocket } from "./useWebSocket";

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  function handleMessage(message: MessageFromServer) {
    const { type } = message;
    if (type === "IncidentEvent") {
      handleIncidentEvent(message);
    } else if (type === "IncidentSummaryList") {
      setIncidents(message.summaries);
    } else {
      const unexpectedMessage: never = type;
      console.log({ unexpectedMessage });
    }
  }

  function handleIncidentEvent(event: IncidentEvent) {
    const { incidentId, delta, clientTime: updatedAt } = event;
    if (delta.delta === "CreateIncidentDelta") {
      const { incident: info } = delta;
      setIncidents((old) => [
        ...old,
        { id: incidentId, createdAt: updatedAt, updatedAt, info, persons: {} },
      ]);
    } else if (delta.delta === "UpdateIncidentDelta") {
      const { incident: info } = delta;
      setIncidents((old) =>
        old.map((o) =>
          o.id === incidentId
            ? { ...o, updatedAt, info: { ...o.info, ...info } }
            : o,
        ),
      );
    } else if (delta.delta === "AddPersonToIncident") {
      const { personId, person } = delta;
      setIncidents((old) =>
        old.map((o) =>
          o.id === incidentId
            ? { ...o, updatedAt, persons: { ...o.persons, [personId]: person } }
            : o,
        ),
      );
    } else {
      const unexpectedDelta: never = delta;
      console.log({ unexpectedDelta });
    }
  }

  const { sendMessage } = useWebSocket({
    url: "/ws/incidents",
    onMessage: handleMessage,
  });

  function sendCommand(incidentId: string, delta: IncidentDelta) {
    const clientTime = new Date().toISOString();
    sendMessage({
      id: uuidv4(),
      clientTime: clientTime,
      type: "IncidentCommand",
      incidentId,
      delta,
    });
  }

  return { sendCommand, incidents };
}
