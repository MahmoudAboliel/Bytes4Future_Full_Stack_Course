import { z } from "zod";

const oid = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const cohortSchema = z.object({
  code: z.string().min(1),
  levelId: oid,
  teacherId: oid,
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  capacity: z.number().int().positive().optional(),
  status: z
    .enum(["planned", "active", "completed", "cancelled"])
    .optional()
    .default("planned"),
  isActive: z.boolean().optional().default(false),
});

export const updateCohortSchema = cohortSchema.partial();
