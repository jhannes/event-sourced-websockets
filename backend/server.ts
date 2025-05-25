import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const incidents = [
  { title: "Fire from server" },
  { title: "Traffic from server" },
];

const app = express();
const server = app.listen(3000);

const wsServer = new WebSocketServer({ noServer: true });
const peers: WebSocket[] = [];
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    socket.send(JSON.stringify(incidents));
    peers.push(socket);
    socket.onmessage = (event) => {
      const messageToServer = JSON.parse(event.data.toString());
      incidents.push(messageToServer);

      for (const peer of peers) {
        peer.send(event.data);
      }
    };
  });
});
