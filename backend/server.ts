import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Incident } from "../shared/incidents";
import { v4 as uuidv4 } from "uuid";

const app = new Hono();

app.get("/api/incidents", (c) => {
  const incidents: Incident[] = [
    { id: uuidv4(), title: "Fire from the server" },
    { id: uuidv4(), title: "Traffic Accident from the server" },
  ];
  return c.json(incidents);
});

serve(app);
