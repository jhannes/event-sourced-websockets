import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import {
  IncidentSnapshot,
  MessageFromServer,
} from "../shared/incidents/incident";
import { v4 as uuidv4 } from "uuid";

const app = express();

const server = app.listen(3000);

const wsServer = new WebSocketServer({ noServer: true });
const incidents: IncidentSnapshot[] = [
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

const peers = new Set<WebSocket>();

function sendMessage(peer: WebSocket, message: MessageFromServer) {
  peer.send(JSON.stringify(message));
}

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    sendMessage(socket, incidents);
    socket.onclose = () => peers.delete(socket);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());
      for (const peer of peers) {
        sendMessage(peer, message);
      }
    };
  });
});
