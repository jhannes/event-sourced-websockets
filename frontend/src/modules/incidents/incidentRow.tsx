import {
  Incident,
  IncidentPriorityEnum,
  IncidentPriorityValues,
} from "../../../../shared/incidents";
import * as React from "react";

export function IncidentRow({
  incident: { id, summary, priority },
  onChangePriority,
}: {
  incident: Incident;
  onChangePriority(id: string, priority: IncidentPriorityEnum): void;
}) {
  function handleChange(priority: string) {
    onChangePriority(id, priority as IncidentPriorityEnum);
  }

  return (
    <li>
      <select value={priority} onChange={(e) => handleChange(e.target.value)}>
        <option>(no priority</option>
        {IncidentPriorityValues.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <> {summary}</>
    </li>
  );
}
