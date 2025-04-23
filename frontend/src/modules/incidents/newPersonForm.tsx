import React from "react";

export function NewPersonForm({ onNewPerson }: { onNewPerson?: () => void }) {
  return (
    <form>
      <div>
        <label>
          <strong>First name: </strong>
          <input />
        </label>
      </div>
      <div>
        <label>
          <strong>Last name: </strong>
          <input />
        </label>
      </div>
      <div>
        <label>
          <strong>Role: </strong>
          <select />
        </label>
      </div>
    </form>
  );
}
