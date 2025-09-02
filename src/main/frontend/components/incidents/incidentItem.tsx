import React from "react";
import {
  IncidentDtoPriorityEnum,
  IncidentSnapshotDto,
} from "../../../../../target/generated-sources/typescript";

export function IncidentItem({
  incident,
  onChangePriority,
}: {
  incident: IncidentSnapshotDto;
  onChangePriority: (priority: IncidentDtoPriorityEnum) => void;
}) {
  return (
    <li>
      <select
        value={incident.info.priority}
        onChange={(e) =>
          onChangePriority(e.target.value as IncidentDtoPriorityEnum)
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
