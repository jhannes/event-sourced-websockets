import * as React from "react";
import { useEffect, useState } from "react";
import { Incident, schema } from "../../../../shared/incidents";
import { z } from "zod";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      setIncidents(z.array(schema.Incident).parse(JSON.parse(event.data)));
    };
  }, []);

  return (
    <>
      <h1>Incidents</h1>
      {incidents.map(({ id, title }) => (
        <div key={id}>{title}</div>
      ))}

      <h2>Report new incident</h2>

      <form>
        <p>
          <label>
            <strong>Title: </strong>
            <input required />
          </label>
        </p>
        <p>
          <button>Register</button>
        </p>
      </form>
    </>
  );
}
