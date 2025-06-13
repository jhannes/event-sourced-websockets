export interface IncidentSnapshot {
  incidentId: string;
  updatedAt: Date;
  incident: Incident;
}

export interface Incident {
  summary: string;
}

export type MessageFromServer = IncidentSnapshot[] | IncidentEvent;

export type MessageToServer = IncidentCommand;

export interface IncidentCommand {
  eventId: string;
  clientTime: Date;
  incidentId: string;
  delta: IncidentDelta;
}

export interface IncidentEvent extends IncidentCommand {
  serverTime: Date;
  sequenceId: number;
  username: string;
}

export type IncidentDelta =
  | { type: "CreateIncident"; incident: Incident }
  | { type: "UpdateIncident"; incident: Incident };
