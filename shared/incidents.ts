export const IncidentPriorityValues = ["HIGH", "MEDIUM", "LOW"] as const;
export type IncidentPriorityEnum = (typeof IncidentPriorityValues)[number];

export interface Incident {
  summary: string;
  priority?: IncidentPriorityEnum;
}

export interface IncidentSnapshot {
  incidentId: string;
  createdAt: Date;
  updatedAt: Date;
  info: Incident;
}

export const InvolvedPersonRoleValues = [
  "WITNESS",
  "SUSPECT",
  "CALLER",
] as const;
export type InvolvedPersonRoleEnum = (typeof InvolvedPersonRoleValues)[number];

export interface InvolvedPerson {
  firstName: string;
  lastName: string;
  role: InvolvedPersonRoleEnum;
}

export type MessageFromServer = IncidentEvent | IncidentSnapshot[];

export type MessageToServer = IncidentCommand;

export interface IncidentCommand {
  eventId: string;
  clientTime: Date;
  incidentId: string;
  delta: IncidentDelta;
}

export interface IncidentEvent extends IncidentCommand {
  serverTime: Date;
}

export type IncidentDelta =
  | {
      type: "CreateIncident";
      info: Incident;
    }
  | {
      type: "UpdateIncident";
      info: Partial<Incident>;
    }
  | {
      type: "AddPersonToIncident";
      personId: string;
      person: InvolvedPerson;
    };
