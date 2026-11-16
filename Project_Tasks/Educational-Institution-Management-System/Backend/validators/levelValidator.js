import { z } from "zod";

const oid = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const levelSchema = z.object({
  title: z.string().min(2),
  courseId: oid,
  orderNumber: z.number().int().positive(),
  isActive: z.boolean().optional().default(false),
});

export const updateLevelSchema = levelSchema.partial();

export const approvalActionSchema = z.object({
  isActive: z.boolean().optional(),
  deletedAt: z.coerce.date().optional(),
});
