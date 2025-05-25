import React from "react";
import { IncidentSnapshot } from "../../../../shared/incidents";

export function IncidentRow({ incident }: { incident: IncidentSnapshot }) {
  const {
    info: { title },
  } = incident;
  return (
    <div>
      <select>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
        <option></option>
      </select>{" "}
      {title}
    </div>
  );
}
