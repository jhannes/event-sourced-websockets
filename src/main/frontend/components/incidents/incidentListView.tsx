import React, { useEffect, useState } from "react";
import { NewIncidentForm } from "./newIncidentForm";
import {
  IncidentDto,
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
      const message: MessageFromServerDto = JSON.parse(event.data);
      if ("delta" in message) {
        const {
          incidentId,
          clientTime,
          delta: { info },
        } = message;

        setIncidents((old) => [
          ...old,
          { id: incidentId, updatedAt: clientTime, info },
        ]);
      } else if ("incidents" in message) {
        setIncidents(message.incidents);
      } else {
        const unhandled: never = message;
        console.error({ unhandled });
      }
    };
    setWebsocket(ws);
  }, []);

  function handleNewIncident(incident: IncidentDto) {
    const message: MessageToServerDto = {
      type: "IncidentCommand",
      eventId: uuid(),
      incidentId: uuid(),
      clientTime: new Date(),
      delta: {
        type: "CreateIncidentDelta",
        info: incident,
      },
    };
    websocket?.send(JSON.stringify(message));
  }

  return (
    <>
      <h2>Incidents</h2>
      {incidents.map((i) => (
        <li>{i.info.description}</li>
      ))}
      <h2>New incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
