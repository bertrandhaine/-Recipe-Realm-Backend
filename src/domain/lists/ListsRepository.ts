import NodeCache from "node-cache";
import { Recipe } from "../recipe/RecipeRepository";
import {
  DuplicateNameRecipeError,
  ListExistsError,
  ListNotFoundError,
} from "../exceptions/CustomExceptions";
import slugify from "slugify";

export type CustomList = {
  listId: number;
  title: string;
  recipes: Recipe[];
};

class ListsRepository {
  private lists: CustomList[] = [];
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
    const cachedLists = this.cache.get<CustomList[]>("lists");

    if (cachedLists) {
      this.lists = cachedLists;
    } else {
      this.cache.set("lists", []);
    }
  }

  /**
   * Retrieve all user custom lists.
   * @returns An array of custom lists.
   */
  findUserCustomList(): CustomList[] {
    return this.lists;
  }

  /**
   * Find a custom list by its title.
   * @param title The title of the list to search for.
   * @returns The custom list if found, otherwise undefined.
   */
  findListByTitle(title: string): CustomList | undefined {
    const list = this.lists.find((list) => list.title === title);
    return list;
  }

  /**
   * Find a custom list by its ID.
   * @param listId The ID of the list to search for.
   * @returns The custom list if found.
   * @throws ListNotFoundError if the list is not found.
   */
  findListById(listId: number): CustomList {
    const list = this.lists.find((list) => list.listId === listId);

    if (!list) {
      throw new ListNotFoundError("List not found");
    }

    return list;
  }

  /**
   * Generate a new ID for a custom list.
   * @returns A new list ID.
   */
  generateNewListId(): number {
    return this.lists.length + 1;
  }

  /**
   * Add a new custom list.
   * @param title The title of the new list.
   * @param recipe An optional recipe to include in the new list.
   * @returns The newly created custom list.
   * @throws ListExistsError if a list with the same title already exists.
   */
  addCustomList(title: string, recipe: Recipe | undefined): CustomList {
    const newListId = this.generateNewListId();

    const list = {
      listId: newListId,
      title: title,
      recipes: recipe ? [recipe] : [],
    };

    const existingList = this.findListByTitle(list.title);

    if (existingList) {
      throw new ListExistsError("List already exists");
    }

    this.lists.push(list);

    return list;
  }

  /**
   * Add a recipe to an existing custom list.
   * @param listId The ID of the list to add the recipe to.
   * @param newRecipe The recipe to add.
   * @throws DuplicateNameRecipeError if a recipe with the same name already exists in the list.
   */
  addRecipeToList(listId: number, newRecipe: Recipe): void {
    const list = this.findListById(listId);

    const isDuplicate = list.recipes.some(
      (recipe) => recipe.Name === newRecipe.Name
    );

    if (isDuplicate) {
      throw new DuplicateNameRecipeError(
        "A recipe with the same name already exists in this list"
      );
    }

    list.recipes.push(newRecipe);
  }

  /**
   * Remove a recipe from an existing custom list.
   * @param listId The ID of the list to remove the recipe from.
   * @param recipeName The name of the recipe to remove.
   * @returns An array of custom lists.
   * @throws ListNotFoundError if the recipe is not found in the list.
   */
  removeRecipeFromList(listId: number, recipeName: string): CustomList[] {
    const list = this.findListById(listId);
    const recipeIndex = list.recipes.findIndex(
      (recipe) => slugify(recipe.Name, { lower: true, remove: /[*+~.()'"!:@]/g }) === recipeName
    );

    if (recipeIndex === -1) {
      throw new ListNotFoundError("Recipe not found in the list");
    }

    list.recipes.splice(recipeIndex, 1);

    return this.lists;
  }
}

export default ListsRepository;
