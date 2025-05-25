import express from "express";
import { WebSocket, WebSocketServer } from "ws";

const incidents = [
  { title: "Fire from server" },
  { title: "Traffic from server" },
];

const app = express();
const server = app.listen(3000);

const wsServer = new WebSocketServer({ noServer: true });
const peers: WebSocket[] = [];

function broadcastMessage(messageToServer: any) {
  for (const peer of peers) {
    peer.send(JSON.stringify(messageToServer));
  }
}

function handleMessageFromClient(messageToServer: any) {
  incidents.push(messageToServer);
  broadcastMessage(messageToServer);
}

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    socket.send(JSON.stringify(incidents));
    peers.push(socket);
    socket.onmessage = (event) => {
      handleMessageFromClient(JSON.parse(event.data.toString()));
    };
  });
});
