import express from "express";
import { WebSocketServer } from "ws";

const app = express();

const server = app.listen(3000);

const wsServer = new WebSocketServer({ noServer: true });
const incidents = [
  { summary: "Fire on the server" },
  { summary: "Traffic on the server" },
];
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    socket.send(JSON.stringify(incidents));
  });
});
