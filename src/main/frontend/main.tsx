import React from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./components/app/application.js";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("app")!).render(
  <HashRouter>
    <Application />
  </HashRouter>,
);
