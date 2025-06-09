import { IncidentSnapshot } from "../../../../shared/incidents";
import React from "react";
import { Link } from "react-router-dom";
import { InvolvedPersonRow } from "./person/involvedPersonRow";
import { NewInvolvedPerson } from "./person/newInvolvedPerson";

export function IncidentView({ incident }: { incident: IncidentSnapshot }) {
  const {
    id,
    info: { title, priority },
    persons,
  } = incident;
  return (
    <>
      <h1>
        {title} (priority: {priority})
      </h1>
      <p>
        <Link to={"/"}>See all</Link>
      </p>

      <h2>Involved persons</h2>
      <ul>
        {Object.entries(persons).map(([k, v]) => (
          <li key={k}>
            <InvolvedPersonRow incidentId={id} personId={k} person={v} />
          </li>
        ))}
      </ul>
      <NewInvolvedPerson incidentId={id} />
    </>
  );
}
