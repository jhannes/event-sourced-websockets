import React from "react";
import {
  IncidentPriorityEnum,
  IncidentSummary,
} from "../../../../shared/incidents";
import { useIncidentsContext } from "./useIncidentsContext";
import { Link } from "react-router-dom";
import { IncidentPrioritySelect } from "./incidentPrioritySelect";

export function IncidentRow({ incident }: { incident: IncidentSummary }) {
  const { sendCommand } = useIncidentsContext();
  const {
    id: incidentId,
    info: { title, priority },
  } = incident;

  function handleChangePriority(priority: IncidentPriorityEnum) {
    sendCommand({
      incidentId,
      delta: { delta: "UpdateIncidentDelta", info: { priority } },
    });
  }

  return (
    <div>
      <IncidentPrioritySelect
        value={priority}
        onChange={handleChangePriority}
      />{" "}
      <Link to={`/incidents/${incidentId}`}>{title}</Link>
    </div>
  );
}
