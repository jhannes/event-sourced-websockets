import React from "react";
import { IncidentContext } from "../incidents/incidentContext";
import { useIncidents } from "../incidents/useIncidents";
import { IncidentsList } from "../incidents/incidentsList";
import { BrowserRouter, Route, Routes } from "react-router";
import { IncidentViewRoute } from "../incidents/incidentView";

export function Application() {
  const { incidents, sendMessage, isConnected } = useIncidents();

  return (
    <IncidentContext value={{ sendMessage, isConnected }}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<IncidentsList incidents={incidents} />} />
          <Route
            path={"/incidents/:id"}
            element={<IncidentViewRoute incidents={incidents} />}
          />
          <Route path={"*"} element={<h1>Not found</h1>} />
        </Routes>
      </BrowserRouter>
    </IncidentContext>
  );
}
