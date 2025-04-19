import { useState } from "react";
import {
  IncidentSnapshotDto,
  IncidentSummaryDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { useWebSocket } from "../../hooks/useWebSocket";

export function useIncidents() {
  const [incidents, setIncidents] = useState<
    (IncidentSummaryDto | IncidentSnapshotDto)[]
  >([]);

  function handleMessage(message: MessageFromServerDto) {
    if ("summaries" in message) {
      setIncidents(message.summaries);
    } else if ("delta" in message) {
      const { incidentId: id, clientTime: updatedAt, delta } = message;
      if (delta.delta === "CreateIncidentDelta") {
        const { info } = delta;
        setIncidents((old) => [
          ...old,
          { id, createdAt: updatedAt, updatedAt, info },
        ]);
      } else if (delta.delta === "UpdateIncidentDelta") {
        const { info } = delta;
        setIncidents((old) =>
          old.map((o) =>
            o.id === id ? { ...o, updatedAt, info: { ...o.info, ...info } } : o,
          ),
        );
      } else if (delta.delta === "AddPersonToIncidentDelta") {
        const { personId, info } = delta;
        const addedPerson = { [personId]: info };
        setIncidents((old) =>
          old.map((o) =>
            o.id === id
              ? {
                  ...o,
                  persons:
                    "persons" in o
                      ? { ...o.persons, ...addedPerson }
                      : addedPerson,
                }
              : o,
          ),
        );
      } else {
        const unexpected: never = delta;
        console.log("Should never happen: ", unexpected);
      }
    } else {
      const unexpected: never = message;
      console.log("Should never happen: ", unexpected);
    }
  }

  const { sendMessage } = useWebSocket<
    MessageFromServerDto,
    MessageToServerDto
  >({
    url: "/ws/incidents",
    onMessage: handleMessage,
  });
  return { incidents, sendMessage };
}
