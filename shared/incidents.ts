export interface IncidentCommand {
  id: string;
  incidentId: string;
  clientTime: Date;
  delta: IncidentDelta;
}

export type IncidentDelta =
  | {
      delta: "CreateIncidentDelta";
      info: IncidentInfo;
    }
  | {
      delta: "UpdateIncidentDelta";
      info: Partial<IncidentInfo>;
    }
  | {
      delta: "AddPersonToIncident";
      personId: string;
      personInfo: InvolvedPersonInfo;
    }
  | {
      delta: "UpdatePersonInIncident";
      personId: string;
      personInfo: Partial<InvolvedPersonInfo>;
    };

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

export interface IncidentEvent extends IncidentCommand {
  username: string;
  serverTime: Date;
}

interface IncidentSnapshotList {
  type: "IncidentSnapshotList";
  incidents: IncidentSnapshot[];
}

export type MessageToServer = IncidentCommand;
