import {
  IncidentPriorityEnum,
  IncidentPriorityValues,
  IncidentSnapshot,
} from "../../../../shared/incidents";
import * as React from "react";
import { useIncidentContext } from "./incidentContext";
import { Link } from "react-router-dom";

export function IncidentRow({
  incident: {
    incidentId,
    info: { summary, priority },
  },
}: {
  incident: IncidentSnapshot;
}) {
  const { sendCommand } = useIncidentContext();

  function handleChange(priority: string) {
    const info = { priority: priority as IncidentPriorityEnum };
    sendCommand(incidentId, { type: "UpdateIncident", info });
  }

  return (
    <li>
      <select value={priority} onChange={(e) => handleChange(e.target.value)}>
        <option value={""}>(no priority)</option>
        {IncidentPriorityValues.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <>
        {" "}
        <Link to={`/incidents/${incidentId}`}>{summary}</Link>
      </>
    </li>
  );
}
