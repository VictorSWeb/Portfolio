export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Task Management API",
    version: "1.0.0",
    description:
      "A REST API for managing tasks. Task data is stored in memory and is lost when the server restarts."
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "Health", description: "API health check" },
    { name: "Tasks", description: "Task management" }
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "The API is running.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
                example: { status: "ok" }
              }
            }
          }
        }
      }
    },
    "/api/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List, filter, search, sort, and paginate tasks",
        operationId: "listTasks",
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            description: "Filter tasks by status.",
            schema: {
              type: "string",
              enum: ["PENDING", "IN_PROGRESS", "COMPLETED"]
            }
          },
          {
            name: "priority",
            in: "query",
            required: false,
            description: "Filter tasks by priority.",
            schema: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] }
          },
          {
            name: "search",
            in: "query",
            required: false,
            description: "Case-insensitive substring search in task titles.",
            schema: { type: "string" },
            example: "release"
          },
          {
            name: "sortBy",
            in: "query",
            required: false,
            description: "Field used to sort the matching tasks.",
            schema: {
              type: "string",
              enum: ["createdAt", "updatedAt", "dueDate"],
              default: "createdAt"
            }
          },
          {
            name: "sortOrder",
            in: "query",
            required: false,
            description: "Sort direction.",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" }
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "One-based page number.",
            schema: { type: "integer", minimum: 1, default: 1 }
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Number of tasks per page; maximum 100.",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 }
          }
        ],
        responses: {
          "200": {
            description: "A page of matching tasks and pagination metadata.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskListResponse" },
                example: {
                  data: [
                    {
                      id: "c2d94e0f-a0de-4c61-a181-11e831c67e91",
                      title: "Prepare release",
                      description: "Review the release checklist",
                      priority: "HIGH",
                      status: "IN_PROGRESS",
                      dueDate: "2026-12-01T09:00:00.000Z",
                      createdAt: "2026-11-17T19:00:00.000Z",
                      updatedAt: "2026-11-17T19:00:00.000Z"
                    }
                  ],
                  pagination: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1
                  }
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/InvalidQuery" }
        }
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        operationId: "createTask",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskRequest" },
              example: {
                title: "Prepare release",
                description: "Review the release checklist",
                priority: "HIGH",
                status: "IN_PROGRESS",
                dueDate: "2026-12-01T09:00:00.000Z"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Task created.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
                example: {
                  id: "c2d94e0f-a0de-4c61-a181-11e831c67e91",
                  title: "Prepare release",
                  description: "Review the release checklist",
                  priority: "HIGH",
                  status: "IN_PROGRESS",
                  dueDate: "2026-12-01T09:00:00.000Z",
                  createdAt: "2026-11-17T19:00:00.000Z",
                  updatedAt: "2026-11-17T19:00:00.000Z"
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/InvalidTask" }
        }
      }
    },
    "/api/tasks/{id}": {
      parameters: [{ $ref: "#/components/parameters/TaskId" }],
      get: {
        tags: ["Tasks"],
        summary: "Get a task by ID",
        operationId: "getTask",
        responses: {
          "200": {
            description: "The requested task.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
                example: {
                  id: "c2d94e0f-a0de-4c61-a181-11e831c67e91",
                  title: "Prepare release",
                  description: "Review the release checklist",
                  priority: "HIGH",
                  status: "IN_PROGRESS",
                  dueDate: "2026-12-01T09:00:00.000Z",
                  createdAt: "2026-11-17T19:00:00.000Z",
                  updatedAt: "2026-11-17T19:00:00.000Z"
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/InvalidTaskId" },
          "404": { $ref: "#/components/responses/TaskNotFound" }
        }
      },
      put: {
        tags: ["Tasks"],
        summary: "Update one or more task fields",
        operationId: "updateTask",
        requestBody: {
          required: true,
          description:
            "At least one field is required. The task ID and createdAt timestamp cannot be changed.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskRequest" },
              example: { status: "COMPLETED" }
            }
          }
        },
        responses: {
          "200": {
            description: "Task updated; updatedAt is refreshed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
                example: {
                  id: "c2d94e0f-a0de-4c61-a181-11e831c67e91",
                  title: "Prepare release",
                  description: "Review the release checklist",
                  priority: "HIGH",
                  status: "COMPLETED",
                  dueDate: "2026-12-01T09:00:00.000Z",
                  createdAt: "2026-11-17T19:00:00.000Z",
                  updatedAt: "2026-11-17T19:30:00.000Z"
                }
              }
            }
          },
          "400": { $ref: "#/components/responses/InvalidTask" },
          "404": { $ref: "#/components/responses/TaskNotFound" }
        }
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        operationId: "deleteTask",
        responses: {
          "204": { description: "Task deleted; no response body." },
          "400": { $ref: "#/components/responses/InvalidTaskId" },
          "404": { $ref: "#/components/responses/TaskNotFound" }
        }
      }
    }
  },
  components: {
    parameters: {
      TaskId: {
        name: "id",
        in: "path",
        required: true,
        description: "Task identifier in UUID format.",
        schema: { type: "string", format: "uuid" },
        example: "c2d94e0f-a0de-4c61-a181-11e831c67e91"
      }
    },
    schemas: {
      HealthResponse: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["ok"], example: "ok" }
        }
      },
      Task: {
        type: "object",
        required: ["id", "title", "priority", "status", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", minLength: 3, maxLength: 100 },
          description: { type: "string", maxLength: 500 },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          status: {
            type: "string",
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED"]
          },
          dueDate: {
            type: "string",
            format: "date-time",
            description: "Optional due date in ISO 8601 format."
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      CreateTaskRequest: {
        type: "object",
        required: ["title", "priority", "status"],
        properties: {
          title: { type: "string", minLength: 3, maxLength: 100 },
          description: { type: "string", maxLength: 500 },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          status: {
            type: "string",
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED"]
          },
          dueDate: { type: "string", format: "date-time" }
        }
      },
      UpdateTaskRequest: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          title: { type: "string", minLength: 3, maxLength: 100 },
          description: { type: "string", maxLength: 500 },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          status: {
            type: "string",
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED"]
          },
          dueDate: { type: "string", format: "date-time" }
        }
      },
      TaskListResponse: {
        type: "object",
        required: ["data", "pagination"],
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Task" }
          },
          pagination: { $ref: "#/components/schemas/Pagination" }
        }
      },
      Pagination: {
        type: "object",
        required: ["total", "page", "limit", "totalPages"],
        properties: {
          total: { type: "integer", minimum: 0 },
          page: { type: "integer", minimum: 1 },
          limit: { type: "integer", minimum: 1, maximum: 100 },
          totalPages: { type: "integer", minimum: 0 }
        }
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: { type: "string" },
          details: {
            type: "array",
            items: {
              type: "object",
              required: ["code", "path", "message"],
              properties: {
                code: { type: "string" },
                path: { type: "array", items: { oneOf: [{ type: "string" }, { type: "integer" }] } },
                message: { type: "string" }
              },
              additionalProperties: true
            }
          }
        }
      }
    },
    responses: {
      InvalidQuery: {
        description: "One or more query parameters are invalid.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: {
              error: "Invalid query parameters",
              details: [
                {
                  code: "invalid_value",
                  path: ["limit"],
                  message: "Too big: expected number to be <=100"
                }
              ]
            }
          }
        }
      },
      InvalidTask: {
        description: "The request body is invalid.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: {
              error: "Invalid task data",
              details: [
                {
                  code: "too_small",
                  path: ["title"],
                  message: "Too small: expected string to have >=3 characters"
                }
              ]
            }
          }
        }
      },
      InvalidTaskId: {
        description: "The task ID parameter is not a valid UUID.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Invalid task ID" }
          }
        }
      },
      TaskNotFound: {
        description: "No task exists with the supplied valid UUID.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Task not found" }
          }
        }
      }
    }
  }
} as const;
