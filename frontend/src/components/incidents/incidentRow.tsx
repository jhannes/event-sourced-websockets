import { Incident } from "../../incidents";
import React from "react";

export function IncidentRow({ incident }: { incident: Incident }) {
  return (
    <div>
      <select>
        <option></option>
        {["HIGH", "MEDIUM", "LOW"].map((priority) => (
          <option key={priority}>{priority}</option>
        ))}
      </select>{" "}
      {incident.title}
    </div>
  );
}
