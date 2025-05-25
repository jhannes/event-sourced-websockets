import React from "react";
import {
  IncidentPriorityEnum,
  IncidentPriorityEnumValues,
  IncidentSummary,
} from "../../../../shared/incidents";
import { useIncidentsContext } from "./useIncidentsContext";
import { Link } from "react-router-dom";

export function IncidentRow({ incident }: { incident: IncidentSummary }) {
  const { sendCommand } = useIncidentsContext();
  const {
    id: incidentId,
    info: { title, priority },
  } = incident;

  function handleChangePriority(value: string) {
    const priority = value as IncidentPriorityEnum;
    sendCommand({
      incidentId,
      delta: { delta: "UpdateIncidentDelta", info: { priority } },
    });
  }

  return (
    <div>
      <select
        value={priority}
        onChange={(e) => handleChangePriority(e.target.value)}
      >
        <option></option>
        {IncidentPriorityEnumValues.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>{" "}
      <Link to={`/incidents/${incidentId}`}>{title}</Link>
    </div>
  );
}
