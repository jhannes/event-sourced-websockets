import * as React from "react";
import { useEffect, useState } from "react";
import { Incident, schema } from "../../../../shared/incidents";
import { z } from "zod";
import { NewIncidentForm } from "../incidents/newIncidentForm";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      setIncidents(z.array(schema.Incident).parse(JSON.parse(event.data)));
    };
    setWs(ws);
  }, []);

  function handleNewIncident(incident: Incident) {
    ws?.send(JSON.stringify(incident));
  }

  return (
    <>
      <h1>Incidents</h1>
      {incidents.map(({ id, title }) => (
        <div key={id}>{title}</div>
      ))}

      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
