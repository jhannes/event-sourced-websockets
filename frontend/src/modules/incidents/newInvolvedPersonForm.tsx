import {
  InvolvedPerson,
  InvolvedPersonRoleEnum,
} from "../../../../shared/incidents";
import React, { FormEvent, useState } from "react";
import { PersonRoleSelect } from "./personRoleSelect";

export function NewInvolvedPersonForm({
  onSubmit,
}: {
  onSubmit(person: InvolvedPerson): void;
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
      <div>
        <label>
          First name:{" "}
          <input
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Last name:{" "}
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Role: <PersonRoleSelect value={role} onChange={(r) => setRole(r)} />
        </label>
      </div>
      <div>
        <button disabled={!lastName || !firstName || !role}>Submit</button>
      </div>
    </form>
  );
}
