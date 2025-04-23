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

  function updateIncident(
    event: IncidentEvent,
    updater: (old: IncidentSnapshot) => Partial<IncidentSnapshot>,
  ) {
    const { incidentId, clientTime: updatedAt } = event;
    setIncidents((old) =>
      old.map((o) =>
        o.id === incidentId ? { ...o, updatedAt, ...updater(o) } : o,
      ),
    );
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
      updateIncident(event, (o) => ({ info: { ...o.info, ...info } }));
    } else if (delta.delta === "AddPersonToIncident") {
      const { personId, person } = delta;
      updateIncident(event, (o) => ({
        persons: { ...o.persons, [personId]: person },
      }));
    } else if (delta.delta === "UpdatePersonInIncident") {
      const { personId, person } = delta;
      updateIncident(event, (o) => ({
        persons: {
          ...o.persons,
          [personId]: { ...o.persons[personId], ...person },
        },
      }));
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
    const type = "IncidentCommand";
    sendMessage({ id: uuidv4(), clientTime, type, incidentId, delta });
  }

  return { sendCommand, incidents };
}
