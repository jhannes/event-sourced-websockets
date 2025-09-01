import React, { useEffect, useState } from "react";
import { NewIncidentForm } from "./newIncidentForm";
import { IncidentItem } from "./incidentItem";
import {
  IncidentDeltaDto,
  IncidentInfoDto,
  IncidentSnapshotDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../target/generated-sources/typescript";
import { v4 as uuid } from "uuid";

export function IncidentListView({}: {}) {
  const [incidents, setIncidents] = useState<IncidentSnapshotDto[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as MessageFromServerDto;
      if ("incidents" in message) {
        setIncidents(message.incidents);
      } else if ("delta" in message) {
        const { delta, incidentId, clientTime: updatedAt } = message;

        if (delta.type === "CreateIncidentDelta") {
          const incident = {
            id: incidentId,
            createdAt: updatedAt,
            updatedAt,
            info: delta.info,
          };
          setIncidents((old) => [...old, incident]);
        } else if (delta.type === "UpdateIncidentDelta") {
          setIncidents((old) =>
            old.map((o) =>
              o.id === incidentId
                ? { ...o, updatedAt, info: { ...o.info, ...delta.info } }
                : o,
            ),
          );
        } else {
          const unhandled: never = delta;
          console.error({ unhandled });
        }
      } else {
        const unhandled: never = message;
        console.error({ unhandled });
      }
    };
    setWebsocket(ws);
  }, []);

  function sendMessageToServer(message: MessageToServerDto) {
    websocket?.send(JSON.stringify(message));
  }

  function sendCommandToServer(delta: IncidentDeltaDto, incidentId: string) {
    sendMessageToServer({
      type: "IncidentCommand",
      clientTime: new Date(),
      eventId: uuid(),
      incidentId,
      delta,
    });
  }

  function handleNewIncident(info: IncidentInfoDto) {
    sendCommandToServer({ type: "CreateIncidentDelta", info }, uuid());
  }

  return (
    <>
      <h2>Incidents</h2>
      <ul>
        {incidents.map((i) => (
          <IncidentItem
            key={i.id}
            incident={i}
            onChange={(info) => {
              sendCommandToServer({ type: "UpdateIncidentDelta", info }, i.id);
            }}
          />
        ))}
      </ul>
      <h2>New incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
