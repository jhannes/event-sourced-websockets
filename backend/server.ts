import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import {
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../shared/incidents";
import { v4 as uuidv4 } from "uuid";

const incidents: IncidentSnapshot[] = [
  {
    id: uuidv4(),
    info: { title: "Fire from server" },
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    info: { title: "Traffic from server" },
    updatedAt: new Date(),
  },
];

const app = express();
const server = app.listen(3000);

const peers: WebSocket[] = [];
const wsServer = new WebSocketServer({ noServer: true });

function broadcastMessage(message: MessageFromServer) {
  for (const peer of peers) {
    peer.send(JSON.stringify(message));
  }
}

function handleMessageToServer(message: MessageToServer) {
  const { incidentId, clientTime, delta } = message;

  if (delta.delta === "CreateIncidentDelta") {
    incidents.push({ id: incidentId, updatedAt: clientTime, info: delta.info });
  } else if (delta.delta === "UpdateIncidentDelta") {
    const incident = incidents.find(({ id }) => id === incidentId)!;
    incident.info = { ...incident.info, ...delta.info };
    incident.updatedAt = clientTime;
  } else {
    const _: never = delta;
    console.log("Unexpected delta", delta);
  }

  const messageFromServer = {
    ...message,
    serverTime: new Date(),
    username: "TODO",
  };
  broadcastMessage(messageFromServer);
}

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.push(socket);
    const message: MessageFromServer = {
      type: "IncidentSnapshotList",
      incidents,
    };
    socket.send(JSON.stringify(message));
    socket.onmessage = (event) => {
      handleMessageToServer(JSON.parse(event.data.toString()));
    };
  });
});
