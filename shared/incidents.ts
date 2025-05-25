export interface IncidentCommand {
  id: string;
  incidentId: string;
  clientTime: Date;
  delta: IncidentDelta;
}

export type IncidentDelta = CreateIncidentDelta | UpdateIncidentDelta;

interface CreateIncidentDelta {
  delta: "CreateIncidentDelta";
  info: IncidentInfo;
}

interface UpdateIncidentDelta {
  delta: "UpdateIncidentDelta";
  info: Partial<IncidentInfo>;
}

export interface IncidentSnapshot {
  id: string;
  updatedAt: Date;
  info: IncidentInfo;
}

export type IncidentPriorityEnum = "HIGH" | "MEDIUM" | "LOW";

export interface IncidentInfo {
  title: string;
  priority?: IncidentPriorityEnum;
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
