import React, { useEffect, useState } from "react";
import { NewIncidentForm } from "./newIncidentForm";
import { IncidentItem } from "./incidentItem";
import { v4 as uuid } from "uuid";
import {
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
        if (message.delta.type === "CreateIncident") {
          const incident: IncidentSnapshotDto = {
            id: message.incidentId,
            createdAt: message.clientTime,
            updatedAt: message.clientTime,
            info: message.delta.info,
          };
          setIncidents((old) => [...old, incident]);
        }
      }
    };
    setWebsocket(ws);
  }, []);

  function handleNewIncident(info: IncidentInfoDto) {
    const message: MessageToServerDto = {
      type: "IncidentCommand",
      eventId: uuid(),
      incidentId: uuid(),
      clientTime: new Date(),
      delta: { type: "CreateIncident", info },
    };
    websocket?.send(JSON.stringify(message));
  }

  return (
    <>
      <h2>Incidents</h2>
      {incidents.map((i) => (
        <IncidentItem key={i.id} incident={i} />
      ))}
      <h2>New incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
