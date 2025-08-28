import z from "zod";

export const pathwaySchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500),
});

export type PathwaySchemaType = z.infer<typeof pathwaySchema>;
