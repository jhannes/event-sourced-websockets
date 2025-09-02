import React, { useEffect, useState } from "react";
import { NewIncidentForm } from "./newIncidentForm";
import {
  IncidentDto,
  IncidentSnapshotDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../target/generated-sources/typescript";
import { v4 as uuid } from "uuid";
import { IncidentItem } from "./incidentItem";

export function IncidentListView({}: {}) {
  const [incidents, setIncidents] = useState<IncidentSnapshotDto[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message: MessageFromServerDto = JSON.parse(event.data);
      if ("incidents" in message) {
        setIncidents(message.incidents);
      } else if ("delta" in message) {
        const { delta, incidentId, clientTime: updatedAt } = message;
        if (delta.type === "CreateIncidentDelta") {
          const { info } = delta;
          setIncidents((old) => [
            ...old,
            {
              id: incidentId,
              updatedAt,
              info,
            },
          ]);
        } else if (delta.type === "UpdateIncidentDelta") {
          setIncidents((old) =>
            old.map((o) =>
              o.id === incidentId
                ? { ...o, info: { ...o.info, ...delta.info } }
                : o,
            ),
          );
        } else {
          const unhandledDelta: never = delta;
          console.log({ unhandledDelta });
        }
      } else {
        const unhandled: never = message;
        console.error({ unhandled });
      }
    };
    setWebsocket(ws);
  }, []);

  function sendMessage(message: MessageToServerDto) {
    websocket?.send(JSON.stringify(message));
  }

  function handleNewIncident(info: IncidentDto) {
    sendMessage({
      type: "IncidentCommand",
      eventId: uuid(),
      incidentId: uuid(),
      clientTime: new Date(),
      delta: { type: "CreateIncidentDelta", info },
    });
  }

  function handleChangeIncident(incidentId: string, info: IncidentDto) {
    sendMessage({
      type: "IncidentCommand",
      eventId: uuid(),
      incidentId,
      clientTime: new Date(),
      delta: { type: "UpdateIncidentDelta", info },
    });
  }

  return (
    <>
      <h2>Incidents</h2>
      {incidents.map((i) => (
        <IncidentItem
          key={i.id}
          incident={i}
          onPriorityChange={(priority) =>
            handleChangeIncident(i.id, { priority })
          }
        />
      ))}
      <h2>New incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
