export const IncidentPriorityValues = ["HIGH", "MEDIUM", "LOW"] as const;
export type IncidentPriorityEnum = (typeof IncidentPriorityValues)[number];

export interface Incident {
  id: string;
  summary: string;
  priority?: IncidentPriorityEnum;
}
