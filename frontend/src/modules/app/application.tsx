import * as React from "react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const Incident = z.object({
  id: z.string(),
  title: z.string(),
  priority: z.optional(z.enum(["HIGH", "MEDIUM", "LOW"])),
});

type Incident = z.infer<typeof Incident>;

async function time(number: number) {
  return new Promise((resolve) => setTimeout(resolve, number));
}

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    (async () => {
      await time(1000);
      setIncidents([
        { id: uuidv4(), title: "Fire" },
        { id: uuidv4(), title: "Traffic Accident" },
      ]);
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
