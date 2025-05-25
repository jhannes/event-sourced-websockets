interface IncidentCommand {
  id: string;
  incidentId: string;
  clientTime: Date;
  delta: IncidentDelta;
}

type IncidentDelta = CreateIncidentDelta | UpdateIncidentDelta;

interface CreateIncidentDelta {
  delta: "CreateIncidentDelta";
  info: IncidentInfo;
}

interface UpdateIncidentDelta {
  delta: "UpdateIncidentDelta";
  info: IncidentInfo;
}

export interface IncidentSnapshot {
  id: string;
  updatedAt: Date;
  info: IncidentInfo;
}

export interface IncidentInfo {
  title: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
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
