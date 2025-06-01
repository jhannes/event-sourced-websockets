import { useParams } from "react-router-dom";
import { useIncidentContext } from "./incidentContext";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { InvolvedPerson } from "../../../../shared/incidents";
import { NewInvolvedPersonForm } from "./newInvolvedPersonForm";

function NewInvolvedPerson({ incidentId }: { incidentId: string }) {
  const { sendCommand } = useIncidentContext();
  const [personId, setPersonId] = useState(uuidv4());
  function handleSubmit(person: InvolvedPerson) {
    sendCommand(incidentId, { type: "AddPersonToIncident", personId, person });
    setPersonId(uuidv4());
  }
  return <NewInvolvedPersonForm key={personId} onSubmit={handleSubmit} />;
}

export function IncidentDetails() {
  const { incidentId } = useParams();
  const { incidents } = useIncidentContext();
  const incident = incidents.find((o) => o.incidentId === incidentId);
  if (!incident || !incidentId) return null;

  const {
    info: { summary, priority },
  } = incident;

  return (
    <>
      <h1 title={incidentId}>{summary}</h1>
      <div>Priority: {priority}</div>

      <h2>Involved persons</h2>

      <ul>
        {Object.keys(incident.persons).map((id) => {
          const { firstName, lastName, role } = incident.persons[id];
          return (
            <li key={id}>
              {role}: {lastName}, {firstName}
            </li>
          );
        })}
      </ul>
      <h2>New involved person</h2>

      <NewInvolvedPerson incidentId={incidentId} />
    </>
  );
}
