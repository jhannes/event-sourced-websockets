import * as React from "react";
import { FormEvent, useState } from "react";
import { Incident } from "../../../../shared/incidents";

export function NewIncidentForm({
  onNewIncident,
}: {
  onNewIncident: (incident: Omit<Incident, "id">) => void;
}) {
  const [summary, setSummary] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onNewIncident({ summary });
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
