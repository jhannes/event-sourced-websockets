import {
  IncidentPriority,
  IncidentPriorityValues,
  IncidentSnapshot,
} from "../../../../shared/incidents";
import * as React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { IncidentContext } from "./incidentContext";

export function IncidentItem({
  incident: {
    id,
    info: { title, priority },
  },
}: {
  incident: IncidentSnapshot;
}) {
  const { sendCommand } = useContext(IncidentContext);
  function handleChangePriority(priority?: IncidentPriority) {
    if (priority) {
      sendCommand(id, { delta: "UpdateIncidentDelta", incident: { priority } });
    }
  }
  return (
    <div>
      <Link to={`/incidents/${id}`}>{title} </Link>
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
