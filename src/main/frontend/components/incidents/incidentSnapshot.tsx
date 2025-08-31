import React, { useEffect } from "react";
import {
  IncidentSnapshotDto,
  IncidentSummaryDto,
  MessageToServerDto,
  PersonInfoDto,
} from "../../../../../target/generated-sources/openapi-typescript";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { AddPersonToIncidentForm } from "./addPersonToIncidentForm";

export function IncidentSnapshot({
  incidents,
  sendMessage,
}: {
  incidents: IncidentSummaryDto[];
  sendMessage?: (message: MessageToServerDto) => void;
}) {
  const { incidentId } = useParams();
  const incident = incidents.find((o) => o.id === incidentId);

  useEffect(() => {
    if (incidentId && sendMessage)
      sendMessage({ type: "IncidentSubscribeRequest", incidentId });
  }, [sendMessage]);

  function handleNewPerson(info: PersonInfoDto) {
    sendMessage!({
      type: "IncidentCommand",
      eventId: uuid(),
      incidentId: incidentId!,
      clientTime: new Date(),
      delta: {
        type: "AddPersonToIncidentDelta",
        personId: uuid(),
        info,
      },
    });
  }

  if (!incident) return <h2>Incident not found</h2>;
  return (
    <>
      <h2>
        Incident {incident.info.summary} (priority: {incident.info.priority})
      </h2>

      {"persons" in incident && (
        <IncidentSnapshotView snapshot={incident as IncidentSnapshotDto} />
      )}
      <h3>New person</h3>

      <AddPersonToIncidentForm onNewPerson={handleNewPerson} />
    </>
  );
}

function IncidentSnapshotView({ snapshot }: { snapshot: IncidentSnapshotDto }) {
  return (
    <>
      <h3>Persons</h3>
      <ul>
        {Object.entries(snapshot.persons).map(([k, p]) => (
          <li key={k}>
            {p.givenName} {p.familyName} ({p.role})
          </li>
        ))}
      </ul>
    </>
  );
}
