import React, { FormEvent, useContext, useState } from "react";
import { IncidentContext } from "../incidentContext";
import { v4 as uuidv4 } from "uuid";

export function AddInvolvedPersonForm({ incidentId }: { incidentId: string }) {
  const { sendMessage } = useContext(IncidentContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage({
      type: "IncidentCommand",
      clientTime: new Date(),
      incidentId,
      delta: {
        delta: "AddPersonToIncidentDelta",
        personId: uuidv4(),
        info: { firstName, lastName },
      },
    });
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
