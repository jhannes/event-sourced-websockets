import React from "react";
import {
  IncidentDtoPriorityEnum,
  IncidentSnapshotDto,
} from "../../../../../target/generated-sources/typescript";

export function IncidentItem({
  incident,
  onPriorityChange,
}: {
  incident: IncidentSnapshotDto;
  onPriorityChange: (value: IncidentDtoPriorityEnum) => void;
}) {
  return (
    <li>
      <select
        value={incident.info.priority}
        onChange={(e) =>
          onPriorityChange(e.target.value as IncidentDtoPriorityEnum)
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
