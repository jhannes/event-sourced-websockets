import React, { useEffect, useState } from "react";
import { NewIncidentForm } from "./newIncidentForm";
import { IncidentItem } from "./incidentItem";
import { v4 as uuid } from "uuid";
import {
  IncidentDeltaDto,
  IncidentInfoDto,
  IncidentSnapshotDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../target/generated-sources/openapi-typescript";

export function IncidentListView() {
  const [incidents, setIncidents] = useState<IncidentSnapshotDto[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as MessageFromServerDto;
      if ("incidents" in message) {
        setIncidents(message.incidents);
      } else {
        const { delta, incidentId: id, clientTime: updatedAt } = message;
        if (delta.type === "CreateIncident") {
          const { info } = delta;
          setIncidents((old) => [
            ...old,
            { id, createdAt: updatedAt, updatedAt, info },
          ]);
        } else if (delta.type === "UpdateIncident") {
          const { info } = delta;
          setIncidents((old) =>
            old.map((o) =>
              o.id === id
                ? { ...o, updatedAt, info: { ...o.info, ...info } }
                : o,
            ),
          );
        } else {
          const unhandled: never = delta;
          console.error("Unexpected message ", { unhandled });
        }
      }
    };
    setWebsocket(ws);
  }, []);

  function sendMessageToServer(message: MessageToServerDto) {
    websocket?.send(JSON.stringify(message));
  }

  function sendCommandToServer(incidentId: string, delta: IncidentDeltaDto) {
    sendMessageToServer({
      type: "IncidentCommand",
      eventId: uuid(),
      clientTime: new Date(),
      incidentId,
      delta,
    });
  }

  function handleNewIncident(info: IncidentInfoDto) {
    sendCommandToServer(uuid(), { type: "CreateIncident", info });
  }

  function handleUpdateIncident(id: string, info: IncidentInfoDto) {
    sendCommandToServer(id, { type: "UpdateIncident", info });
  }

  return (
    <>
      <h2>Incidents</h2>
      {incidents.map((i) => (
        <IncidentItem
          key={i.id}
          incident={i}
          onUpdate={(info) => handleUpdateIncident(i.id, info)}
        />
      ))}
      <h2>New incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
