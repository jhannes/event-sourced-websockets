import { useParams } from "react-router-dom";
import { useIncidentContext } from "./incidentContext";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  IncidentSnapshot,
  InvolvedPerson,
  InvolvedPersonRoleEnum,
} from "../../../../shared/incidents";
import { NewInvolvedPersonForm } from "./newInvolvedPersonForm";
import { PersonRoleSelect } from "./personRoleSelect";

export function IncidentRoute() {
  const { incidentId } = useParams();
  const { incidents } = useIncidentContext();
  const incident = incidents.find((o) => o.incidentId === incidentId);
  if (!incident) return null;

  return <IncidentDetails incident={incident} />;
}

function IncidentDetails({ incident }: { incident: IncidentSnapshot }) {
  const { sendCommand } = useIncidentContext();

  const {
    incidentId,
    info: { summary, priority },
  } = incident;
  const [personId, setPersonId] = useState(uuidv4());

  function handleSubmitPerson(person: InvolvedPerson) {
    sendCommand(incidentId, { type: "AddPersonToIncident", personId, person });
    setPersonId(uuidv4());
  }

  function handleChangeRole(personId: string, role: InvolvedPersonRoleEnum) {
    const type = "UpdatePersonInIncident";
    sendCommand(incidentId!, { type, personId, person: { role } });
  }

  return (
    <>
      <h1 title={incidentId}>{summary}</h1>
      <div>Priority: {priority}</div>

      <h2>Involved persons</h2>

      <ul>
        {Object.keys(incident.persons).map((id) => {
          const { firstName, lastName, role } = incident.persons[id];
          return (
            <li key={id}>
              <PersonRoleSelect
                value={role}
                onChange={(r) => handleChangeRole(id, r)}
              />
              : {lastName}, {firstName}
            </li>
          );
        })}
      </ul>
      <h2>New involved person</h2>

      <NewInvolvedPersonForm onSubmit={handleSubmitPerson} />
    </>
  );
}
