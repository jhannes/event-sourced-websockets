import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IncidentContext } from "./incidentContext";

export function NewIncidentForm() {
  const { sendMessage } = useContext(IncidentContext);
  const [description, setDescription] = useState("");
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    sendMessage({
      type: "IncidentCommand",
      clientTime: new Date(),
      incidentId: uuidv4(),
      delta: { delta: "CreateIncidentDelta", info: { description } },
    });
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <strong>Description: </strong>{" "}
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
