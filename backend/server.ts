import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import {
  IncidentCommand,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../shared/incidents";
import { v4 as uuidv4 } from "uuid";

const incidents: IncidentSnapshot[] = [
  { incidentId: uuidv4(), info: { summary: "Fire from server" } },
  { incidentId: uuidv4(), info: { summary: "Traffic from server" } },
];

const app = express();
const server = app.listen(3000);

const peers = new Set<WebSocket>();

const wsServer = new WebSocketServer({ noServer: true });

function sendMessage(socket: WebSocket, message: MessageFromServer) {
  socket.send(JSON.stringify(message));
}

function handleMessage(message: MessageToServer) {
  const command: IncidentCommand = message;
  const event = { ...command, serverTime: new Date() };
  for (const peer of peers) {
    sendMessage(peer, event);
  }
}

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    sendMessage(socket, incidents);
    socket.onmessage = (event) => {
      handleMessage(JSON.parse(event.data.toString()) as MessageToServer);
    };
  });
});
