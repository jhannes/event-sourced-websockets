import React from "react";
import { MessageToServerDto } from "../../../../../target/generated-sources/openapi-typescript";
import { useParams } from "react-router-dom";

export function IncidentSnapshot(props: {
  incidents: (message: MessageToServerDto) => void;
  sendMessage: (message: MessageToServerDto) => void;
}) {
  const { incidentId } = useParams();
  return <h2>Incident {incidentId}</h2>;
}
