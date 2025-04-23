import { IncidentDelta, IncidentSnapshot } from "../../../../shared/incidents";
import { IncidentItem } from "./incidentItem";
import { NewIncidentForm } from "./newIncidentForm";
import * as React from "react";

export function IncidentSummary({
  incidents,
  sendCommand,
}: {
  incidents: IncidentSnapshot[];
  sendCommand: (incidentId: string, delta: IncidentDelta) => void;
}) {
  return (
    <>
      <h1>Incidents</h1>
      {incidents.map((i) => (
        <IncidentItem key={i.id} incident={i} sendCommand={sendCommand} />
      ))}

      <NewIncidentForm sendCommand={sendCommand} />
    </>
  );
}
