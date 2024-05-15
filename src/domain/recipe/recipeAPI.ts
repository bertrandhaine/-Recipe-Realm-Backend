// src/routes/recipes.ts
import { Hono } from "hono";
import { validator } from "hono/validator";
import RecipeRepository from "./RecipeRepository";
import { getRecipeBySlugSchema, getRecipesSchema, querySchema } from "./schema";
import { RecipeNotFoundError } from "../exceptions/CustomExceptions";

const recipeRouter = new Hono();
const recipeRepository = new RecipeRepository();

recipeRouter.get(
  "/search",
  validator("query", (value, c) => {
    const parsed = querySchema.safeParse(value.q);
    if (!parsed.success) {
      return c.json({ error: "Invalid or missing query string" }, 400);
    }
    return parsed.data;
  }),
  async (c) => {
    const { q } = c.req.query();
    try {
      const recipes = await recipeRepository.searchByName(q);
      return c.json({ recipes }, 200);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
);

recipeRouter.get(
  "/all/:page?/:limit?",
  validator("param", (value, c) => {
    const parsed = getRecipesSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401); // Respond with error if validation fails
    }
    return parsed.data;
  }),
  async (c) => {
    const { page, limit } = c.req.param();
    const pageParam = page ? parseInt(page) : 1;
    const limitParam = limit ? parseInt(limit) : 10;

    try {
      const recipes = await recipeRepository.findAllRecipe(
        pageParam,
        limitParam
      );
      return c.json(recipes, 200);
    } catch (error) {
      if (error instanceof RecipeNotFoundError) {
        return c.json({ error: error.message }, error.statusCode);
      }
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

recipeRouter.get(
  "/:slug",
  validator("param", (value, c) => {
    const parsed = getRecipeBySlugSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { slug } = c.req.param();

    try {
      const recipe = await recipeRepository.findRecipeByName(slug);
      return c.json(recipe);
    } catch (error) {
      if (error instanceof RecipeNotFoundError) {
        return c.json({ error: error.message }, error.statusCode);
      }
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

export default recipeRouter;
