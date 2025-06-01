import * as React from "react";
import { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { Incident } from "../../../../shared/incidents";

export function Application() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setIncidents([{ summary: "Fire" }, { summary: "Traffic" }]);
    }, 2000);
  }, []);

  function handleNewIncident(incident: Incident) {
    setIncidents((old) => [...old, incident]);
  }

  return (
    <>
      <h1>Incidents</h1>

      {incidents.map((i) => (
        <li>{i.summary}</li>
      ))}

      <h2>Create incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
