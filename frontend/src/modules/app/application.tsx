import * as React from "react";
import { Incident } from "../../../../shared/incidents";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentItem } from "../incidents/incidentItem";
import { useIncidents } from "../incidents/useIncidents";

export function Application() {
  const { sendCommand, incidents } = useIncidents();

  function handleNewIncident(incident: Incident) {
    sendCommand(incident.id, { delta: "CreateIncidentDelta", incident });
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
