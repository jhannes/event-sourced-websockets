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

  function updateIncident(
    id: string,
    fn: (old: IncidentSnapshot) => Partial<IncidentSnapshot>,
  ) {
    setIncidents((old) =>
      old.map((o) => (id !== o.id ? o : { ...o, ...fn(o) })),
    );
  }

  function handleMessageFromServer(messageFromServer: MessageFromServer) {
    if ("type" in messageFromServer) {
      setIncidents(messageFromServer.incidents);
    } else {
      const { incidentId, clientTime: updatedAt, delta } = messageFromServer;
      if (delta.delta === "CreateIncidentDelta") {
        setIncidents((old) => [
          ...old,
          { id: incidentId, updatedAt, info: delta.info, persons: {} },
        ]);
      } else if (delta.delta === "UpdateIncidentDelta") {
        updateIncident(incidentId, (o) => ({
          updatedAt,
          info: { ...o.info, ...delta.info },
        }));
      } else if (delta.delta === "AddPersonToIncident") {
        const { personId, personInfo } = delta;
        updateIncident(incidentId, (o) => ({
          persons: { ...o.persons, [personId]: { personInfo, updatedAt } },
        }));
      } else if (delta.delta === "UpdatePersonInIncident") {
        const { personId, personInfo } = delta;
        updateIncident(incidentId, (o) => ({
          persons: Object.fromEntries(
            Object.entries(o.persons).map(([id, p]) => [
              id,
              id === personId
                ? {
                    ...p,
                    personInfo: {
                      ...p.personInfo,
                      ...personInfo,
                      updatedAt,
                    },
                  }
                : p,
            ]),
          ),
        }));
      } else {
        const _: never = delta;
        console.log("Unexpected delta", delta);
      }
    }
  }

  return { incidents, handleMessageFromServer };
}
