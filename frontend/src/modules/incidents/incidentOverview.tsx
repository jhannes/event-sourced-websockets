import * as React from "react";
import { useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { Incident } from "../../../../shared/incidents";
import { IncidentRow } from "../incidents/incidentRow";
import { v4 as uuidv4 } from "uuid";
import { useIncidentContext } from "../incidents/incidentContext";

export function IncidentOverview() {
  const [incidentId, setIncidentId] = useState(uuidv4());

  const { sendCommand, incidents } = useIncidentContext();

  function handleNewIncident(info: Incident) {
    sendCommand(incidentId, { type: "CreateIncident", info });
    setIncidentId(uuidv4());
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <IncidentRow key={i.incidentId} incident={i} />
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm key={incidentId} onNewIncident={handleNewIncident} />
    </>
  );
}
