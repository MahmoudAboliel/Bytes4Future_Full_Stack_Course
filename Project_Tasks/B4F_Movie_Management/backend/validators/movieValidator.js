import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(2).max(100),
  rating: z.number().min(0).max(10),
  director: z.string().min(2).max(100),
  productYear: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  genres: z.array(z.string()),
    image: z.string().url().optional(),
});

export const updateMovieSchema = movieSchema.partial();

export const movieCastSchema = z.array(
  z.object({
    actorId: z.string().min(1),
    characterName: z.string().min(1).max(100),
  }),
);
