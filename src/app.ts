import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import RecipeRepository, { Recipe } from "./domain/recipe/RecipeRepository";
import { validator } from "hono/validator";
import {
  getRecipeBySlugSchema,
  getRecipesSchema,
  querySchema,
} from "./domain/recipe/schema";
import ListsRepository from "./domain/lists/ListsRepository";
import {
  CustomListSchema,
  RecipeSchema,
  deleteRecipeToListSchema,
  getCustonListByIdSchema,
} from "./domain/lists/schema";
import {
  DuplicateNameRecipeError,
  ListExistsError,
  ListNotFoundError,
  RecipeNotFoundError,
  ValidationError,
} from "./domain/exceptions/CustomExceptions";

const app = new Hono();

const recipeRepository = new RecipeRepository();
const listsRepository = new ListsRepository();

app.use(
  "/api/*",
  cors({
    origin: "*", // Allow all domains to access this API
  })
);

app.get(
  "/api/recipes/search",
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

// Retrieve recipes with optional pagination
app.get(
  "/api/recipes/:page?/:limit?",
  validator("param", (value, c) => {
    const parsed = getRecipesSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401); // Respond with error if validation fails
    }
    return parsed.data;
  }),
  (c) => {
    const { page, limit } = c.req.param();
    const pageParam = page ? parseInt(page) : 1;
    const limitParam = limit ? parseInt(limit) : 10;

    try {
      return c.json(recipeRepository.findAllRecipe(pageParam, limitParam));
    } catch (error) {
      if (error instanceof RecipeNotFoundError) {
        return c.json({ error: error.message }, error.statusCode);
      }
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

// Retrieve a single recipe by slug
app.get(
  "/api/recipe/:slug",
  validator("param", (value, c) => {
    const parsed = getRecipeBySlugSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }
    return parsed.data;
  }),
  (c) => {
    const { slug } = c.req.param();

    try {
      return c.json(recipeRepository.findRecipeByName(slug));
    } catch (error) {
      if (error instanceof RecipeNotFoundError) {
        return c.json({ error: error.message }, error.statusCode);
      }
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

// Retrieve all lists
app.get("/api/lists", (c) => {
  try {
    const lists = listsRepository.findUserCustomList();
    return c.json(lists);
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
});

// Create a new custom list
app.post(
  "/api/lists",
  validator("json", async (value, c) => {
    const jsonData = await c.req.json();
    const parsed = CustomListSchema.safeParse(jsonData);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten().toString());
    }
    return parsed.data;
  }),
  async (c) => {
    try {
      const jsonData = await c.req.json();
      const { title, recipe } = jsonData;
      const list = listsRepository.addCustomList(title, recipe);

      return c.json({ list }, 201);
    } catch (error) {
      if (
        error instanceof ListExistsError ||
        error instanceof ValidationError
      ) {
        return c.json({ error: error.message }, error.statusCode);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Remove a recipe from a list
app.delete(
  "/api/lists/:listId/recipes/:recipeName",
  validator("param", (value, c) => {
    const parsed = deleteRecipeToListSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }
    return parsed.data;
  }),
  async (c) => {
    try {
      const listId = parseInt(c.req.param("listId"), 10);
      const recipeName = c.req.param("recipeName");

      const lists = listsRepository.removeRecipeFromList(listId, recipeName);
      return c.json({ lists }, 201);
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof ListNotFoundError
      ) {
        return c.json({ error: error.message }, error.statusCode);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Add a recipe to a specific list
app.post(
  "/api/lists/:listId",
  validator("param", (value, c) => {
    const parsed = getCustonListByIdSchema.safeParse(value);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten().toString());
    }
    return parsed.data;
  }),
  validator("json", async (value, c) => {
    const jsonData = await c.req.json();
    const parsed = RecipeSchema.safeParse(jsonData);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten().toString());
    }
    return parsed.data;
  }),
  async (c) => {
    try {
      const jsonData = await c.req.json();
      const newRecipe: Recipe = {
        ...jsonData,
      };

      const listId = parseInt(c.req.param("listId"), 10);
      listsRepository.addRecipeToList(listId, newRecipe);

      return c.json({ list: listsRepository.findListById(listId) }, 201);
    } catch (error) {
      if (
        error instanceof DuplicateNameRecipeError ||
        error instanceof ValidationError ||
        error instanceof ListNotFoundError
      ) {
        return c.json({ error: error.message }, error.statusCode);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// Start the server
serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Default port is 3000
});
