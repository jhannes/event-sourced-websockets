import {
  IncidentCommand,
  IncidentSnapshot,
  updateRecord,
} from "../shared/incidents";

export const incidents: Record<string, IncidentSnapshot> = {};

function updateIncident(
  incidentId: string,
  fn: (old: IncidentSnapshot) => Partial<IncidentSnapshot>,
) {
  incidents[incidentId] = {
    ...incidents[incidentId],
    ...fn(incidents[incidentId]),
  };
}

export function handleIncidentCommand(message: IncidentCommand) {
  const { incidentId, clientTime: updatedAt, delta } = message;

  if (delta.delta === "CreateIncidentDelta") {
    const { info } = delta;
    incidents[incidentId] = { id: incidentId, updatedAt, info, persons: {} };
  } else if (delta.delta === "UpdateIncidentDelta") {
    updateIncident(incidentId, (o) => ({
      updatedAt,
      info: { ...o.info, ...delta.info },
    }));
  } else if (delta.delta === "AddPersonToIncident") {
    const { personId, personInfo } = delta;
    updateIncident(incidentId, (o) => ({
      persons: { ...o.persons, [personId]: { personInfo, updatedAt } },
    }));
  } else if (delta.delta === "UpdatePersonInIncident") {
    const { personId, personInfo } = delta;
    updateIncident(incidentId, (o) => ({
      persons: updateRecord(o.persons, personId, (p) => ({
        personInfo: { ...p.personInfo, ...personInfo },
        updatedAt,
      })),
    }));
  } else {
    const unexpected: never = delta;
    console.log({ unexpected });
  }

  return {
    ...message,
    serverTime: new Date(),
    username: "TODO",
  };
}

export function getIncidentSummaries() {
  return Object.values(handleIncidentCommand).map(
    ({ id, info, updatedAt }) => ({
      id,
      info,
      updatedAt,
    }),
  );
}
