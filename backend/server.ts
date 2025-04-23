import { Incident, uuidv4 } from "../shared/incidents";
import express from "express";

const incidents: Incident[] = [
  { id: uuidv4(), title: "Fire from the server" },
  { id: uuidv4(), title: "Traffic Accident from the server" },
];

const app = express();

app.get("/api/incidents", (req, res) => {
  res.json(incidents);
});

app.listen(process.env.PORT || 3000);
