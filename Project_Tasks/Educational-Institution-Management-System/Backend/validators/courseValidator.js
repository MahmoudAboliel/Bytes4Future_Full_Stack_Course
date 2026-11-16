import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(1),
  isActive: z.boolean().optional().default(false),
});

export const updateCourseSchema = courseSchema.partial();
