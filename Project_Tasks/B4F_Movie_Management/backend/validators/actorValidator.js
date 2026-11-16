import { z } from "zod";

export const actorSchema = z.object({
    name: z.string().min(2).max(100),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    nationality: z.string().min(2).max(100),
    image: z.string().url().optional(),
});

export const updateActorSchema = actorSchema.partial();