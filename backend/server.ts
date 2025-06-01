import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import {
  IncidentCommand,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../shared/incidents";

const incidents: IncidentSnapshot[] = [];

const app = express();
const server = app.listen(3000);

const peers = new Set<WebSocket>();

const wsServer = new WebSocketServer({ noServer: true });

function sendMessage(socket: WebSocket, message: MessageFromServer) {
  socket.send(JSON.stringify(message));
}

function handleMessage(message: MessageToServer) {
  const command: IncidentCommand = message;
  const { delta, incidentId, clientTime: updatedAt } = command;
  if (delta.type === "CreateIncident") {
    const { info } = delta;
    incidents.push({ incidentId, info, updatedAt, createdAt: updatedAt });
  } else if (delta.type === "UpdateIncident") {
    for (const o of incidents) {
      if (o.incidentId === incidentId) {
        o.info = { ...o.info, ...delta.info };
        o.updatedAt = updatedAt;
      }
    }
  } else if (delta.type === "AddPersonToIncident") {
    // TODO
  } else {
    const unhandled: never = delta;
    console.log("Unhandled message", { unhandled });
  }
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
