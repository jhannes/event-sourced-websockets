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

  function handleMessage(message: MessageFromServerDto) {
    if ("incidents" in message) {
      setIncidents(message.incidents);
    } else if ("delta" in message) {
      const { delta, clientTime: updatedAt, incidentId } = message;
      if (delta.type === "CreateIncidentDelta") {
        const incident = { id: incidentId, updatedAt, info: delta.info };
        setIncidents((old) => [...old, incident]);
      } else if (delta.type === "UpdateIncidentDelta") {
        setIncidents((old) =>
          old.map((o) => {
            return o.id === incidentId
              ? { ...o, info: { ...o.info, ...delta.info }, updatedAt }
              : o;
          }),
        );
      } else {
        const unhandled: never = delta;
        console.error({ unhandled });
      }
    } else {
      const unhandled: never = message;
      console.error({ unhandled });
    }
  }

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      handleMessage(JSON.parse(event.data));
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

  function handleUpdateIncident(info: IncidentDto, incidentId: string) {
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
          onChangePriority={(priority) =>
            handleUpdateIncident({ priority }, i.id)
          }
        />
      ))}
      <h2>New incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
