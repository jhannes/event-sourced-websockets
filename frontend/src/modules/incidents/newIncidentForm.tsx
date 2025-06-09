import * as React from "react";
import { FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Incident } from "../../../../shared/incidents/incident";

export function NewIncidentForm({
  onNewIncident,
}: {
  onNewIncident: (incident: Incident) => void;
}) {
  const [summary, setSummary] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onNewIncident({ id: uuidv4(), summary });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Description:{" "}
          <input value={summary} onChange={(e) => setSummary(e.target.value)} />
        </label>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
