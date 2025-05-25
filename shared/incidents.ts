export type IncidentRequest =
  | {
      request: "IncidentSubscribeRequest";
      incidentId: string;
    }
  | {
      request: "IncidentUnsubscribeRequest";
      incidentId: string;
    };

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

export interface IncidentSummary {
  id: string;
  updatedAt: Date;
  info: IncidentInfo;
}

export interface IncidentSnapshot extends IncidentSummary {
  persons: Record<string, InvolvedPersonSnapshot>;
}

export interface InvolvedPersonSnapshot {
  updatedAt: Date;
  personInfo: InvolvedPersonInfo;
}

export const IncidentPriorityEnumValues = ["HIGH", "MEDIUM", "LOW"] as const;
export type IncidentPriorityEnum = (typeof IncidentPriorityEnumValues)[number];

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

export type MessageFromServer =
  | IncidentEvent
  | IncidentSummaryList
  | IncidentSnapshot;

export interface IncidentEvent extends IncidentCommand {
  username: string;
  serverTime: Date;
}

interface IncidentSummaryList {
  type: "IncidentSummaryList";
  summaries: IncidentSummary[];
}

export type MessageToServer = IncidentCommand | IncidentRequest;

export function updateRecord<T>(
  record: Record<string, T>,
  id: string,
  fn: (old: T) => Partial<T>,
) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      key === id ? { ...value, ...fn(value) } : value,
    ]),
  );
}
