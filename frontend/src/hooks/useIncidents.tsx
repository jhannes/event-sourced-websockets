import { useState } from "react";
import { IncidentSnapshot, MessageFromServer } from "../../../shared/incidents";

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  function handleMessageFromServer(messageFromServer: MessageFromServer) {
    if ("type" in messageFromServer) {
      setIncidents(messageFromServer.incidents);
    } else {
      const {
        incidentId,
        clientTime,
        delta: { info },
      } = messageFromServer;
      const incident = { id: incidentId, updatedAt: clientTime, info };
      setIncidents((old) => [...old, incident]);
    }
  }

  return { incidents, handleMessageFromServer };
}
