import slugify from "slugify";
import recipesJson from "./../../recipes.json";
import { RecipeNotFoundError } from "../exceptions/CustomExceptions";

type Recipes = {
  data: typeof recipesJson;
  pagination: Pagination;
};

export type Recipe = Recipes["data"][0];

type Pagination = {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  nextPage: number;
  prevPage: number | null;
};

class RecipeRepository {
  private recipes = recipesJson;

  /**
   * Retrieve all recipes with pagination.
   * @param page Page number to retrieve.
   * @param limit Number of recipes per page.
   * @returns An object containing recipes and pagination information.
   */
  findAllRecipe(page: number, limit: number): Recipes {
    const totalRecords = this.recipes.length;
    const totalPages = Math.ceil(this.recipes.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (!totalRecords || startIndex >= totalRecords) {
      throw new RecipeNotFoundError("There are no recipes");
    }

    return {
      data: this.recipes.slice(startIndex, endIndex),
      pagination: {
        totalRecords: totalRecords,
        currentPage: page,
        totalPages,
        nextPage: 2,
        prevPage: null,
      },
    };
  }

  /**
   * Find a recipe by its name.
   * @param name The name of the recipe to search for.
   * @returns The corresponding recipe.
   */
  findRecipeByName(name: string): Recipe {
    const recipe = this.recipes.find(
      (recipe) => slugify(recipe.Name, { lower: true, remove: /[*+~.()'"!:@]/g }) === name
    );

    if (!recipe) {
      throw new RecipeNotFoundError("There is no recipe with this name");
    }

    return recipe;
  }

  /**
   * Search recipes by name.
   * @param searchTerm The name or part of the name to search for.
   * @returns An array of recipes that match the search term.
   */
  searchByName(searchTerm: string): Recipe[] {
    const lowerCaseSearchTerm = slugify(decodeURIComponent(searchTerm), {
      lower: true,
    });
    return this.recipes.filter((recipe) =>
      slugify(recipe.Name, { lower: true, remove: /[*+~.()'"!:@]/g }).includes(
        lowerCaseSearchTerm
      )
    );
  }
}

export default RecipeRepository;
