import React, { FormEvent, useState } from "react";
import { Incident } from "../../../../shared/incidents";

export function NewIncidentForm({
  onSubmit,
}: {
  onSubmit: (incident: Incident) => void;
}) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ title });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <button>Register</button>
      </div>
    </form>
  );
}
