import React, { ReactNode, useContext } from "react";
import {
  IncidentCommand,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../../../../shared/incidents";
import { v4 as uuidv4 } from "uuid";
import { useIncidents } from "../../hooks/useIncidents";
import { useWebSocket } from "../../hooks/useWebSocket";

export function IncidentsContext({ children }: { children: ReactNode }) {
  const { incidents, handleMessageFromServer } = useIncidents();

  const { sendMessage } = useWebSocket<MessageToServer, MessageFromServer>(
    "/ws/incidents",
    handleMessageFromServer,
  );

  return (
    <IncidentsContextInternal value={{ incidents, sendMessage }}>
      {children}
    </IncidentsContextInternal>
  );
}

const IncidentsContextInternal = React.createContext<{
  incidents: IncidentSnapshot[];
  sendMessage: (m: MessageToServer) => void;
}>({
  incidents: [],
  sendMessage: () => {},
});

export function incidentsContext() {
  const { incidents, sendMessage } = useContext(IncidentsContextInternal);

  function sendCommand(command: Pick<IncidentCommand, "incidentId" | "delta">) {
    sendMessage({ id: uuidv4(), clientTime: new Date(), ...command });
  }

  return { sendCommand, incidents };
}
