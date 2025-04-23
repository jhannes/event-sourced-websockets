import { z } from "zod";
export { v4 as uuidv4 } from "uuid";

const Incident = z.object({
  id: z.string(),
  title: z.string(),
  priority: z.optional(z.enum(["HIGH", "MEDIUM", "LOW"])),
});
export type Incident = z.infer<typeof Incident>;
export const schema = { Incident };
