import { Incident } from "./newIncidentForm";
import React from "react";

export function IncidentRow({ incident }: { incident: Incident }) {
  return (
    <div>
      <select>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
        <option></option>
      </select>{" "}
      {incident.title}
    </div>
  );
}
