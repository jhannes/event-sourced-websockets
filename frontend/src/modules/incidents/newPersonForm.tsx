import React, { useState } from "react";
import {
  InvolvedPerson,
  InvolvedPersonRole,
  InvolvedPersonRoleValues,
} from "../../../../shared/incidents";

export function NewPersonForm({
  onNewPerson,
}: {
  onNewPerson: (person: InvolvedPerson) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<InvolvedPersonRole | "">("");

  function handleSubmit() {
    if (role) onNewPerson({ firstName, lastName, role });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <strong>First name: </strong>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Last name: </strong>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Role: </strong>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as InvolvedPersonRole)}
          >
            <option />
            {InvolvedPersonRoleValues.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <button disabled={!role}>Add person</button>
      </div>
    </form>
  );
}
