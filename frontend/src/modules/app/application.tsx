import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { Incident } from "../../../../shared/incidents";
import { IncidentRow } from "../incidents/incidentRow";
import { v4 as uuidv4 } from "uuid";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  const [id, setId] = useState(uuidv4());
  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (Array.isArray(message)) {
        setIncidents(message);
      } else {
        setIncidents((old) => [...old, message]);
      }
    };
    setWebsocket(ws);
  }, []);

  function handleNewIncident(incident: Omit<Incident, "id">) {
    websocket?.send(JSON.stringify({ ...incident, id }));
    setId(uuidv4());
  }

  function handleChangePriority() {
    // TODO: Websocket.send
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <IncidentRow
          key={i.id}
          incident={i}
          onChangePriority={handleChangePriority}
        />
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm key={id} onNewIncident={handleNewIncident} />
    </>
  );
}
