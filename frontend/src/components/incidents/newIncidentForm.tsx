import React, { FormEvent, useState } from "react";
import { IncidentInfo } from "../../../../shared/incidents";

export function NewIncidentForm({
  onNewIncident,
}: {
  onNewIncident: (incident: IncidentInfo) => void;
}) {
  const [title, setTitle] = useState("");

  function handleSubmitNew(event: FormEvent) {
    event.preventDefault();
    onNewIncident({ title });
  }

  return (
    <form onSubmit={handleSubmitNew}>
      <div>
        <label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <button>Register</button>
      </div>
    </form>
  );
}
