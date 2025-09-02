import React, { FormEvent, useState } from "react";
import { IncidentDto } from "../../../../../target/generated-sources/typescript";

export function NewIncidentForm({
  onNewIncident,
}: {
  onNewIncident: (incident: IncidentDto) => void;
}) {
  const [description, setDescription] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onNewIncident({ description });
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <strong>Description: </strong>
          <input
            autoFocus
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
