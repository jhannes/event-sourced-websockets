import { useState } from "react";
import {
  IncidentEvent,
  IncidentSnapshot,
  MessageFromServer,
} from "../../../../shared/incidents";

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  function handleMessage(message: MessageFromServer) {
    if (Array.isArray(message)) {
      setIncidents(message);
    } else {
      const event: IncidentEvent = message;
      const { incidentId, delta, clientTime: updatedAt } = event;
      if (delta.type === "CreateIncident") {
        const { info } = delta;
        const incident: IncidentSnapshot = {
          incidentId,
          createdAt: updatedAt,
          updatedAt,
          info,
          persons: {},
        };
        setIncidents((old) => [...old, incident]);
      } else if (delta.type === "UpdateIncident") {
        setIncidents((old) => {
          return old.map((o) =>
            o.incidentId !== event.incidentId
              ? o
              : { ...o, info: { ...o.info, ...delta.info }, updatedAt },
          );
        });
      } else if (delta.type === "AddPersonToIncident") {
        // TODO
      } else {
        const unhandled: never = delta;
        console.log("Unhandled message", { unhandled });
      }
    }
  }

  return { handleMessage, incidents };
}
