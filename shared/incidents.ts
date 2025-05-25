export type IncidentPriority = (typeof IncidentPriorityEnumValues)[number];

export interface Incident {
  title: string;
  priority?: IncidentPriority;
}

export type MessageFromServer = IncidentSummary[] | IncidentEvent;

export type IncidentDelta =
  | {
      type: "CreateIncident";
      info: Incident;
    }
  | {
      type: "UpdateIncident";
      info: Partial<Incident>;
    };

export interface IncidentCommand {
  eventId: string;
  incidentId: string;
  clientTime: Date;
  delta: IncidentDelta;
}

export interface IncidentEvent extends IncidentCommand {
  serverTime: Date;
  sequenceNumber: number;
}

export type MessageToServer = IncidentCommand;
export const IncidentPriorityEnumValues = ["HIGH", "MEDIUM", "LOW"];

export interface IncidentSummary {
  incidentId: string;
  info: Incident;
}
