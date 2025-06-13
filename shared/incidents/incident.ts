export const IncidentPriorityValues = ["HIGH", "MEDIUM", "LOW"] as const;
export type IncidentPriorityEnum = (typeof IncidentPriorityValues)[number];

export interface Incident {
  summary: string;
  priority?: IncidentPriorityEnum;
}

export type MessageToServer = IncidentCommand;

export type MessageFromServer = IncidentSnapshot[] | IncidentEvent;

export interface IncidentSnapshot {
  updatedAt: Date;
  incidentId: string;
  incident: Incident;
}

export interface IncidentCommand {
  eventId: string;
  clientTime: Date;
  incidentId: string;
  delta: IncidentDelta;
}

export interface IncidentEvent extends IncidentCommand {
  serverTime: Date;
  username: string;
  sequenceId: number;
}

export type IncidentDelta =
  | { type: "CreateIncident"; incident: Incident }
  | { type: "UpdateIncident"; incident: Partial<Incident> };
