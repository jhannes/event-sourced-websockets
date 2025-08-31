import React from "react";
import { IncidentSnapshotDto } from "../../../../../target/generated-sources/openapi-typescript";

export function IncidentItem({ incident }: { incident: IncidentSnapshotDto }) {
  return (
    <li>
      <select>
        <option></option>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
      </select>{" "}
      {incident.info.summary}
    </li>
  );
}
