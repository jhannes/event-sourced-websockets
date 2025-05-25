import express from "express";
import { WebSocketServer } from "ws";

const incidents = [
  { title: "Fire from server" },
  { title: "Traffic from server" },
];

const app = express();
const server = app.listen(3000);

const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    socket.send(JSON.stringify(incidents));
  });
});
