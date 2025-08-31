import React, { useEffect, useState } from "react";
import {
  IncidentDto,
  IncidentSummaryListDto,
  MessageFromServerDto,
} from "../../../../../target/generated-sources/openapi-typescript";
import { NewIncidentForm } from "./newIncidentForm";

export function IncidentListView() {
  const [incidents, setIncidents] = useState<IncidentDto[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as MessageFromServerDto;
      if ("incidents" in message) {
        setIncidents(message.incidents);
      } else {
        setIncidents((old) => [...old, message]);
      }
    };
    setWebsocket(ws);
  }, []);

  function handleNewIncident(incident: IncidentDto) {
    websocket?.send(JSON.stringify(incident));
  }

  return (
    <>
      <h2>Incidents</h2>
      {incidents.map((i) => (
        <li>{i.summary}</li>
      ))}
      <h2>New incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
