import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { MessageFromServer, MessageToServer } from "../shared/incidents";
import {
  getIncidentSummaries,
  handleIncidentCommand,
  incidents,
} from "./incidents";

const app = express();
const server = app.listen(3000);

const peers = new Set<WebSocket>();
const subscriptions: Map<WebSocket, Set<string>> = new Map();
const wsServer = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    const summaries = getIncidentSummaries();
    sendMessage(socket, { type: "IncidentSummaryList", summaries });
    socket.onmessage = (event) => {
      handleMessageToServer(socket, JSON.parse(event.data.toString()));
    };
    socket.onclose = () => peers.delete(socket);
  });
});

function sendMessage(peer: WebSocket, message: MessageFromServer) {
  peer.send(JSON.stringify(message));
}

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
    sendMessage(peer, message);
  }
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
      const unexpected: never = message;
      console.log({ unexpected });
    }
  } else {
    const event = handleIncidentCommand(message);
    broadcastMessage(event);
  }
}
