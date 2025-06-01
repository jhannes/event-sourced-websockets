import * as React from "react";
import { createRoot } from "react-dom/client";
import { IncidentContextProvider } from "./modules/incidents/incidentContext";
import { BrowserRouter } from "react-router-dom";
import { Application } from "./modules/app/application";

createRoot(document.getElementById("app")!).render(
  <BrowserRouter>
    <IncidentContextProvider>
      <Application />
    </IncidentContextProvider>
  </BrowserRouter>,
);
