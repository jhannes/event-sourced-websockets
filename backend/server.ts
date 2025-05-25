import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { MessageFromServer, MessageToServer } from "../shared/incidents";

let index = 0;
const incidents = [
  { title: "Fire from server" },
  { title: "Traffic from server" },
];

const app = express();
const server = app.listen(3000);

const wsServer = new WebSocketServer({ noServer: true });
const peers: WebSocket[] = [];

function sendMessage(peer: WebSocket, message: MessageFromServer) {
  peer.send(JSON.stringify(message));
}

function broadcastMessage(message: MessageFromServer) {
  for (const peer of peers) {
    sendMessage(peer, message);
  }
}

function handleMessageFromClient(messageToServer: MessageToServer) {
  const { delta } = messageToServer;
  if (delta.type === "CreateIncident") {
    const { info } = delta;
    incidents.push(info);
  }
  broadcastMessage({
    ...messageToServer,
    serverTime: new Date(),
    sequenceNumber: index++,
  });
}

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    sendMessage(socket, incidents);
    peers.push(socket);
    socket.onmessage = (event) => {
      handleMessageFromClient(JSON.parse(event.data.toString()));
    };
  });
});
