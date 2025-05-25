import {
  IncidentSnapshot,
  InvolvedPersonInfo,
  InvolvedPersonRoleEnum,
  InvolvedPersonRoleEnumValues,
  InvolvedPersonSnapshot,
} from "../../../../shared/incidents";
import React, { FormEvent, useState } from "react";
import { useIncidentsContext } from "./useIncidentsContext";
import { v4 as uuidv4 } from "uuid";

function InvolvedPersonRow({
  person,
  personId,
  incidentId,
}: {
  incidentId: string;
  personId: string;
  person: InvolvedPersonSnapshot;
}) {
  const { sendCommand } = useIncidentsContext();
  const { personInfo } = person;
  const { role, lastName, firstName } = personInfo;

  function handleChangeRole(role: string) {
    /*
    sendCommand({
      incidentId,
      delta: {
        delta: "UpdatePersonInIncident",
        personId,
        personInfo: { role: role as InvolvedPersonRoleEnum },
      },
    });
     */
  }

  return (
    <div>
      <select value={role} onChange={(e) => handleChangeRole(e.target.value)}>
        {InvolvedPersonRoleEnumValues.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      : {lastName}, {firstName}
    </div>
  );
}

export function IncidentView({ incident }: { incident: IncidentSnapshot }) {
  const {
    id,
    info: { title, priority },
    persons,
  } = incident;
  return (
    <>
      <h1>
        {title} (priority: {priority})
      </h1>

      <h2>Involved persons</h2>

      <ul>
        {Object.entries(persons).map(([k, v]) => (
          <li key={k}>
            <InvolvedPersonRow incidentId={id} personId={k} person={v} />
          </li>
        ))}
      </ul>

      <NewInvolvedPerson incidentId={id} />
    </>
  );
}

function NewInvolvedPerson({ incidentId }: { incidentId: string }) {
  const { sendCommand } = useIncidentsContext();
  const [personId, setPersonId] = useState(uuidv4());

  function handleSubmit(personInfo: InvolvedPersonInfo) {
    const delta = "AddPersonToIncident";
    sendCommand({
      incidentId,
      delta: { delta, personId, personInfo },
    });
    setPersonId(uuidv4());
  }

  return <NewInvolvedPersonForm key={personId} onSubmit={handleSubmit} />;
}

function NewInvolvedPersonForm({
  onSubmit,
}: {
  onSubmit: (personInfo: InvolvedPersonInfo) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<InvolvedPersonRoleEnum>();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (role) onSubmit({ firstName, lastName, role });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register involved person</h2>
      <div>
        <label>First name: </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Last name: </label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div>
        <label>Role: </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as InvolvedPersonRoleEnum)}
        >
          <option></option>
          {InvolvedPersonRoleEnumValues.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button disabled={!role || !firstName || !lastName}>Submit</button>
      </div>
    </form>
  );
}
