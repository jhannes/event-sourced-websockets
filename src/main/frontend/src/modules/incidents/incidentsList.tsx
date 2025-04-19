import { IncidentSummaryDto } from "../../../../../../target/generated-sources/openapi-typescript";
import { IncidentItem } from "./incidentItem";
import { NewIncidentForm } from "./newIncidentForm";
import React from "react";

function sortByTimestamp(a: IncidentSummaryDto, b: IncidentSummaryDto) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export function IncidentsList({
  incidents,
}: {
  incidents: IncidentSummaryDto[];
}) {
  return (
    <>
      <h1>Incidents</h1>
      <ul>
        {incidents.toSorted(sortByTimestamp).map((m) => (
          <IncidentItem key={m.id} incident={m} />
        ))}
      </ul>
      <h2>New incident</h2>

      <NewIncidentForm />
    </>
  );
}
