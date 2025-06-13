import * as React from "react";
import {
  IncidentPriorityEnum,
  IncidentPriorityValues,
} from "../../../../shared/incidents/incident";

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
      {IncidentPriorityValues.map((p) => (
        <option key={p}>{p}</option>
      ))}
    </select>
  );
}
