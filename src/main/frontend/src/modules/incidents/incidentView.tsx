import { IncidentSummaryDto } from "../../../../../../target/generated-sources/openapi-typescript";
import { useParams } from "react-router";
import React from "react";

export function IncidentView({
  incidents,
}: {
  incidents: IncidentSummaryDto[];
}) {
  const { id } = useParams();
  const incident = incidents.find((o) => o.id === id);
  if (!incident) return <h1>Not found incident with {id}</h1>;
  return (
    <>
      <h1>Incident {incident.info.description}</h1>
      <p>
        <strong>Priority: </strong> {incident.info.priority}
      </p>
    </>
  );
}
