import { useIncidentsContext } from "./useIncidentsContext";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IncidentInfo } from "../../../../shared/incidents";
import { NewIncidentForm } from "./newIncidentForm";

export function NewIncident() {
  const { sendCommand } = useIncidentsContext();
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
