import React, { ChangeEvent } from "react";
import {
  IncidentCommand,
  IncidentPriorityEnum,
  IncidentSnapshot,
} from "../../../../shared/incidents";

export function IncidentRow({
  incident,
  sendCommand,
}: {
  incident: IncidentSnapshot;
  sendCommand: (command: Pick<IncidentCommand, "incidentId" | "delta">) => void;
}) {
  const {
    id: incidentId,
    info: { title, priority },
  } = incident;

  function handleChangePriority(event: ChangeEvent<HTMLSelectElement>) {
    const priority = event.target.value as IncidentPriorityEnum;
    const delta = "UpdateIncidentDelta";
    sendCommand({ incidentId, delta: { delta, info: { priority } } });
  }

  return (
    <div>
      <select value={priority} onChange={handleChangePriority}>
        <option></option>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
      </select>{" "}
      {title}
    </div>
  );
}
