export const IncidentPriorityValues = ["HIGH", "MEDIUM", "LOW"] as const;
export type IncidentPriorityEnum = (typeof IncidentPriorityValues)[number];

export interface IncidentSnapshot {
  incidentId: string;
  updatedAt: Date;
  incident: Incident;
}

export interface Incident {
  summary: string;
  priority?: IncidentPriorityEnum;
}

export interface IncidentCommand {
  eventId: string;
  clientTime: Date;
  incidentId: string;
  delta: IncidentDelta;
}

export interface IncidentEvent extends IncidentCommand {
  serverTime: Date;
  // TODO: username, sequenceId
}

export type IncidentDelta =
  | { type: "CreateIncident"; incident: Incident }
  | { type: "UpdateIncident"; incident: Partial<Incident> };

export type MessageToServer = IncidentCommand;

export type MessageFromServer = IncidentEvent | IncidentSnapshot[];
