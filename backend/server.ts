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
    persons: {},
  },
  {
    id: uuidv4(),
    info: { title: "Traffic from server" },
    updatedAt: new Date(),
    persons: {},
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

function updateIncident(
  incidentId: string,
  fn: (old: IncidentSnapshot) => Partial<IncidentSnapshot>,
) {
  const index = incidents.findIndex(({ id }) => id === incidentId)!;
  incidents[index] = { ...incidents[index], ...fn(incidents[index]) };
}

function handleMessageToServer(message: MessageToServer) {
  const { incidentId, clientTime: updatedAt, delta } = message;

  if (delta.delta === "CreateIncidentDelta") {
    const { info } = delta;
    incidents.push({ id: incidentId, updatedAt, info, persons: {} });
  } else if (delta.delta === "UpdateIncidentDelta") {
    updateIncident(incidentId, (o) => ({
      updatedAt,
      info: { ...o.info, ...delta.info },
    }));
  } else if (delta.delta === "AddPersonToIncident") {
    const { personId, personInfo } = delta;
    updateIncident(incidentId, (o) => ({
      persons: { ...o.persons, [personId]: { personInfo, updatedAt } },
    }));
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
