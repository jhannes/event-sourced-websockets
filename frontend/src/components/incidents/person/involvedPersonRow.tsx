import {
  InvolvedPersonRoleEnum,
  InvolvedPersonSnapshot,
} from "../../../../../shared/incidents";
import { useIncidentsContext } from "../useIncidentsContext";
import React from "react";
import { PersonRoleSelect } from "./personRoleSelect";

export function InvolvedPersonRow({
  person,
  personId,
  incidentId,
}: {
  incidentId: string;
  personId: string;
  person: InvolvedPersonSnapshot;
}) {
  const { sendCommand } = useIncidentsContext();
  const { personInfo } = person;
  const { role, lastName, firstName } = personInfo;

  function handleChangeRole(role: InvolvedPersonRoleEnum) {
    const delta = "UpdatePersonInIncident";
    sendCommand({
      incidentId,
      delta: { delta, personId, personInfo: { role } },
    });
  }

  return (
    <div>
      <PersonRoleSelect value={role} onChange={handleChangeRole} />:
      <>
        {" "}
        {lastName}, {firstName}
      </>
    </div>
  );
}
