import {
  IncidentSnapshot,
  InvolvedPerson,
  InvolvedPersonRole,
  InvolvedPersonRoleValues,
  uuidv4,
} from "../../../../shared/incidents";
import React, { useContext, useState } from "react";
import { NewPersonForm } from "./newPersonForm";
import { IncidentContext } from "./incidentContext";

function InvolvedPersonItem({
  person,
  onChangeRole,
}: {
  person: InvolvedPerson;
  onChangeRole(role: InvolvedPersonRole): void;
}) {
  const { firstName, lastName, role } = person;

  return (
    <li>
      {firstName} {lastName}{" "}
      <select
        value={role}
        onChange={(e) => onChangeRole(e.target.value as InvolvedPersonRole)}
      >
        {InvolvedPersonRoleValues.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </li>
  );
}

export function IncidentDetailView({
  incident: { id, info, persons },
}: {
  incident: IncidentSnapshot;
}) {
  const { sendCommand } = useContext(IncidentContext);
  const [personId, setPersonId] = useState(uuidv4());

  function handleNewPerson(person: InvolvedPerson) {
    sendCommand(id, { delta: "AddPersonToIncident", personId, person });
    setPersonId(uuidv4());
  }

  function updatePerson(personId: string, person: Partial<InvolvedPerson>) {
    sendCommand(id, { delta: "UpdatePersonInIncident", personId, person });
  }

  const { title, priority } = info;

  return (
    <>
      <h1>Incident: {title}</h1>
      <p>
        <strong>Priority: </strong> {priority}
      </p>
      <h2>Involved persons</h2>
      <ul>
        {Object.entries(persons).map(([k, v]) => (
          <InvolvedPersonItem
            key={k}
            person={v}
            onChangeRole={(role) => updatePerson(k, { role })}
          />
        ))}
      </ul>
      <h2>Add person</h2>
      <NewPersonForm key={personId} onNewPerson={handleNewPerson} />
    </>
  );
}
