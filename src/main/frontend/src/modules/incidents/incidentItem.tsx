import {
  IncidentInfoDtoPriorityEnum,
  IncidentSummaryDto,
} from "../../../../../../target/generated-sources/openapi-typescript";
import React, { useContext } from "react";
import { IncidentContext } from "./incidentContext";
import { Link } from "react-router";

export function IncidentItem({ incident }: { incident: IncidentSummaryDto }) {
  const { sendMessage } = useContext(IncidentContext);
  const {
    id,
    info: { description, priority },
  } = incident;

  function handleChange(newPriority: string) {
    const priority = newPriority as IncidentInfoDtoPriorityEnum;
    sendMessage({
      incidentId: id,
      type: "IncidentCommand",
      clientTime: new Date(),
      delta: { delta: "UpdateIncidentDelta", info: { priority } },
    });
  }

  return (
    <li>
      <Link to={`/incidents/${id}`}>{description}</Link>
      <span>
        <select onChange={(e) => handleChange(e.target.value)} value={priority}>
          <option value={""}>(not specified)</option>
          <option value={"ALERT"}>Alert</option>
          <option value={"HIGH"}>High</option>
          <option value={"MEDIUM"}>Medium</option>
          <option value={"LOW"}>Low</option>
        </select>
      </span>
    </li>
  );
}
