export interface Incident {
  title: string;
}

export type MessageFromServer = Incident[] | IncidentEvent;

export type IncidentDelta =
  | {
      type: "CreateIncident";
      info: Incident;
    }
  | {
      type: "UpdateIncident";
      info: Incident;
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
