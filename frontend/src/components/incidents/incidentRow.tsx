import React from "react";
import {
  IncidentCommand,
  IncidentPriority,
  IncidentPriorityEnumValues,
  IncidentSummary,
} from "../../../../shared/incidents";

export function IncidentRow({
  incident: {
    incidentId,
    info: { priority, title },
  },
  sendCommand,
}: {
  incident: IncidentSummary;
  sendCommand: (command: Pick<IncidentCommand, "incidentId" | "delta">) => void;
}) {
  function handleChangePriority(value: string) {
    const priority = value as IncidentPriority;
    sendCommand({
      incidentId,
      delta: { type: "UpdateIncident", info: { priority } },
    });
  }

  return (
    <div>
      <select
        value={priority}
        onChange={(event) => handleChangePriority(event.target.value)}
      >
        <option></option>
        {IncidentPriorityEnumValues.map((priority) => (
          <option key={priority}>{priority}</option>
        ))}
      </select>{" "}
      {title}
    </div>
  );
}
