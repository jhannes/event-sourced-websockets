import React from "react";
import { IncidentOverview } from "../incidents/incidentOverview";
import { IncidentsContext } from "../incidents/useIncidentsContext";
import { Route, Routes } from "react-router-dom";
import { SingleIncidentRoute } from "../incidents/singleIncidentRoute";

export function Application() {
  return (
    <IncidentsContext>
      <Routes>
        <Route path={"/"} element={<IncidentOverview />} />
        <Route path={"/incidents/:id"} element={<SingleIncidentRoute />} />
        <Route path={"*"} element={<h1>Not found</h1>} />
      </Routes>
    </IncidentsContext>
  );
}
