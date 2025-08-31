import React from "react";
import {
  IncidentInfoDto,
  IncidentInfoDtoPriorityEnum,
  IncidentSummaryDto,
} from "../../../../../target/generated-sources/openapi-typescript";
import { Link } from "react-router-dom";

export function IncidentItem({
  incident,
  onUpdate,
}: {
  incident: IncidentSummaryDto;
  onUpdate: (info: IncidentInfoDto) => void;
}) {
  return (
    <li>
      <select
        onChange={(e) =>
          onUpdate({ priority: e.target.value as IncidentInfoDtoPriorityEnum })
        }
        value={incident.info.priority}
      >
        <option></option>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
      </select>{" "}
      <Link to={`/incidents/${incident.id}`}>{incident.info.summary}</Link>
    </li>
  );
}
