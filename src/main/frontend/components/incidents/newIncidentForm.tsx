import { IncidentDto } from "../../../../../target/generated-sources/openapi-typescript";
import React, { FormEvent, useState } from "react";

export function NewIncidentForm({
  onNewIncident,
}: {
  onNewIncident: (value: IncidentDto) => void;
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
          <strong>Summary: </strong>
          <input value={summary} onChange={(e) => setSummary(e.target.value)} />
        </label>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
