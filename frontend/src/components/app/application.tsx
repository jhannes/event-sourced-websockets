import React from "react";
import { IncidentOverview } from "../incidents/incidentOverview";
import { IncidentsContext } from "../incidents/incidentsContext";

export function Application() {
  return (
    <IncidentsContext>
      <IncidentOverview />
    </IncidentsContext>
  );
}
