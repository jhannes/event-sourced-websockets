export interface IncidentCommand {
  id: string;
  incidentId: string;
  clientTime: Date;
  delta: IncidentDelta;
}

export type IncidentDelta =
  | CreateIncidentDelta
  | UpdateIncidentDelta
  | AddPersonToIncident;

interface CreateIncidentDelta {
  delta: "CreateIncidentDelta";
  info: IncidentInfo;
}

interface UpdateIncidentDelta {
  delta: "UpdateIncidentDelta";
  info: Partial<IncidentInfo>;
}

interface AddPersonToIncident {
  delta: "AddPersonToIncident";
  personId: string;
  personInfo: InvolvedPersonInfo;
}

export interface IncidentSnapshot {
  id: string;
  updatedAt: Date;
  info: IncidentInfo;
  persons: Record<string, InvolvedPersonSnapshot>;
}

export interface InvolvedPersonSnapshot {
  updatedAt: Date;
  personInfo: InvolvedPersonInfo;
}

export type IncidentPriorityEnum = "HIGH" | "MEDIUM" | "LOW";

export interface IncidentInfo {
  title: string;
  priority?: IncidentPriorityEnum;
}

export const InvolvedPersonRoleEnumValues = [
  "WITNESS",
  "CALLER",
  "SUSPECT",
] as const;
export type InvolvedPersonRoleEnum =
  (typeof InvolvedPersonRoleEnumValues)[number];

export interface InvolvedPersonInfo {
  firstName: string;
  lastName: string;
  role: InvolvedPersonRoleEnum;
}

export type MessageFromServer = IncidentEvent | IncidentSnapshotList;

interface IncidentEvent extends IncidentCommand {
  username: string;
  serverTime: Date;
}

interface IncidentSnapshotList {
  type: "IncidentSnapshotList";
  incidents: IncidentSnapshot[];
}

export type MessageToServer = IncidentCommand;
