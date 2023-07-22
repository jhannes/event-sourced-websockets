import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./modules/application/application";

const reactDom = ReactDOM.createRoot(document.getElementById("root")!);
reactDom.render(<Application />);
export { useWebSocket } from "./modules/hooks/useWebSocket";
