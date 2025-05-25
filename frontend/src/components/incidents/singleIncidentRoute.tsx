import React from "react";
import { Link, useParams } from "react-router-dom";
import { useIncidentsContext } from "./useIncidentsContext";
import { IncidentView } from "./incidentView";

export function SingleIncidentRoute() {
  const { id } = useParams();
  const { incidents } = useIncidentsContext();
  if (incidents.length === 0) return null;
  const incident = incidents.find((o) => o.id === id);
  if (!incident)
    return (
      <>
        <h1>Not found: {id}</h1>
        <p>
          <Link to={"/"}>Return</Link>
        </p>
      </>
    );

  return <IncidentView incident={incident} />;
}
