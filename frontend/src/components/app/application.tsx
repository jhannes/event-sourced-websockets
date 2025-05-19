import React, { useEffect, useState } from "react";

interface Incident {
  title: string;
}

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  useEffect(() => {
    setTimeout(
      () => setIncidents([{ title: "Fire" }, { title: "Traffic" }]),
      2000,
    );
  }, []);

  return (
    <div>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((i, index) => (
          <li key={index}>{i.title}</li>
        ))}
      </ul>

      <h2>New incident</h2>
      <form>
        <div>
          <label>
            <input />
          </label>
        </div>
        <div>
          <button>Register</button>
        </div>
      </form>
    </div>
  );
}
