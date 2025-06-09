import { IncidentRow } from "./incidentRow";
import React from "react";
import { useIncidentsContext } from "./useIncidentsContext";
import { NewIncident } from "./newIncident";

export function IncidentOverview() {
  const { incidents } = useIncidentsContext();
  return (
    <div>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((i) => (
          <li key={i.id}>
            <IncidentRow incident={i} />
          </li>
        ))}
      </ul>
      <NewIncident />
    </div>
  );
}
