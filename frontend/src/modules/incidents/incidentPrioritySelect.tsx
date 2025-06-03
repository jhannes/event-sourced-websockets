import React from "react";
import { IncidentPriorityEnum, IncidentPriorityValues } from "./incident";

export function IncidentPrioritySelect({
  value,
  onChange,
}: {
  value: IncidentPriorityEnum | undefined;
  onChange: (priority: IncidentPriorityEnum) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as IncidentPriorityEnum)}
    >
      <option value={""}>(No value)</option>
      {IncidentPriorityValues.map((p) => (
        <option key={p}>{p}</option>
      ))}
    </select>
  );
}
