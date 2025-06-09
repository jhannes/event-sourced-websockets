import React from "react";
import {
  InvolvedPersonRoleEnum,
  InvolvedPersonRoleEnumValues,
} from "../../../../../shared/incidents";

export function PersonRoleSelect({
  value,
  onChange,
  includeBlank = false,
}: {
  includeBlank?: boolean;
  value: InvolvedPersonRoleEnum | undefined;
  onChange: (value: InvolvedPersonRoleEnum) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as InvolvedPersonRoleEnum)}
    >
      {includeBlank && <option></option>}
      {InvolvedPersonRoleEnumValues.map((role) => (
        <option key={role}>{role}</option>
      ))}
    </select>
  );
}
