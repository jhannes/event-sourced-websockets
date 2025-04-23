import { z } from "zod";
export { v4 as uuidv4 } from "uuid";

export const IncidentPriorityValues = ["HIGH", "MEDIUM", "LOW"] as const;
const Incident = z.object({
  id: z.string(),
  title: z.string(),
  priority: z.optional(z.enum(IncidentPriorityValues)),
});

const IncidentSummaryList = z.object({
  summaries: z.array(Incident),
});

const IncidentDelta = z.discriminatedUnion("delta", [
  z.object({ delta: z.literal("CreateIncidentDelta"), incident: Incident }),
]);

const IncidentCommand = z.object({
  id: z.string(),
  incidentId: z.string(),
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
export type IncidentEvent = z.infer<typeof IncidentEvent>;
export type IncidentDelta = z.infer<typeof IncidentDelta>;
export type MessageToServer = z.infer<typeof MessageToServer>;
export type MessageFromServer = z.infer<typeof MessageFromServer>;
