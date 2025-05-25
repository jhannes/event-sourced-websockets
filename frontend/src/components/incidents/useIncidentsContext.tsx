import React, { ReactNode, useContext, useState } from "react";
import {
  IncidentCommand,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../../../../shared/incidents";
import { v4 as uuidv4 } from "uuid";
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

export function useIncidentsContext() {
  const { incidents, sendMessage } = useContext(IncidentsContextInternal);

  function sendCommand(command: Pick<IncidentCommand, "incidentId" | "delta">) {
    sendMessage({ id: uuidv4(), clientTime: new Date(), ...command });
  }

  return { sendCommand, incidents };
}

function useIncidents() {
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
