import React, { useState } from "react";

export function NewIncidentForm() {
  const [description, setDescription] = useState("");

  return (
    <form>
      <div>
        <label>
          <strong>Description: </strong>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button>Submit {description}</button>
      </div>
    </form>
  );
}
