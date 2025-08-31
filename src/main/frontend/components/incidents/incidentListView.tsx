import React, { useEffect, useState } from "react";
import {
  DefaultApi,
  IncidentDto,
} from "../../../../../target/generated-sources/openapi-typescript";

export function IncidentListView() {
  const [incidents, setIncidents] = useState<IncidentDto[]>([]);
  useEffect(() => {
    const api = new DefaultApi();
    api.apiIncidentsGet().then((incidents) => setIncidents(incidents));
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
