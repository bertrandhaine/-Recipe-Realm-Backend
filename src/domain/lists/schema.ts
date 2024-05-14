import { z } from "zod";

export const RecipeSchema = z.object({
  Name: z.string(),
  url: z.string().url(),
  Description: z.string() || z.null(),
  Author: z.string() || z.null(),
  Ingredients: z.array(z.string()),
  Method: z.array(z.string()),
});

export const CustomListSchema = z.object({
  title: z.string().min(1, "List name is required"),
  recipe: RecipeSchema.optional(),
});

export const getCustonListByIdSchema = z.object({
  listId: z.string().min(1, "List id is required"),
});

export const deleteRecipeToListSchema = z.object({
  listId: z.string().min(1, "List id is required"),
  recipeName: z.string().min(1, "Recipe name is required"),
});
