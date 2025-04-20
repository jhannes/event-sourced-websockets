import { useRef, useState } from "react";
import {
  IncidentSnapshotDto,
  IncidentSummaryDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { useWebSocket } from "../../hooks/useWebSocket";

type IncidentLike = IncidentSummaryDto | IncidentSnapshotDto;

export function useIncidents() {
  const [incidents, setIncidents] = useState<Record<string, IncidentLike>>({});
  const lastSequenceId = useRef<number | undefined>(undefined);

  function updateIncident(
    id: string,
    fn: (old: IncidentLike) => Partial<IncidentLike>,
  ) {
    setIncidents((old) => ({ ...old, [id]: { ...old[id], ...fn(old[id]) } }));
  }

  function handleMessage(message: MessageFromServerDto) {
    if ("summaries" in message) {
      lastSequenceId.current = message.lastSequenceId;
      const newIncidents = Object.fromEntries(
        message.summaries.map((o) => [o.id, o]),
      );
      if (message.replaceList) {
        setIncidents(newIncidents);
      } else {
        setIncidents((old) => ({ ...old, ...newIncidents }));
      }
    } else if ("delta" in message) {
      const {
        incidentId: id,
        clientTime: updatedAt,
        sequenceId,
        delta,
      } = message;
      lastSequenceId.current = sequenceId;
      if (delta.delta === "CreateIncidentDelta") {
        const { info } = delta;
        setIncidents((old) => ({
          ...old,
          [id]: { id, createdAt: updatedAt, updatedAt, info },
        }));
      } else if (delta.delta === "UpdateIncidentDelta") {
        const { info } = delta;
        updateIncident(id, (o) => ({
          updatedAt,
          info: { ...o.info, ...info },
        }));
      } else if (delta.delta === "AddPersonToIncidentDelta") {
        const { personId, info } = delta;
        const addedPerson = { [personId]: info };
        updateIncident(id, (o) => ({
          persons:
            "persons" in o ? { ...o.persons, ...addedPerson } : addedPerson,
        }));
      } else if (delta.delta === "UpdatePersonInIncidentDelta") {
        const { personId, info } = delta;
        updateIncident(id, (o) => ({
          persons:
            "persons" in o
              ? Object.fromEntries(
                  Object.entries(o.persons).map(([k, v]) =>
                    k === personId ? [k, { ...v, ...info }] : [k, v],
                  ),
                )
              : { [personId]: info },
        }));
      } else {
        // noinspection UnnecessaryLocalVariableJS
        const unexpected: never = delta;
        console.log("Should never happen: ", unexpected);
      }
    } else if ("id" in message) {
      const { id } = message;
      setIncidents((old) => ({ ...old, [id]: message }));
    } else if ("signal" in message) {
      const { signal } = message;
      if (signal === "UnauthenticatedErrorSignal") {
        window.location.href = "/api/login/start";
      } else {
        const unexpected: never = signal;
        console.log("Should never happen: ", unexpected);
      }
    } else {
      const unexpected: never = message;
      console.log("Should never happen: ", unexpected);
    }
  }

  const { sendMessage, isConnected } = useWebSocket<
    MessageFromServerDto,
    MessageToServerDto
  >({
    url: "/ws/incidents",
    onMessage: handleMessage,
    onConnect: () =>
      sendMessage({
        type: "IncidentSummarySubscribeRequest",
        lastSequenceId: lastSequenceId.current,
      }),
  });
  return { incidents: Object.values(incidents), sendMessage, isConnected };
}
