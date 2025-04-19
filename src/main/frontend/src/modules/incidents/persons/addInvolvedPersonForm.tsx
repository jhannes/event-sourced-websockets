import React, { FormEvent, useState } from "react";
import { InvolvedPersonInfoDto } from "../../../../../../../target/generated-sources/openapi-typescript";

export function AddInvolvedPersonForm({
  onAddPerson,
}: {
  onAddPerson: (person: InvolvedPersonInfoDto) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onAddPerson({ firstName, lastName });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add involved person</h3>

      <div>
        <label>
          <strong>First name: </strong>
          <input
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <strong>Last name: </strong>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
