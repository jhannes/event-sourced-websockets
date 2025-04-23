import * as React from "react";
import { useIncidents } from "../incidents/useIncidents";
import { IncidentSummary } from "../incidents/incidentSummary";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleIncidentRoute } from "../incidents/singleIncidentRoute";

export function Application() {
  const { sendCommand, incidents } = useIncidents();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            <IncidentSummary incidents={incidents} sendCommand={sendCommand} />
          }
        />
        <Route
          path={"/incidents/:id"}
          element={
            <SingleIncidentRoute
              incidents={incidents}
              sendCommand={sendCommand}
            />
          }
        />
        <Route path={"*"} element={<h1>Not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
