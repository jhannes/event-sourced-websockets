import { Route, Routes } from "react-router-dom";
import { IncidentOverview } from "../incidents/incidentOverview";
import * as React from "react";
import { IncidentDetails } from "../incidents/incidentDetails";

export function Application() {
  return (
    <Routes>
      <Route path={"/"} element={<IncidentOverview />} />
      <Route path={"/incidents/:incidentId"} element={<IncidentDetails />} />
      <Route path={"*"} element={<h1>Not found</h1>} />
    </Routes>
  );
}
