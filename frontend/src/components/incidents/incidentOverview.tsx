import { IncidentInfo } from "../../../../shared/incidents";
import { IncidentRow } from "./incidentRow";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NewIncidentForm } from "./newIncidentForm";
import { incidentsContext } from "./incidentsContext";

export function IncidentOverview() {
  const { incidents } = incidentsContext();
  return (
    <div>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((i, index) => (
          <li key={index}>
            <IncidentRow incident={i} />
          </li>
        ))}
      </ul>
      <NewIncident />
    </div>
  );
}

function NewIncident() {
  const { sendCommand } = incidentsContext();
  const [incidentId, setIncidentId] = useState(uuidv4());

  function handleNewIncident(info: IncidentInfo) {
    sendCommand({ incidentId, delta: { delta: "CreateIncidentDelta", info } });
    setIncidentId(uuidv4());
  }

  return (
    <>
      <h2>New incident</h2>
      <NewIncidentForm key={incidentId} onNewIncident={handleNewIncident} />
    </>
  );
}
