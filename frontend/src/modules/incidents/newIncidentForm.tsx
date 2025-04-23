import { Incident, uuidv4 } from "../../../../shared/incidents";
import * as React from "react";
import { FormEvent, useState } from "react";

export function NewIncidentForm({
  onNewIncident,
}: {
  onNewIncident: (incident: Incident) => void;
}) {
  const [id, setId] = useState(uuidv4());
  function handleNewIncident(incident: Omit<Incident, "id">) {
    onNewIncident({ ...incident, id });
    setId(uuidv4());
  }

  return (
    <>
      <h2>Report new incident</h2>
      <IncidentForm key={id} onNewIncident={handleNewIncident} />
    </>
  );
}

export function IncidentForm({
  onNewIncident,
}: {
  onNewIncident: (incident: Omit<Incident, "id">) => void;
}) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onNewIncident({ title });
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label>
          <strong>Title: </strong>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </p>
      <p>
        <button>Register</button>
      </p>
    </form>
  );
}
