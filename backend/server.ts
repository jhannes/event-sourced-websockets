import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { IncidentSnapshot } from "../shared/incidents/incident";
import { v4 as uuidv4 } from "uuid";

const allIncidents: IncidentSnapshot[] = [
  {
    incidentId: uuidv4(),
    updatedAt: new Date(),
    incident: { summary: "Fire on the server" },
  },
  {
    incidentId: uuidv4(),
    updatedAt: new Date(),
    incident: { summary: "Traffic on the server" },
  },
];

const app = express();
const server = app.listen(3000);

const peers = new Set<WebSocket>();
const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    socket.send(JSON.stringify(allIncidents));
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());
      for (const peer of peers) {
        peer.send(JSON.stringify(message));
      }
    };
  });
});
