import { useState } from "react";
import {
  IncidentEvent,
  IncidentSnapshot,
  MessageFromServer,
} from "../../../../shared/incidents";

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  function updateIncident(
    event: IncidentEvent,
    fn: (old: IncidentSnapshot) => Partial<IncidentSnapshot>,
  ) {
    setIncidents((old) => {
      return old.map((o) =>
        o.incidentId !== event.incidentId
          ? o
          : { ...o, ...fn(o), updatedAt: event.clientTime },
      );
    });
  }

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
        updateIncident(event, (old) => ({
          info: { ...old.info, ...delta.info },
        }));
      } else if (delta.type === "AddPersonToIncident") {
        const { personId, person } = delta;
        updateIncident(event, (old) => ({
          persons: { ...old.persons, [personId]: person },
        }));
      } else if (delta.type === "UpdatePersonInIncident") {
        const { personId, person } = delta;
        updateIncident(event, (old) => ({
          persons: {
            ...old.persons,
            [personId]: { ...old.persons[personId], ...person },
          },
        }));
      } else {
        const unhandled: never = delta;
        console.log("Unhandled message", { unhandled });
      }
    }
  }

  return { handleMessage, incidents };
}
