import { z } from "zod";
export { v4 as uuidv4 } from "uuid";

export const IncidentPriorityValues = ["HIGH", "MEDIUM", "LOW"] as const;
const Incident = z.object({
  id: z.string(),
  title: z.string(),
  priority: z.optional(z.enum(IncidentPriorityValues)),
});
export type Incident = z.infer<typeof Incident>;
export const schema = { Incident };
