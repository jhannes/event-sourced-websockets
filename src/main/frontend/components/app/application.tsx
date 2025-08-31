import React, { useEffect, useState } from "react";
import { IncidentListView } from "../incidents/incidentListView.js";
import { Route, Routes } from "react-router-dom";
import {
  IncidentSummaryDto,
  MessageFromServerDto,
  MessageToServerDto,
} from "../../../../../target/generated-sources/openapi-typescript";
import { IncidentSnapshot } from "../incidents/incidentSnapshot";

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSummaryDto[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket("/ws/incidents");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as MessageFromServerDto;
      if ("incidents" in message) {
        setIncidents(message.incidents);
      } else if ("delta" in message) {
        const { delta, incidentId: id, clientTime: updatedAt } = message;
        if (delta.type === "CreateIncident") {
          const { info } = delta;
          setIncidents((old) => [
            ...old,
            { id, createdAt: updatedAt, updatedAt, info },
          ]);
        } else if (delta.type === "UpdateIncident") {
          const { info } = delta;
          setIncidents((old) =>
            old.map((o) =>
              o.id === id
                ? { ...o, updatedAt, info: { ...o.info, ...info } }
                : o,
            ),
          );
        } else if (delta.type !== "AddPersonToIncidentDelta") {
          const unhandled: never = delta;
          console.error("Unexpected delta ", { unhandled });
        }
      } else if ("persons" in message) {
      } else {
        const unhandled: never = message;
        console.error("Unexpected message ", { unhandled });
      }
    };
    setWebsocket(ws);
  }, []);

  function sendMessageToServer(message: MessageToServerDto) {
    websocket?.send(JSON.stringify(message));
  }

  return (
    <>
      <h1>Incident Management</h1>
      <Routes>
        <Route
          path={"/"}
          element={
            <IncidentListView
              incidents={incidents}
              sendMessageToServer={sendMessageToServer}
            />
          }
        />
        <Route
          path={"/incidents/:incidentId"}
          element={
            <IncidentSnapshot
              incidents={sendMessageToServer}
              sendMessage={sendMessageToServer}
            />
          }
        />
        <Route path={"*"} element={<h2>Not found</h2>} />
      </Routes>
    </>
  );
}
