import React from "react";
import { Incident } from "../../../../shared/incidents";

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
