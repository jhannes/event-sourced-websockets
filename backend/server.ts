import {
  Incident,
  MessageFromServer,
  schema,
  uuidv4,
} from "../shared/incidents";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";

const incidents: Incident[] = [
  { id: uuidv4(), title: "Fire from the server", priority: "HIGH" },
  { id: uuidv4(), title: "Traffic Accident from the server" },
];

const app = express();

app.get("/api/incidents", (_, res) => {
  res.json(incidents);
});

const server = app.listen(process.env.PORT || 3000);

const peers = new Set<WebSocket>();
const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    const incidentMessage: MessageFromServer = {
      type: "IncidentSummaryList",
      summaries: incidents,
    };
    socket.send(JSON.stringify(incidentMessage));
    socket.onmessage = (e) => {
      const command = schema.MessageToServer.parse(
        JSON.parse(e.data.toString()),
      );
      const { delta } = command;
      if (delta.delta === "CreateIncidentDelta") {
        incidents.push(delta.incident);
      } else if (delta.delta === "UpdateIncidentDelta") {
        for (let i = 0; i < incidents.length; i++) {
          if (incidents[i].id === command.incidentId) {
            incidents[i] = { ...incidents[i], ...delta.incident };
          }
        }
      }

      const event: MessageFromServer = {
        ...command,
        type: "IncidentEvent",
        serverTime: new Date().toISOString(),
        username: "dummy-user",
      };
      for (const peer of peers) {
        peer.send(JSON.stringify(event));
      }
    };
  });
});
