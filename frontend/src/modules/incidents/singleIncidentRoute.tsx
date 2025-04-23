import React, { useState } from "react";
import {
  IncidentDelta,
  IncidentSnapshot,
  InvolvedPerson,
  uuidv4,
} from "../../../../shared/incidents";
import { useParams } from "react-router-dom";
import { NewPersonForm } from "./newPersonForm";

function IncidentDetailView({
  incident: { id, info },
  sendCommand,
}: {
  incident: IncidentSnapshot;
  sendCommand: (incidentId: string, delta: IncidentDelta) => void;
}) {
  const [personId, setPersonId] = useState(uuidv4());

  function handleNewPerson(person: InvolvedPerson) {
    sendCommand(id, { delta: "AddPersonToIncident", personId, person });
    setPersonId(uuidv4());
  }

  const { title, priority } = info;
  return (
    <>
      <h1>Incident: {title}</h1>
      <p>
        <strong>Priority: </strong> {priority}
      </p>
      <h2>Involved persons</h2>
      <h2>Add person</h2>
      <NewPersonForm key={personId} onNewPerson={handleNewPerson} />
    </>
  );
}

export function SingleIncidentRoute({
  incidents,
  sendCommand,
}: {
  incidents: IncidentSnapshot[];
  sendCommand: (incidentId: string, delta: IncidentDelta) => void;
}) {
  const { id } = useParams();
  const incident = incidents.find((o) => o.id === id);
  if (!incident) return null;
  return <IncidentDetailView incident={incident} sendCommand={sendCommand} />;
}
