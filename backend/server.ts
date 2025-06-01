import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { Incident } from "../shared/incidents";

const incidents: Incident[] = [
  { summary: "Fire from server" },
  { summary: "Traffic from server" },
];

const app = express();
const server = app.listen(3000);

const peers = new Set<WebSocket>();

const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    socket.send(JSON.stringify(incidents));
    socket.onmessage = (event) => {
      for (const peer of peers) {
        peer.send(event.data);
      }
    };
  });
});
