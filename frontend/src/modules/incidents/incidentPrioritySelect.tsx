import * as React from "react";

export function IncidentPrioritySelect() {
  return (
    <select>
      <option></option>
      {["HIGH", "MEDIUM", "LOW"].map((p) => (
        <option key={p}>{p}</option>
      ))}
    </select>
  );
}
