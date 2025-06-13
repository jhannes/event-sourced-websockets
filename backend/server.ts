import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IncidentSnapshot } from "../shared/incident";

const allIncidents: IncidentSnapshot[] = [
  {
    incidentId: uuidv4(),
    updatedAt: new Date(),
    incident: { summary: "Fire on server" },
  },
  {
    incidentId: uuidv4(),
    updatedAt: new Date(),
    incident: { summary: "Traffic accident on server" },
  },
];

const app = express();

const server = app.listen(3000);

const peers = new Set<WebSocket>();
const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, head, socket) => {
  wsServer.handleUpgrade(req, head, socket, (socket) => {
    socket.send(JSON.stringify(allIncidents));
    peers.add(socket);

    socket.onmessage = (event) => {
      for (const peer of peers) {
        peer.send(event.data);
      }
    };
  });
});
