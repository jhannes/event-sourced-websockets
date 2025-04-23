import * as React from "react";
import { useEffect, useState } from "react";
import { Incident, schema } from "../../../../shared/incidents";
import { z } from "zod";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentItem } from "../incidents/incidentItem";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (Array.isArray(message)) {
        setIncidents(z.array(schema.Incident).parse(message));
      } else {
        setIncidents((old) => [...old, schema.Incident.parse(message)]);
      }
    };
    setWs(ws);
  }, []);

  function handleNewIncident(incident: Incident) {
    ws?.send(JSON.stringify(incident));
  }

  return (
    <>
      <h1>Incidents</h1>
      {incidents.map((i) => (
        <IncidentItem key={i.id} incident={i} />
      ))}

      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
