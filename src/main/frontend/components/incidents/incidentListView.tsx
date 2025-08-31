import { useEffect, useState } from "react";

interface IncidentDto {
  summary: string;
}

export function IncidentListView() {
  const [incidents, setIncidents] = useState<IncidentDto[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setIncidents([{ summary: "Fire" }, { summary: "Traffic incident" }]);
    }, 500);
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
