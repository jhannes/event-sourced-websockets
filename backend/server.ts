import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import {
  IncidentCommand,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../shared/incidents/incident";
import { v4 as uuidv4 } from "uuid";
import { combineAll } from "rxjs";

const app = express();

const server = app.listen(3000);

const wsServer = new WebSocketServer({ noServer: true });
const incidents: IncidentSnapshot[] = [
  {
    incidentId: uuidv4(),
    updatedAt: new Date(),
    incident: { summary: "Fire on the server" },
  },
  {
    incidentId: uuidv4(),
    updatedAt: new Date(),
    incident: { summary: "Traffic on the server" },
  },
];

const peers = new Set<WebSocket>();

function sendMessage(peer: WebSocket, message: MessageFromServer) {
  peer.send(JSON.stringify(message));
}

function handleMessageToServer(message: MessageToServer) {
  const command: IncidentCommand = message;
  const { incidentId, delta } = message;
  const updatedAt = new Date();
  if (delta.type === "CreateIncident") {
    const { incident } = delta;
    incidents.push({ incidentId, updatedAt, incident });
  } else if (delta.type === "UpdateIncident") {
    for (const o of incidents) {
      if (o.incidentId === incidentId) {
        o.updatedAt = updatedAt;
        o.incident = { ...o.incident, ...delta.incident };
      }
    }
  } else {
    const unhandled: never = delta;
    console.warn({ unhandled });
  }

  const event = { ...command, serverTime: updatedAt };
  for (const peer of peers) {
    sendMessage(peer, event);
  }
}

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    sendMessage(socket, incidents);
    socket.onclose = () => peers.delete(socket);
    socket.onmessage = (event) => {
      handleMessageToServer(JSON.parse(event.data.toString()));
    };
  });
});
