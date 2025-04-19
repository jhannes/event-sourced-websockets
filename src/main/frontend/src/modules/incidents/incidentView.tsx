import {
  IncidentDeltaDto,
  IncidentSnapshotDto,
  IncidentSummaryDto,
  InvolvedPersonInfoDto,
  InvolvedPersonInfoDtoRoleEnum,
  InvolvedPersonInfoDtoRoleEnumValues,
} from "../../../../../../target/generated-sources/openapi-typescript";
import { Link, useParams } from "react-router";
import React, { useContext, useEffect, useState } from "react";
import { AddInvolvedPersonForm } from "./persons/addInvolvedPersonForm";
import { v4 as uuidv4 } from "uuid";
import { useIncidents } from "./useIncidents";
import { IncidentContext } from "./incidentContext";

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
  const { sendMessage, isConnected } = useContext(IncidentContext);
  useEffect(() => {
    sendMessage({ type: "IncidentSubscribeRequest", incidentId: id! });
  }, [id, isConnected]);
  const incident = incidents.find((o) => o.id === id);
  if (!id || !incident) {
    return (
      <>
        <h1>Not found incident with {id}</h1>
        <p>
          <Link to={"/"}>Front page</Link>
        </p>
      </>
    );
  }
  return <IncidentView incident={incident} />;
}

function IncidentView({ incident }: { incident: IncidentSummaryDto }) {
  const { sendMessage } = useIncidents();
  const {
    id: incidentId,
    info: { description, priority },
  } = incident;
  function sendCommand(delta: IncidentDeltaDto) {
    sendMessage({
      type: "IncidentCommand",
      clientTime: new Date(),
      incidentId,
      delta,
    });
  }
  const [personId, setPersonId] = useState(() => uuidv4());
  function handleAddPerson(info: InvolvedPersonInfoDto) {
    sendCommand({ delta: "AddPersonToIncidentDelta", personId, info });
    setPersonId(uuidv4());
  }

  function handleUpdatePerson(personId: string, info: InvolvedPersonInfoDto) {
    sendCommand({ delta: "UpdatePersonInIncidentDelta", personId, info });
    setPersonId(uuidv4());
  }

  return (
    <>
      <h1>Incident {description}</h1>
      <p>
        <strong>Priority: </strong> {priority}
      </p>
      {isSnapshot(incident) && (
        <IncidentDetails incident={incident} onUpdate={handleUpdatePerson} />
      )}
      <AddInvolvedPersonForm key={personId} onAddPerson={handleAddPerson} />
    </>
  );
}

function IncidentDetails({
  incident,
  onUpdate,
}: {
  incident: IncidentSnapshotDto;
  onUpdate: (personId: string, info: InvolvedPersonInfoDto) => void;
}) {
  const { persons } = incident;
  return (
    <>
      <h3>Involved persons</h3>
      {Object.entries(persons).map(([k, v]) => (
        <li key={k}>
          <strong>
            <select
              value={v.role}
              onChange={(e) =>
                onUpdate(k, {
                  role: e.target.value as InvolvedPersonInfoDtoRoleEnum,
                })
              }
            >
              <option></option>
              {InvolvedPersonInfoDtoRoleEnumValues.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            :{" "}
          </strong>
          {v.firstName} {v.lastName}
        </li>
      ))}
    </>
  );
}
