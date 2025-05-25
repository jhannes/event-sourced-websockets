import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import {
  IncidentCommand,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
  updateRecord,
} from "../shared/incidents";

const incidents: Record<string, IncidentSnapshot> = {};

const app = express();
const server = app.listen(3000);

const peers: WebSocket[] = [];
const subscriptions: Map<WebSocket, Set<string>> = new Map();
const wsServer = new WebSocketServer({ noServer: true });

function broadcastMessage(message: MessageFromServer) {
  for (const peer of peers) {
    if ("delta" in message) {
      const {
        delta: { delta },
        incidentId,
      } = message;
      if (
        delta === "AddPersonToIncident" &&
        !subscriptions.get(peer)?.has(incidentId)
      )
        continue;
      if (
        delta === "UpdatePersonInIncident" &&
        !subscriptions.get(peer)?.has(incidentId)
      )
        continue;
    }
    peer.send(JSON.stringify(message));
  }
}

function updateIncident(
  incidentId: string,
  fn: (old: IncidentSnapshot) => Partial<IncidentSnapshot>,
) {
  incidents[incidentId] = {
    ...incidents[incidentId],
    ...fn(incidents[incidentId]),
  };
}

function handleMessageToServer(socket: WebSocket, message: MessageToServer) {
  if ("request" in message) {
    if (message.request === "IncidentSubscribeRequest") {
      const response: MessageFromServer = incidents[message.incidentId];
      if (!subscriptions.has(socket)) subscriptions.set(socket, new Set());
      if (!subscriptions.get(socket)?.has(message.incidentId)) {
        subscriptions.get(socket)?.add(message.incidentId);
        socket.send(JSON.stringify(response));
      }
    } else if (message.request === "IncidentUnsubscribeRequest") {
      subscriptions.get(socket)?.delete(message.incidentId);
    } else {
      const _: never = message;
      console.log("Unexpected message", message);
    }
  } else {
    handleIncidentCommand(message);
  }
}

function handleIncidentCommand(message: IncidentCommand) {
  const { incidentId, clientTime: updatedAt, delta } = message;

  if (delta.delta === "CreateIncidentDelta") {
    const { info } = delta;
    incidents[incidentId] = { id: incidentId, updatedAt, info, persons: {} };
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
  } else if (delta.delta === "UpdatePersonInIncident") {
    const { personId, personInfo } = delta;
    updateIncident(incidentId, (o) => ({
      persons: updateRecord(o.persons, personId, (p) => ({
        personInfo: { ...p.personInfo, ...personInfo },
        updatedAt,
      })),
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
      type: "IncidentSummaryList",
      summaries: Object.values(incidents).map(({ id, info, updatedAt }) => ({
        id,
        info,
        updatedAt,
      })),
    };
    socket.send(JSON.stringify(message));
    socket.onmessage = (event) => {
      handleMessageToServer(socket, JSON.parse(event.data.toString()));
    };
  });
});
