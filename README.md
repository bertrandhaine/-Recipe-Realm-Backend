# Recipe Realm Backend

This is the backend API for the Recipe Realm application, which supports the frontend by providing RESTful API endpoints for managing recipes and custom lists.

## Technologies Used

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Hono**: A lightweight and fast framework for building server-side applications. [Learn more about Hono](https://honojs.dev/).
- **Validator**: For request validation to ensure data integrity.
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

This will start the server on the port per default `3000`.

## API Endpoints

The following are the main endpoints provided by this backend:

- `GET /api/recipes/:page?/:limit?`: Retrieve paginated recipes.
- `GET /api/recipe/:slug`: Fetch a single recipe by slug.
- `GET /api/lists`: Retrieve all custom lists.
- `POST /api/lists`: Create a new custom list.
- `DELETE /api/lists/:listId/recipes/:recipeName`: Remove a recipe from a list.
- `POST /api/lists/:listId`: Add a recipe to a specific list.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Author

- **Bertrand Uemura Haine**
