import React, { ChangeEvent } from "react";
import {
  IncidentPriorityEnum,
  IncidentSnapshot,
} from "../../../../shared/incidents";
import { incidentsContext } from "./incidentsContext";

export function IncidentRow({ incident }: { incident: IncidentSnapshot }) {
  const { sendCommand } = incidentsContext();
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
