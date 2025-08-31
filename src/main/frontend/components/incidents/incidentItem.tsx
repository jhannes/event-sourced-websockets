import React from "react";
import {
  IncidentInfoDto,
  IncidentInfoDtoPriorityEnum,
  IncidentSnapshotDto,
} from "../../../../../target/generated-sources/openapi-typescript";

export function IncidentItem({
  incident,
  onUpdate,
}: {
  incident: IncidentSnapshotDto;
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
      {incident.info.summary}
    </li>
  );
}
