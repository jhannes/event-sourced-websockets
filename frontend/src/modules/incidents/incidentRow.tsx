import {
  Incident,
  IncidentPriorityEnum,
  IncidentPriorityValues,
  IncidentSnapshot,
} from "../../../../shared/incidents";
import * as React from "react";

export function IncidentRow({
  incident: {
    incidentId,
    info: { summary, priority },
  },
  onChangePriority,
}: {
  incident: IncidentSnapshot;
  onChangePriority(id: string, priority: IncidentPriorityEnum): void;
}) {
  function handleChange(priority: string) {
    onChangePriority(incidentId, priority as IncidentPriorityEnum);
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
