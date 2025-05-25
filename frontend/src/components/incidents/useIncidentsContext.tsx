import React, { ReactNode, useContext, useState } from "react";
import {
  IncidentCommand,
  IncidentSnapshot,
  IncidentSummary,
  MessageFromServer,
  MessageToServer,
  updateRecord,
} from "../../../../shared/incidents";
import { v4 as uuidv4 } from "uuid";
import { useWebSocket } from "../../hooks/useWebSocket";

export function IncidentsContext({ children }: { children: ReactNode }) {
  const { incidents, handleMessageFromServer, snapshots } = useIncidents();

  const { sendMessage } = useWebSocket<MessageToServer, MessageFromServer>(
    "/ws/incidents",
    handleMessageFromServer,
  );

  return (
    <IncidentsContextInternal value={{ incidents, sendMessage, snapshots }}>
      {children}
    </IncidentsContextInternal>
  );
}

const IncidentsContextInternal = React.createContext<{
  incidents: IncidentSummary[];
  sendMessage: (m: MessageToServer) => void;
  snapshots: Record<string, IncidentSnapshot>;
}>({
  incidents: [],
  sendMessage: () => {},
  snapshots: {},
});

export function useIncidentsContext() {
  const { incidents, sendMessage, snapshots } = useContext(
    IncidentsContextInternal,
  );

  function sendCommand(command: Pick<IncidentCommand, "incidentId" | "delta">) {
    sendMessage({ id: uuidv4(), clientTime: new Date(), ...command });
  }

  return { sendCommand, incidents, sendMessage, snapshots };
}

function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, IncidentSnapshot>>(
    {},
  );

  function updateIncident(
    id: string,
    fn: (old: IncidentSummary) => Partial<IncidentSummary>,
  ) {
    setIncidents((old) =>
      old.map((o) => (id !== o.id ? o : { ...o, ...fn(o) })),
    );
    updateIncidentSnapshot(id, fn);
  }

  function updateIncidentSnapshot(
    id: string,
    fn: (old: IncidentSnapshot) => Partial<IncidentSnapshot>,
  ) {
    setSnapshots((old) =>
      !old[id] ? old : { ...old, [id]: { ...old[id], ...fn(old[id]) } },
    );
  }

  function handleMessageFromServer(messageFromServer: MessageFromServer) {
    if ("type" in messageFromServer) {
      setIncidents(messageFromServer.summaries);
    } else if ("delta" in messageFromServer) {
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
        updateIncidentSnapshot(incidentId, (o) => ({
          persons: { ...o.persons, [personId]: { personInfo, updatedAt } },
        }));
      } else if (delta.delta === "UpdatePersonInIncident") {
        const { personId, personInfo } = delta;
        updateIncidentSnapshot(incidentId, (o) => ({
          persons: updateRecord(o.persons, personId, (p) => ({
            personInfo: { ...p.personInfo, ...personInfo },
            updatedAt,
          })),
        }));
      } else {
        const _: never = delta;
        console.log("Unexpected delta", delta);
      }
    } else {
      const snapshot = messageFromServer;
      setSnapshots((old) => ({ ...old, [snapshot.id]: snapshot }));
    }
  }

  return { incidents, handleMessageFromServer, snapshots };
}
