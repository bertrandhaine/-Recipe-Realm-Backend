import { z } from "zod";

export const getRecipesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const getRecipeBySlugSchema = z.object({
  slug: z
    .string()
    .min(1, { message: "Slug must not be empty" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Invalid slug format" }),
});

export const querySchema = z.string().min(1, "Query string is required");