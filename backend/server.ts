import {
  IncidentSnapshot,
  MessageFromServer,
  schema,
  uuidv4,
} from "../shared/incidents";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";

const incidents: IncidentSnapshot[] = [
  {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    info: { title: "Fire from the server", priority: "MEDIUM" },
    persons: {},
  },
  {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    info: { title: "Traffic Accident from the server" },
    persons: {},
  },
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
      const { incidentId, clientTime: updatedAt, delta } = command;
      if (delta.delta === "CreateIncidentDelta") {
        incidents.push({
          id: incidentId,
          createdAt: updatedAt,
          updatedAt,
          info: delta.incident,
          persons: {},
        });
      } else if (delta.delta === "UpdateIncidentDelta") {
        for (const item of incidents) {
          if (item.id === incidentId) {
            item.updatedAt = updatedAt;
            item.info = { ...item.info, ...delta.incident };
          }
        }
      } else if (delta.delta === "AddPersonToIncident") {
        for (const item of incidents) {
          if (item.id === incidentId) {
            item.updatedAt = updatedAt;
            item.persons[delta.personId] = delta.person;
          }
        }
      } else {
        const unexpected: never = delta;
        console.log({ unexpected });
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
