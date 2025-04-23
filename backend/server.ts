import { Incident, schema, uuidv4 } from "../shared/incidents";
import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const incidents: Incident[] = [
  { id: uuidv4(), title: "Fire from the server", priority: "HIGH" },
  { id: uuidv4(), title: "Traffic Accident from the server" },
];

const app = express();

app.get("/api/incidents", (req, res) => {
  res.json(incidents);
});

const server = app.listen(process.env.PORT || 3000);

const peers = new Set<WebSocket>();
const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    socket.send(JSON.stringify(incidents));
    socket.onmessage = (event) => {
      const message = schema.Incident.parse(JSON.parse(event.data.toString()));
      for (const peer of peers) {
        peer.send(JSON.stringify(message));
      }
    };
  });
});
