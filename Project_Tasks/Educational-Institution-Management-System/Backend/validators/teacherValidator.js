import { z } from "zod";

const oid = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createSessionSchema = z.object({
  cohortId: oid,
  sessionNumber: z.number().int().positive().optional(),
  sessionDate: z.coerce.date(),
  topic: z.string().min(1).max(255),
  status: z
    .enum(["scheduled", "done", "cancelled"])
    .optional()
    .default("scheduled"),
});

export const updateSessionSchema = createSessionSchema.partial();

export const attendanceSchema = z.object({
  sessionId: oid,
  enrollmentId: oid,
  status: z.enum(["present", "absent", "late", "excused"]),
});

export const createResultSchema = z.object({
  enrollmentId: oid,
  kind: z.string().optional().default(""),
  score: z.number().min(0),
  maxScore: z.number().positive().optional().default(100),
  grade: z.string().min(1),
  notes: z.string().optional().default(""),
  isActive: z.boolean().optional().default(false),
});

export const updateResultSchema = createResultSchema
  .partial()
  .omit({ enrollmentId: true });

export const approveAllSchema = z.object({
  cohortId: oid,
});
