import * as React from "react";
import { useEffect, useState } from "react";
import { Incident, schema } from "../../../../shared/incidents";
import { z } from "zod";

async function time(number: number) {
  return new Promise((resolve) => setTimeout(resolve, number));
}

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/incidents");
      setIncidents(z.array(schema.Incident).parse(await res.json()));
    })();
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
