import { Incident, IncidentPriorityValues } from "../../../../shared/incidents";
import * as React from "react";

export function IncidentItem({
  incident: { title, priority },
}: {
  incident: Incident;
}) {
  return (
    <div>
      {title}{" "}
      <select value={priority}>
        <option></option>
        {IncidentPriorityValues.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
