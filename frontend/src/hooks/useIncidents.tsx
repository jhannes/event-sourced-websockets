import { useState } from "react";
import { IncidentSnapshot, MessageFromServer } from "../../../shared/incidents";

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  function handleMessageFromServer(messageFromServer: MessageFromServer) {
    if ("type" in messageFromServer) {
      setIncidents(messageFromServer.incidents);
    } else {
      const { incidentId, clientTime: updatedAt, delta } = messageFromServer;
      if (delta.delta === "CreateIncidentDelta") {
        const incident = { id: incidentId, updatedAt, info: delta.info };
        setIncidents((old) => [...old, incident]);
      } else if (delta.delta === "UpdateIncidentDelta") {
        setIncidents((old) =>
          old.map((o) =>
            incidentId !== o.id
              ? o
              : { ...o, updatedAt, info: { ...o.info, ...delta.info } },
          ),
        );
      } else {
        const _: never = delta;
        console.log("Unexpected delta", delta);
      }
    }
  }

  return { incidents, handleMessageFromServer };
}
