import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useIncidentsContext } from "./useIncidentsContext";
import { IncidentView } from "./incidentView";

function useIncidentSnapshot(incidentId: string | undefined) {
  const { sendMessage, snapshots } = useIncidentsContext();
  useEffect(() => {
    if (!incidentId) return;
    sendMessage({ request: "IncidentSubscribeRequest", incidentId });
    return () =>
      sendMessage({ request: "IncidentUnsubscribeRequest", incidentId });
  }, [incidentId, sendMessage]);
  return useMemo(
    () => (incidentId ? snapshots[incidentId] : undefined),
    [snapshots],
  );
}

export function SingleIncidentRoute() {
  const { id } = useParams();
  const incident = useIncidentSnapshot(id);
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
