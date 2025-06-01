import * as React from "react";
import { useEffect, useState } from "react";

interface Incident {
  summary: string;
}

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setIncidents([{ summary: "Fire" }, { summary: "Traffic" }]);
    }, 2000);
  }, []);

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <li>{i.summary}</li>
      ))}

      <h2>Create incident</h2>
      <form>
        <div>
          <label>
            Description: <input type="text" />
          </label>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </>
  );
}
