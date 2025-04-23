import * as React from "react";
import { useIncidents } from "../incidents/useIncidents";
import { IncidentSummary } from "../incidents/incidentSummary";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleIncidentRoute } from "../incidents/singleIncidentRoute";
import { IncidentContext } from "../incidents/incidentContext";

export function Application() {
  const { sendCommand, incidents } = useIncidents();

  return (
    <IncidentContext value={{ sendCommand, incidents }}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<IncidentSummary />} />
          <Route path={"/incidents/:id"} element={<SingleIncidentRoute />} />
          <Route path={"*"} element={<h1>Not found</h1>} />
        </Routes>
      </BrowserRouter>
    </IncidentContext>
  );
}
