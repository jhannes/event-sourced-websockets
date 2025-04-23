import { z } from "zod";

const Incident = z.object({
  id: z.string(),
  title: z.string(),
  priority: z.optional(z.enum(["HIGH", "MEDIUM", "LOW"])),
});
export type Incident = z.infer<typeof Incident>;
