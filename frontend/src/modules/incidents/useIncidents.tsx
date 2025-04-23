import {
  Incident,
  IncidentDelta,
  IncidentEvent,
  MessageFromServer,
  uuidv4,
} from "../../../../shared/incidents";
import { useState } from "react";
import { useWebSocket } from "./useWebSocket";

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

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
    const delta = event.delta;
    if (delta.delta === "CreateIncidentDelta") {
      setIncidents((old) => [...old, delta.incident]);
    } else if (delta.delta === "UpdateIncidentDelta") {
      const { incidentId } = event;
      setIncidents((old) =>
        old.map((o) => (o.id === incidentId ? { ...o, ...delta.incident } : o)),
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
