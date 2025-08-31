import React, { useEffect, useState } from "react";
import { IncidentDto } from "../../../../../target/generated-sources/openapi-typescript";

export function IncidentListView() {
  const [incidents, setIncidents] = useState<IncidentDto[]>([]);
  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      setIncidents(JSON.parse(event.data));
    };
  }, []);

  return (
    <>
      <h2>Incidents</h2>
      {incidents.map((i) => (
        <li>{i.summary}</li>
      ))}
      <h2>New incident</h2>
      <form>
        <div>
          <label>
            <strong>Summary: </strong>
            <input type="text" />
          </label>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </>
  );
}
