import * as React from "react";
import { ReactNode, useContext } from "react";
import {
  IncidentDelta,
  IncidentSnapshot,
  MessageToServer,
} from "../../../../shared/incidents";
import { useIncidents } from "./useIncidents";
import { useWebSocket } from "../../hooks/useWebSocket";
import { v4 as uuidv4 } from "uuid";

function sortByUpdatedAt(a: IncidentSnapshot, b: IncidentSnapshot) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

const IncidentContext = React.createContext({
  incidents: [] as IncidentSnapshot[],
  sendMessage: (message: MessageToServer) => {},
});

export function IncidentContextProvider({ children }: { children: ReactNode }) {
  const { incidents, handleMessage } = useIncidents();
  const { sendMessage } = useWebSocket(handleMessage, "/ws/incidents");

  return (
    <IncidentContext value={{ incidents, sendMessage }}>
      {children}
    </IncidentContext>
  );
}

export function useIncidentContext() {
  const { sendMessage, incidents } = useContext(IncidentContext);
  function sendCommand(incidentId: string, delta: IncidentDelta) {
    const clientTime = new Date();
    const eventId = uuidv4();
    sendMessage({ eventId, clientTime, incidentId, delta });
  }

  return { incidents: incidents.toSorted(sortByUpdatedAt), sendCommand };
}
