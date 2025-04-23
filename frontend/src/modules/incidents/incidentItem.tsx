import {
  Incident,
  IncidentDelta,
  IncidentPriority,
  IncidentPriorityValues,
} from "../../../../shared/incidents";
import * as React from "react";

export function IncidentItem({
  incident: { id, title, priority },
  sendCommand,
}: {
  incident: Incident;
  sendCommand: (incidentId: string, delta: IncidentDelta) => void;
}) {
  function handleChangePriority(priority?: IncidentPriority) {
    if (priority) {
      sendCommand(id, { delta: "UpdateIncidentDelta", incident: { priority } });
    }
  }
  return (
    <div>
      {title}{" "}
      <select
        value={priority}
        onChange={(e) =>
          handleChangePriority(e.target.value as IncidentPriority)
        }
      >
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
