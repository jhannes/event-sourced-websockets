import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { Incident } from "../incidents/incident";
import { IncidentPrioritySelect } from "../incidents/incidentPrioritySelect";

const allIncidents = [{ summary: "Fire" }, { summary: "Traffic" }];

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  useEffect(() => {
    setTimeout(() => setIncidents(allIncidents), 1000);
  }, []);

  function handleNewIncident(incident: Incident) {
    setIncidents((old) => [...old, incident]);
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <li>
          <IncidentPrioritySelect /> {i.summary}
        </li>
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
