import React from "react";

export function IncidentItem({}: {}) {
  return (
    <li>
      <select>
        <option></option>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
      </select>{" "}
      <span>TODO: INCIDENT NAME</span>
    </li>
  );
}
