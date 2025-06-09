import {
  IncidentPriorityEnum,
  IncidentPriorityEnumValues,
} from "../../../../shared/incidents";
import React from "react";

export function IncidentPrioritySelect({
  value,
  onChange,
}: {
  value: IncidentPriorityEnum | undefined;
  onChange: (value: IncidentPriorityEnum) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as IncidentPriorityEnum)}
    >
      <option></option>
      {IncidentPriorityEnumValues.map((p) => (
        <option key={p}>{p}</option>
      ))}
    </select>
  );
}
