import React from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./components/app/application";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("app")!).render(
  <BrowserRouter>
    <Application />
  </BrowserRouter>,
);
