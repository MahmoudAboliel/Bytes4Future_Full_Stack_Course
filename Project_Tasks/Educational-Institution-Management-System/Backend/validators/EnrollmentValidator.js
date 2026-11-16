import { z } from "zod";

const oid = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");


export const createEnrollmentSchema = z.object({
  studentId: oid,
  cohortId: oid,
  status: z
    .enum(["active", "withdrawn", "completed"])
    .optional()
    .default("active"),
  enrolledAt: z.coerce.date().optional(),
});

export const patchEnrollmentSchema = z.object({
  status: z.enum(["active", "withdrawn", "completed"]),
});
