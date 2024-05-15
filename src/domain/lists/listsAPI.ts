// src/routes/lists.ts
import { Hono } from "hono";
import { validator } from "hono/validator";
import ListsRepository from "./ListsRepository";
import {
  CustomListSchema,
  RecipeSchema,
  deleteRecipeToListSchema,
  getCustonListByIdSchema,
} from "./schema";
import {
  DuplicateNameRecipeError,
  ListExistsError,
  ListNotFoundError,
  ValidationError,
} from "../exceptions/CustomExceptions";

const listsRouter = new Hono();
const listsRepository = new ListsRepository();

/**
 * @description Retrieve all custom lists for the user.
 */
listsRouter.get("/", (c) => {
  try {
    const lists = listsRepository.findUserCustomList();
    return c.json(lists);
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
});

/**
 * @description Create a new custom list.
 * Body parameters: title (string) - The title of the new list.
 *                  recipe (array) - The initial recipes to add to the list.
 */
listsRouter.post(
  "/",
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

/**
 * @description Remove a recipe from a custom list.
 * URL parameters: listId (number) - The ID of the list.
 *                 recipeName (string) - The name of the recipe to remove.
 */
listsRouter.delete(
  "/:listId/recipes/:recipeName",
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

/**
 * @description Add a recipe to a specific custom list.
 * URL parameter: listId (number) - The ID of the list.
 * Body parameters: recipe (object) - The recipe to add.
 */
listsRouter.post(
  "/:listId",
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
      const newRecipe = { ...jsonData };

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

export default listsRouter;
