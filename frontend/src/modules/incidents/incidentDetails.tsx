import { useParams } from "react-router-dom";
import { useIncidentContext } from "./incidentContext";
import React from "react";

export function IncidentDetails() {
  const { incidentId } = useParams();
  const { incidents } = useIncidentContext();
  const incident = incidents.find((o) => o.incidentId === incidentId);
  if (!incident) return null;

  const {
    info: { summary, priority },
  } = incident;

  return (
    <>
      <h1 title={incidentId}>{summary}</h1>
      <div>Priority: {priority}</div>
    </>
  );
}
