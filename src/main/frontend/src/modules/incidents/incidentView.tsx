import {
  IncidentSnapshotDto,
  IncidentSummaryDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { Link, useParams } from "react-router";
import React from "react";
import { AddInvolvedPersonForm } from "./persons/addInvolvedPersonForm";

function isSnapshot(
  incident: IncidentSummaryDto,
): incident is IncidentSnapshotDto {
  return "persons" in incident;
}

export function IncidentView({
  incidents,
}: {
  incidents: IncidentSummaryDto[];
}) {
  const { id } = useParams();
  const incident = incidents.find((o) => o.id === id);
  if (!id || !incident)
    return (
      <>
        <h1>Not found incident with {id}</h1>
        <p>
          <Link to={"/"}>Front page</Link>
        </p>
      </>
    );
  return (
    <>
      <h1>Incident {incident.info.description}</h1>
      <p>
        <strong>Priority: </strong> {incident.info.priority}
      </p>
      {isSnapshot(incident) && <IncidentDetails incident={incident} />}
      <AddInvolvedPersonForm incidentId={id} />
    </>
  );
}

function IncidentDetails({ incident }: { incident: IncidentSnapshotDto }) {
  const { persons } = incident;
  return (
    <>
      <h3>Involved persons</h3>
      {Object.entries(persons).map(([k, v]) => (
        <li key={k}>
          <strong>{v.role}: </strong>
          {v.firstName} {v.lastName}
        </li>
      ))}
    </>
  );
}
