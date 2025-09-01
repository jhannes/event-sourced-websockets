import React from "react";
import {
  IncidentInfoDto,
  IncidentInfoDtoPriorityEnum,
  IncidentSnapshotDto,
} from "../../../../../target/generated-sources/typescript";

export function IncidentItem({
  incident,
  onChange,
}: {
  incident: IncidentSnapshotDto;
  onChange: (info: IncidentInfoDto) => void;
}) {
  return (
    <li>
      <select
        value={incident.info.priority}
        onChange={(e) =>
          onChange({
            priority: e.target.value as IncidentInfoDtoPriorityEnum,
          })
        }
      >
        <option></option>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
      </select>{" "}
      <span>{incident.info.description}</span>
    </li>
  );
}
