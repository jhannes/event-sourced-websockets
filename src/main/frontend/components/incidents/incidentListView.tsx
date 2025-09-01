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

export function IncidentListView({}: {}) {
  return (
    <>
      <h2>Incidents</h2>
      {/* TODO: List incidents */}
      <h2>New incident</h2>
      <NewIncidentForm />
    </>
  );
}
