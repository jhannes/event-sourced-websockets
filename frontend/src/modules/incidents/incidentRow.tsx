import { Incident } from "../../../../shared/incidents";
import * as React from "react";

export function IncidentRow({ incident: { summary } }: { incident: Incident }) {
  return (
    <li>
      <select>
        <option>(no priority</option>
        {["HIGH", "MEDIUM", "LOW"].map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <> {summary}</>
    </li>
  );
}
