// src/routes/index.ts
import { Hono } from "hono";
import recipeRouter from "./domain/recipe/recipeAPI";
import listsRouter from "./domain/lists/listsAPI";

const apiRouter = new Hono();

apiRouter.route("/recipes", recipeRouter);
apiRouter.route("/lists", listsRouter);

export default apiRouter;
