import { IncidentSnapshot } from "../../../../shared/incidents";
import React from "react";

export function IncidentView({ incident }: { incident: IncidentSnapshot }) {
  const {
    info: { title, priority },
  } = incident;
  return (
    <>
      <h1>
        {title} (priority: {priority})
      </h1>

      <NewInvolvedPerson />
    </>
  );
}

function NewInvolvedPerson() {
  return <NewInvolvedPersonForm />;
}

function NewInvolvedPersonForm() {
  return (
    <form>
      <h2>Register involved person</h2>
      <div>
        <label>First name: </label>
        <input />
      </div>
      <div>
        <label>Last name: </label>
        <input />
      </div>
      <div>
        <label>Role: </label>
        <select>
          <option></option>
          {["CALLER", "WITNESS", "SUSPECT"].map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
