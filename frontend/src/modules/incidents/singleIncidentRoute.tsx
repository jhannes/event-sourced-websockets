import React, { useState } from "react";
import { Incident, IncidentDelta, uuidv4 } from "../../../../shared/incidents";
import { useParams } from "react-router-dom";
import { NewPersonForm } from "./newPersonForm";

function IncidentDetailView({
  incident,
}: {
  incident: Incident;
  sendCommand: (incidentId: string, delta: IncidentDelta) => void;
}) {
  const { title, priority } = incident;
  const [id, setId] = useState(uuidv4());

  function handleNewPerson() {}

  return (
    <>
      <h1>Incident: {title}</h1>
      <p>
        <strong>Priority: </strong> {priority}
      </p>
      <h2>Involved persons</h2>
      <h2>Add person</h2>
      <NewPersonForm key={id} onNewPerson={handleNewPerson} />
    </>
  );
}

export function SingleIncidentRoute({
  incidents,
  sendCommand,
}: {
  incidents: Incident[];
  sendCommand: (incidentId: string, delta: IncidentDelta) => void;
}) {
  const { id } = useParams();
  const incident = incidents.find((o) => o.id === id);
  if (!incident) return null;
  return <IncidentDetailView incident={incident} sendCommand={sendCommand} />;
}
