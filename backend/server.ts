import express from "express";
import { WebSocket, WebSocketServer } from "ws";

const incidents = [
  { title: "Fire from server" },
  { title: "Traffic from server" },
];

const app = express();
const server = app.listen(3000);

const peers: WebSocket[] = [];
const wsServer = new WebSocketServer({ noServer: true });

function broadcastMessage(incident: unknown) {
  for (const peer of peers) {
    peer.send(JSON.stringify(incident));
  }
}

function handleMessageToServer(incident: any) {
  incidents.push(incident);
  broadcastMessage(incident);
}

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.push(socket);
    socket.send(JSON.stringify(incidents));
    socket.onmessage = (event) => {
      handleMessageToServer(JSON.parse(event.data.toString()));
    };
  });
});
