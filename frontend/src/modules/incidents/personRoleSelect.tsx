import {
  InvolvedPersonRoleEnum,
  InvolvedPersonRoleValues,
} from "../../../../shared/incidents";
import React from "react";

export function PersonRoleSelect({
  value,
  onChange,
}: {
  value: InvolvedPersonRoleEnum | undefined;
  onChange: (r: InvolvedPersonRoleEnum) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as InvolvedPersonRoleEnum)}
    >
      <option value={""}>(Not specified)</option>
      {InvolvedPersonRoleValues.map((r) => (
        <option key={r}>{r}</option>
      ))}
    </select>
  );
}
