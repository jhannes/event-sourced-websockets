import { Incident, uuidv4 } from "../shared/incidents";
import express from "express";
import { WebSocketServer } from "ws";

const incidents: Incident[] = [
  { id: uuidv4(), title: "Fire from the server" },
  { id: uuidv4(), title: "Traffic Accident from the server" },
];

const app = express();

app.get("/api/incidents", (req, res) => {
  res.json(incidents);
});

const server = app.listen(process.env.PORT || 3000);

const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    socket.send(JSON.stringify(incidents));
  });
});
