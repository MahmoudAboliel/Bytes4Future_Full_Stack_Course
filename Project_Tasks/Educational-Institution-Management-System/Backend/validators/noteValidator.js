import { z } from "zod";

const oid = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");


export const createNoteSchema = z.object({
  studentId: oid,
  teacherId: oid,
  note: z.string().min(1).max(2000),
  visibility: z
    .enum(["teacherOnly", "admin", "student"])
    .optional()
    .default("teacherOnly"),
});
export const updateNoteSchema = createNoteSchema.partial();
