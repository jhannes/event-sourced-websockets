import React from "react";
import { IncidentDto } from "../../../../../target/generated-sources/openapi-typescript";

export function IncidentItem({ incident }: { incident: IncidentDto }) {
  return (
    <li>
      <select>
        <option></option>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
      </select>{" "}
      {incident.summary}
    </li>
  );
}
