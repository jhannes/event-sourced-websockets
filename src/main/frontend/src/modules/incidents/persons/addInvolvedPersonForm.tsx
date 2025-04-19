import React, { FormEvent, useState } from "react";
import {
  InvolvedPersonInfoDto,
  InvolvedPersonInfoDtoRoleEnum,
  InvolvedPersonInfoDtoRoleEnumValues,
} from "../../../../../../../target/generated-sources/openapi-typescript";

export function AddInvolvedPersonForm({
  onAddPerson,
}: {
  onAddPerson: (person: InvolvedPersonInfoDto) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<InvolvedPersonInfoDtoRoleEnum>();
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onAddPerson({ firstName, lastName, role });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add involved person</h3>

      <div>
        <label>
          <strong>First name: </strong>
          <input
            autoFocus
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
            onChange={(e) =>
              setRole(e.target.value as InvolvedPersonInfoDtoRoleEnum)
            }
          >
            <option></option>
            {InvolvedPersonInfoDtoRoleEnumValues.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
