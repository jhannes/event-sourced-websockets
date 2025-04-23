import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { IncidentDetailView } from "./incidentDetailView";
import { IncidentContext } from "./incidentContext";

export function SingleIncidentRoute() {
  const { incidents } = useContext(IncidentContext);
  const { id } = useParams();
  const incident = incidents.find((o) => o.id === id);
  if (!incident) return null;
  return <IncidentDetailView incident={incident} />;
}
