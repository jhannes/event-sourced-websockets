import {
  IncidentSnapshotDto,
  IncidentSummaryDto,
  InvolvedPersonInfoDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { Link, useParams } from "react-router";
import React, { useState } from "react";
import { AddInvolvedPersonForm } from "./persons/addInvolvedPersonForm";
import { v4 as uuidv4 } from "uuid";
import { useIncidents } from "./useIncidents";

function isSnapshot(
  incident: IncidentSummaryDto,
): incident is IncidentSnapshotDto {
  return "persons" in incident;
}

export function IncidentViewRoute({
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
  return <IncidentView incident={incident} />;
}

function IncidentView({ incident }: { incident: IncidentSummaryDto }) {
  const { sendMessage } = useIncidents();
  const {
    id: incidentId,
    info: { description, priority },
  } = incident;
  const [personId, setPersonId] = useState(() => uuidv4());
  function handleAddPerson(info: InvolvedPersonInfoDto) {
    sendMessage({
      type: "IncidentCommand",
      clientTime: new Date(),
      incidentId,
      delta: { delta: "AddPersonToIncidentDelta", personId, info },
    });
    setPersonId(uuidv4());
  }
  return (
    <>
      <h1>Incident {description}</h1>
      <p>
        <strong>Priority: </strong> {priority}
      </p>
      {isSnapshot(incident) && <IncidentDetails incident={incident} />}
      <AddInvolvedPersonForm key={personId} onAddPerson={handleAddPerson} />
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
