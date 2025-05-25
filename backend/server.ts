import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const incidents = [
  { title: "Fire from server" },
  { title: "Traffic from server" },
];

const app = express();
const server = app.listen(3000);

const peers: WebSocket[] = [];
const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.push(socket);
    socket.send(JSON.stringify(incidents));
    socket.onmessage = (event) => {
      const incident = JSON.parse(event.data.toString());
      for (const peer of peers) {
        peer.send(JSON.stringify(incident));
      }
    };
  });
});
