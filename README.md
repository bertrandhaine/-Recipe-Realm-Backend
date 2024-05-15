# Recipe Realm Backend

This is the backend API for the Recipe Realm application, which supports the frontend by providing RESTful API endpoints for managing recipes and custom lists. The API allows users to search for recipes, manage custom lists, and handle recipes within those lists.

## Technologies Used

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Hono**: A lightweight and fast framework for building server-side applications. [Learn more about Hono](https://honojs.dev/).
- **Zod**: For request validation to ensure data integrity.
- **Cors**: To enable CORS for handling resource sharing issues.

## Features

- Retrieve paginated recipes.
- Fetch and create custom lists.
- Add and remove recipes from custom lists.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js installed on your machine.
- NPM (Node Package Manager) for handling dependencies.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/recipe-realm-backend.git
```

2. Navigate to the project directory:

```bash
cd recipe-realm-backend
```

3. Install dependencies:

```bash
npm install
```

### Running the Server

To start the server, run:

```bash
npm start
```

This will start the server on the default port `3000`.

## API Endpoints

The following are the main endpoints provided by this backend:

### Recipes

- `GET /api/recipes/all/:page?/:limit?`
  - **Description**: Retrieve paginated recipes.
  - **Parameters**:
    - `page` (optional): The page number for pagination.
    - `limit` (optional): The number of recipes per page.
  - **Response**: A list of recipes with pagination details.

- `GET /api/recipe/:slug`
  - **Description**: Fetch a single recipe by slug.
  - **Parameters**:
    - `slug`: The slug of the recipe.
  - **Response**: Details of the specified recipe.

### Lists

- `GET /api/lists`
  - **Description**: Retrieve all custom lists.
  - **Response**: A list of all custom lists.

- `POST /api/lists`
  - **Description**: Create a new custom list.
  - **Body**:
    - `title`: The title of the new list.
    - `recipe` (optional): An initial recipe to add to the list.
  - **Response**: The newly created list.

- `DELETE /api/lists/:listId/recipes/:recipeName`
  - **Description**: Remove a recipe from a list.
  - **Parameters**:
    - `listId`: The ID of the list.
    - `recipeName`: The name of the recipe to remove.
  - **Response**: The updated list after removal.

- `POST /api/lists/:listId`
  - **Description**: Add a recipe to a specific list.
  - **Parameters**:
    - `listId`: The ID of the list.
  - **Body**:
    - `recipe`: The recipe to add.
  - **Response**: The updated list after adding the recipe.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Author

- **Bertrand Uemura Haine**

## Contact

For questions or feedback, please reach out to [bertrand.haine@live.fr](mailto:bertrand.haine@live.fr).
