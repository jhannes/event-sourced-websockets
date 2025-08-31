import React from "react";
import { NewIncidentForm } from "./newIncidentForm";
import { IncidentItem } from "./incidentItem";
import { v4 as uuid } from "uuid";
import {
  IncidentDeltaDto,
  IncidentInfoDto,
  IncidentSummaryDto,
  MessageToServerDto,
} from "../../../../../target/generated-sources/openapi-typescript";

export function IncidentListView({
  incidents,
  sendMessageToServer,
}: {
  incidents: IncidentSummaryDto[];
  sendMessageToServer: (message: MessageToServerDto) => void;
}) {
  function sendCommandToServer(incidentId: string, delta: IncidentDeltaDto) {
    sendMessageToServer({
      type: "IncidentCommand",
      eventId: uuid(),
      clientTime: new Date(),
      incidentId,
      delta,
    });
  }

  function handleNewIncident(info: IncidentInfoDto) {
    sendCommandToServer(uuid(), { type: "CreateIncident", info });
  }

  function handleUpdateIncident(id: string, info: IncidentInfoDto) {
    sendCommandToServer(id, { type: "UpdateIncident", info });
  }

  return (
    <>
      <h2>Incidents</h2>
      {incidents.map((i) => (
        <IncidentItem
          key={i.id}
          incident={i}
          onUpdate={(info) => handleUpdateIncident(i.id, info)}
        />
      ))}
      <h2>New incident</h2>
      <NewIncidentForm onNewIncident={handleNewIncident} />
    </>
  );
}
