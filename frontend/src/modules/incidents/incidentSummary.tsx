import { IncidentSnapshot } from "../../../../shared/incidents";
import { IncidentItem } from "./incidentItem";
import { NewIncidentForm } from "./newIncidentForm";
import * as React from "react";
import { useContext } from "react";
import { IncidentContext } from "./incidentContext";

function sortByUpdated(a: IncidentSnapshot, b: IncidentSnapshot) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export function IncidentSummary() {
  const { incidents } = useContext(IncidentContext);
  return (
    <>
      <h1>Incidents</h1>
      {incidents.toSorted(sortByUpdated).map((i) => (
        <IncidentItem key={i.id} incident={i} />
      ))}
      <NewIncidentForm />
    </>
  );
}
