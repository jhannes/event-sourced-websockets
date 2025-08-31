import {
  PersonInfoDto,
  PersonInfoDtoRoleEnum,
  PersonInfoDtoRoleEnumValues,
} from "../../../../../target/generated-sources/openapi-typescript";
import React, { FormEvent, useState } from "react";

export function AddPersonToIncidentForm({
  onNewPerson,
}: {
  onNewPerson: (info: PersonInfoDto) => void;
}) {
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [role, setRole] = useState<"" | PersonInfoDtoRoleEnum>();
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (role) onNewPerson({ givenName, familyName, role });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <strong>Given name:</strong>
        <br />
        <input
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
        />
      </div>
      <div>
        <strong>Family name:</strong>
        <br />
        <input
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
        />
      </div>
      <div>
        <strong>Role:</strong>
        <br />
        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "" | PersonInfoDtoRoleEnum)
          }
        >
          <option></option>
          {PersonInfoDtoRoleEnumValues.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
