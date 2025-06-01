import * as React from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./modules/app/application";
import { IncidentContextProvider } from "./modules/incidents/incidentContext";

createRoot(document.getElementById("app")!).render(
  <IncidentContextProvider>
    <Application />
  </IncidentContextProvider>,
);
