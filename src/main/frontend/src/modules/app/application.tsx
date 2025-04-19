import React from "react";
import { IncidentContext } from "../incidents/incidentContext";
import { useIncidents } from "../incidents/useIncidents";
import { IncidentsList } from "../incidents/incidentsList";
import { BrowserRouter, Route, Routes } from "react-router";
import { IncidentView } from "../incidents/incidentView";

export function Application() {
  const { incidents, sendMessage } = useIncidents();

  return (
    <IncidentContext value={{ sendMessage }}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<IncidentsList incidents={incidents} />} />
          <Route
            path={"/incidents/:id"}
            element={<IncidentView incidents={incidents} />}
          />
          <Route path={"*"} element={<h1>Not found</h1>} />
        </Routes>
      </BrowserRouter>
    </IncidentContext>
  );
}
