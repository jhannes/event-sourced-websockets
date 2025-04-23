import { IncidentDelta, IncidentSnapshot } from "../../../../shared/incidents";
import { IncidentItem } from "./incidentItem";
import { NewIncidentForm } from "./newIncidentForm";
import * as React from "react";

function sortByUpdated(a: IncidentSnapshot, b: IncidentSnapshot) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

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
      {incidents.toSorted(sortByUpdated).map((i) => (
        <IncidentItem key={i.id} incident={i} sendCommand={sendCommand} />
      ))}

      <NewIncidentForm sendCommand={sendCommand} />
    </>
  );
}
