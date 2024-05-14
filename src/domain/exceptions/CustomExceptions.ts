import { StatusCode } from "hono/utils/http-status";

export class BaseError extends Error {
  statusCode: StatusCode | undefined;

  constructor(message: string, name: string, statusCode: StatusCode) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class ListNotFoundError extends BaseError {
  constructor(message: string) {
    super(message, "ListNotFoundError", 404);
  }
}

export class ListExistsError extends BaseError {
  constructor(message: string) {
    super(message, "ListExistsError", 400);
  }
}

export class RecipeNotFoundError extends BaseError {
  constructor(message: string) {
    super(message, "RecipeNotFoundError", 404);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, "ValidationError", 400);
  }
}

export class DuplicateNameRecipeError extends BaseError {
  constructor(message: string) {
    super(message, "DuplicateNameRecipeError", 400);
  }
}
