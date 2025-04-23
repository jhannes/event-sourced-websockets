import { z } from "zod";
export { v4 as uuidv4 } from "uuid";

export const IncidentPriorityValues = ["HIGH", "MEDIUM", "LOW"] as const;
const Incident = z.object({
  id: z.string().uuid(),
  title: z.string(),
  priority: z.enum(IncidentPriorityValues).optional(),
});

export const InvolvedPersonRoleValues = [
  "CALLER",
  "SUSPECT",
  "WITNESS",
] as const;
const InvolvedPerson = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(InvolvedPersonRoleValues).optional(),
});

const IncidentDelta = z.discriminatedUnion("delta", [
  z.object({ delta: z.literal("CreateIncidentDelta"), incident: Incident }),
  z.object({
    delta: z.literal("UpdateIncidentDelta"),
    incident: Incident.partial(),
  }),
  z.object({
    delta: z.literal("AddPersonToIncident"),
    personId: z.string().uuid(),
    person: InvolvedPerson,
  }),
]);

const IncidentCommand = z.object({
  id: z.string().uuid(),
  incidentId: z.string().uuid(),
  clientTime: z.string().datetime(),
  delta: IncidentDelta,
});
const IncidentEvent = IncidentCommand.extend({
  username: z.string(),
  serverTime: z.string().datetime(),
});

const MessageToServer = z.discriminatedUnion("type", [
  IncidentCommand.extend({ type: z.literal("IncidentCommand") }),
]);
const MessageFromServer = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("IncidentSummaryList"),
    summaries: z.array(Incident),
  }),
  IncidentEvent.extend({ type: z.literal("IncidentEvent") }),
]);

export const schema = { Incident, MessageFromServer, MessageToServer };

export type Incident = z.infer<typeof Incident>;
export type IncidentPriority = (typeof IncidentPriorityValues)[number];
export type InvolvedPerson = z.infer<typeof InvolvedPerson>;
export type InvolvedPersonRole = (typeof InvolvedPersonRoleValues)[number];
export type IncidentEvent = z.infer<typeof IncidentEvent>;
export type IncidentDelta = z.infer<typeof IncidentDelta>;
export type MessageToServer = z.infer<typeof MessageToServer>;
export type MessageFromServer = z.infer<typeof MessageFromServer>;
