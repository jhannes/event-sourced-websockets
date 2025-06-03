import * as React from "react";
import { FormEvent, useState } from "react";
import { Incident } from "./incident";
import { v4 as uuidv4 } from "uuid";

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
