import {
  IncidentDelta,
  IncidentInfo,
  uuidv4,
} from "../../../../shared/incidents";
import * as React from "react";
import { FormEvent, useContext, useState } from "react";
import { IncidentContext } from "./incidentContext";

export function NewIncidentForm() {
  const { sendCommand } = useContext(IncidentContext);
  const [id, setId] = useState(uuidv4());
  function handleNewIncident(incident: IncidentInfo) {
    sendCommand(id, { delta: "CreateIncidentDelta", incident });
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
  onNewIncident: (incident: IncidentInfo) => void;
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
