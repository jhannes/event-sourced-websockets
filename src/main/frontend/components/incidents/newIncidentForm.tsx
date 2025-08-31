import React, { FormEvent, useState } from "react";
import { IncidentInfoDto } from "../../../../../target/generated-sources/openapi-typescript";

export function NewIncidentForm({
  onNewIncident,
}: {
  onNewIncident: (value: IncidentInfoDto) => void;
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
