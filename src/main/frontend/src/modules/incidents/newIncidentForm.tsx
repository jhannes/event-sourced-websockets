import { MessageToServerDto } from "../../../../../../target/generated-sources/openapi-typescript";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function NewIncidentForm({
  sendMessage,
}: {
  sendMessage: (message: MessageToServerDto) => void;
}) {
  const [description, setDescription] = useState("");
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    sendMessage({
      clientTime: new Date(),
      incidentId: uuidv4(),
      delta: { description },
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
