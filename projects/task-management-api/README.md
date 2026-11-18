# Task Management API

A small REST API for creating, querying, updating, and deleting tasks. It is built with Express and TypeScript, validates request data with Zod, and exposes interactive API documentation through Swagger UI.

## Technologies

- Node.js
- TypeScript (strict mode)
- Express
- Zod
- Swagger UI and OpenAPI 3.0
- Vitest

## Features

- Create, list, retrieve, update, and delete tasks.
- Filter tasks by status and priority.
- Search task titles without case sensitivity.
- Sort by creation date, update date, or optional due date.
- Paginate task results.
- Validate request bodies and query parameters with Zod.
- Browse the API using Swagger UI.

## API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Check API health. |
| GET | `/api/tasks` | List tasks with optional filtering, search, sorting, and pagination. |
| GET | `/api/tasks/:id` | Retrieve one task by ID. |
| POST | `/api/tasks` | Create a task. |
| PUT | `/api/tasks/:id` | Update one or more fields on a task. |
| DELETE | `/api/tasks/:id` | Delete a task. |

Task status values are `PENDING`, `IN_PROGRESS`, and `COMPLETED`. Priority values are `LOW`, `MEDIUM`, and `HIGH`. A task may have an optional ISO 8601 `dueDate`.

### List query parameters

| Parameter | Description | Allowed values / default |
| --- | --- | --- |
| `status` | Filter by task status. | `PENDING`, `IN_PROGRESS`, `COMPLETED` |
| `priority` | Filter by task priority. | `LOW`, `MEDIUM`, `HIGH` |
| `search` | Case-insensitive substring search in the title. | Optional text |
| `sortBy` | Sort field. | `createdAt`, `updatedAt`, `dueDate`; default `createdAt` |
| `sortOrder` | Sort direction. | `asc`, `desc`; default `desc` |
| `page` | One-based page number. | Integer >= 1; default `1` |
| `limit` | Number of results per page. | Integer 1–100; default `10` |

Filters and sorting are applied before pagination. The response has this shape:

```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

### API documentation

When the server is running:

- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs.json`

## Installation

Use Node.js and npm, then install the project dependencies:

```bash
npm install
```

The server uses port `3000` by default. To choose another port, set `PORT` in your environment or create a local `.env` file:

```env
PORT=3000
```

## Development

Start the API with automatic TypeScript reload:

```bash
npm run dev
```

Build and run the compiled server:

```bash
npm run build
npm start
```

## Testing

Run the test suite:

```bash
npm test
```

Vitest tests cover task endpoints, validation, querying, and the documentation routes.

## Important Limitations

- **Task records are stored in memory only. They are lost when the server restarts.** This project does not use a database and does not provide durable storage.
- The in-memory store is local to one running process; it is not shared across instances.
- The API does not implement authentication or authorization.
- This is a starter API and does not include production operational features such as durable persistence or distributed coordination.
