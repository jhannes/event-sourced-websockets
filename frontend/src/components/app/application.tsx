import React, { useEffect, useState } from "react";
import { NewIncidentForm } from "../incidents/newIncidentForm";
import { IncidentRow } from "../incidents/incidentRow";
import { v4 as uuidv4 } from "uuid";
import {
  IncidentInfo,
  IncidentSnapshot,
  MessageFromServer,
  MessageToServer,
} from "../../../../shared/incidents";

function useWebSocket<TO_SERVER, FROM_SERVER>(
  url: string,
  onMessage: (message: FROM_SERVER) => void,
) {
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const webSocket = new WebSocket(url);
    webSocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
      onMessage(messageFromServer);
    };
    setWebsocket(webSocket);
  }, []);

  function sendMessage(messageToServer: TO_SERVER) {
    websocket?.send(JSON.stringify(messageToServer));
  }

  return { sendMessage };
}

export function Application() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  const [newIncidentId, setNewIncidentId] = useState(uuidv4());

  function handleMessageFromServer(messageFromServer: MessageFromServer) {
    if ("type" in messageFromServer) {
      setIncidents(messageFromServer.incidents);
    } else {
      const {
        incidentId,
        clientTime,
        delta: { info },
      } = messageFromServer;
      const incident = { id: incidentId, updatedAt: clientTime, info };
      setIncidents((old) => [...old, incident]);
    }
  }

  const { sendMessage } = useWebSocket<MessageToServer, MessageFromServer>(
    "/ws/incidents",
    handleMessageFromServer,
  );

  function handleNewIncident(incident: IncidentInfo) {
    sendMessage({
      id: uuidv4(),
      incidentId: newIncidentId,
      clientTime: new Date(),
      delta: { delta: "CreateIncidentDelta", info: incident },
    });
    setNewIncidentId(uuidv4());
  }

  return (
    <div>
      <h1>Incidents</h1>
      <ul>
        {incidents.map((i, index) => (
          <li key={index}>
            <IncidentRow incident={i} />
          </li>
        ))}
      </ul>

      <h2>New incident</h2>
      <NewIncidentForm key={newIncidentId} onNewIncident={handleNewIncident} />
    </div>
  );
}
