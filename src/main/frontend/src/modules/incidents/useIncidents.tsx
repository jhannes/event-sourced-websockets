import { useState } from "react";
import {
  IncidentSummaryDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { useWebSocket } from "../../hooks/useWebSocket";

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentSummaryDto[]>([]);

  function handleMessage(message: MessageFromServerDto) {
    if ("summaries" in message) {
      setIncidents(message.summaries);
    } else if ("delta" in message) {
      const { incidentId: id, clientTime: updatedAt } = message;
      if (message.delta.delta === "CreateIncidentDelta") {
        const {
          delta: { info },
        } = message;
        setIncidents((old) => [
          ...old,
          { id, createdAt: updatedAt, updatedAt, info },
        ]);
      } else if (message.delta.delta === "UpdateIncidentDelta") {
        const {
          delta: { info },
        } = message;
        setIncidents((old) =>
          old.map((o) =>
            o.id === id ? { ...o, updatedAt, info: { ...o.info, ...info } } : o,
          ),
        );
      } else {
        const unexpected: never = message.delta;
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
