import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { app } from "../src/app";
import { taskStore } from "../src/repositories/task.repository";

describe("Task endpoints", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  beforeEach(() => {
    taskStore.clear();
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  const validTask = {
    title: "Prepare release",
    description: "Review the release checklist",
    priority: "HIGH",
    status: "IN_PROGRESS"
  };
  const missingTaskId = "00000000-0000-4000-8000-000000000000";

  const createTaskRequest = async (body: unknown = validTask): Promise<Response> =>
    fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

  const createStoredTask = async (
    body: unknown = validTask
  ): Promise<{ id: string; createdAt: string; updatedAt: string; dueDate?: string }> => {
    const response = await createTaskRequest(body);

    if (response.status !== 201) {
      throw new Error("Task creation failed");
    }

    return response.json();
  };

  const listTasksRequest = (query: Record<string, string> = {}): Promise<Response> => {
    const searchParams = new URLSearchParams(query);
    return fetch(`${baseUrl}/api/tasks?${searchParams}`);
  };

  const updateTaskRequest = async (id: string, body: unknown): Promise<Response> =>
    fetch(`${baseUrl}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

  it("creates a task with generated ID and timestamps", async () => {
    const response = await createTaskRequest();
    const task = await response.json();

    expect(response.status).toBe(201);
    expect(task).toMatchObject(validTask);
    expect(task.id).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(task.createdAt))).toBe(false);
    expect(task.updatedAt).toBe(task.createdAt);
  });

  it("lists all stored tasks", async () => {
    await createTaskRequest();
    await createTaskRequest({ ...validTask, title: "Review deployment" });

    const response = await listTasksRequest();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.data).toHaveLength(2);
    expect(result.pagination).toEqual({
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1
    });
  });

  it("filters tasks by status and priority", async () => {
    const fixtures = [
      { title: "Complete urgent report", status: "COMPLETED", priority: "HIGH" },
      { title: "Complete routine report", status: "COMPLETED", priority: "LOW" },
      { title: "Pending urgent report", status: "PENDING", priority: "HIGH" },
      { title: "Complete urgent archive", status: "COMPLETED", priority: "HIGH" }
    ];
    for (const fixture of fixtures) {
      await createStoredTask({ ...validTask, ...fixture });
    }

    const byStatusResponse = await listTasksRequest({ status: "COMPLETED" });
    const byStatus = await byStatusResponse.json();
    const byPriorityResponse = await listTasksRequest({ priority: "HIGH" });
    const byPriority = await byPriorityResponse.json();
    const combinedResponse = await listTasksRequest({
      status: "COMPLETED",
      priority: "HIGH"
    });
    const combined = await combinedResponse.json();
    const pagedResponse = await listTasksRequest({
      status: "COMPLETED",
      priority: "HIGH",
      sortBy: "createdAt",
      sortOrder: "asc",
      page: "1",
      limit: "1"
    });
    const paged = await pagedResponse.json();

    expect(byStatus.data).toHaveLength(3);
    expect(byStatus.data.every((task: { status: string }) => task.status === "COMPLETED")).toBe(true);
    expect(byPriority.data).toHaveLength(3);
    expect(byPriority.data.every((task: { priority: string }) => task.priority === "HIGH")).toBe(true);
    expect(combined.data.map((task: { title: string }) => task.title).sort()).toEqual([
      "Complete urgent archive",
      "Complete urgent report",
    ]);
    expect(paged.data.map((task: { title: string }) => task.title)).toEqual([
      "Complete urgent report"
    ]);
    expect(paged.pagination.total).toBe(2);
    expect(paged.pagination.totalPages).toBe(2);
  });

  it("searches titles without case sensitivity", async () => {
    await createStoredTask({ ...validTask, title: "Quarterly RELEASE plan" });
    await createStoredTask({ ...validTask, title: "Prepare report" });

    const response = await listTasksRequest({ search: "release" });
    const result = await response.json();

    expect(result.data.map((task: { title: string }) => task.title)).toEqual([
      "Quarterly RELEASE plan"
    ]);
    expect(result.pagination.total).toBe(1);
  });

  it.each([
    ["createdAt", "asc", ["Task Bravo", "Task Charlie", "Task Alpha"]],
    ["createdAt", "desc", ["Task Alpha", "Task Charlie", "Task Bravo"]],
    ["updatedAt", "asc", ["Task Charlie", "Task Alpha", "Task Bravo"]],
    ["updatedAt", "desc", ["Task Bravo", "Task Alpha", "Task Charlie"]],
    ["dueDate", "asc", ["Task Bravo", "Task Charlie", "Task Alpha"]],
    ["dueDate", "desc", ["Task Alpha", "Task Charlie", "Task Bravo"]]
  ])("sorts by %s in %s order before pagination", async (sortBy, sortOrder, expectedTitles) => {
    const fixtures = [
      {
        title: "Task Alpha",
        dueDate: "2026-03-03T00:00:00.000Z",
        createdAt: "2026-01-03T00:00:00.000Z",
        updatedAt: "2026-02-02T00:00:00.000Z"
      },
      {
        title: "Task Bravo",
        dueDate: "2026-03-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-02-03T00:00:00.000Z"
      },
      {
        title: "Task Charlie",
        dueDate: "2026-03-02T00:00:00.000Z",
        createdAt: "2026-01-02T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z"
      }
    ];

    for (const fixture of fixtures) {
      const created = await createStoredTask({ ...validTask, ...fixture });
      const stored = taskStore.get(created.id);
      if (!stored) {
        throw new Error("Created task was not stored");
      }
      stored.createdAt = new Date(fixture.createdAt);
      stored.updatedAt = new Date(fixture.updatedAt);
    }

    const response = await listTasksRequest({
      sortBy,
      sortOrder,
      limit: "2"
    });
    const result = await response.json();

    expect(result.data.map((task: { title: string }) => task.title)).toEqual(
      expectedTitles.slice(0, 2)
    );
    expect(result.pagination.total).toBe(3);
  });

  it("paginates with default values and requested page limits", async () => {
    for (let index = 1; index <= 12; index += 1) {
      await createStoredTask({ ...validTask, title: `Task number ${index}` });
    }

    const defaultResponse = await listTasksRequest();
    const defaultResult = await defaultResponse.json();
    const pageResponse = await listTasksRequest({ page: "2", limit: "5" });
    const pageResult = await pageResponse.json();
    const maxLimitResponse = await listTasksRequest({ limit: "100" });
    const maxLimitResult = await maxLimitResponse.json();

    expect(defaultResult.data).toHaveLength(10);
    expect(defaultResult.pagination).toEqual({
      total: 12,
      page: 1,
      limit: 10,
      totalPages: 2
    });
    expect(pageResult.data).toHaveLength(5);
    expect(pageResult.pagination).toEqual({
      total: 12,
      page: 2,
      limit: 5,
      totalPages: 3
    });
    expect(maxLimitResponse.status).toBe(200);
    expect(maxLimitResult.pagination.limit).toBe(100);
  });

  it.each([
    ["invalid status", "status=BLOCKED"],
    ["invalid priority", "priority=URGENT"],
    ["invalid sort field", "sortBy=title"],
    ["invalid sort direction", "sortOrder=sideways"],
    ["page below 1", "page=0"],
    ["non-integer page", "page=1.5"],
    ["limit below 1", "limit=0"],
    ["limit above 100", "limit=101"],
    ["non-integer limit", "limit=2.5"]
  ])("rejects %s query parameters", async (_description, query) => {
    const response = await fetch(`${baseUrl}/api/tasks?${query}`);

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "Invalid query parameters" });
  });

  it("gets a task by ID", async () => {
    const createdResponse = await createTaskRequest();
    const createdTask = await createdResponse.json();

    const response = await fetch(`${baseUrl}/api/tasks/${createdTask.id}`);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject(validTask);
  });

  it("returns 404 when a task ID does not exist", async () => {
    const response = await fetch(`${baseUrl}/api/tasks/${missingTaskId}`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Task not found" });
  });

  it.each(["GET", "PUT", "DELETE"])("returns 400 for malformed UUIDs on %s", async (method) => {
    const options: RequestInit = { method };
    if (method === "PUT") {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify({ status: "COMPLETED" });
    }

    const response = await fetch(`${baseUrl}/api/tasks/not-a-uuid`, options);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid task ID" });
  });

  it.each([
    ["minimum title length", { ...validTask, title: "abc" }],
    ["maximum title and description lengths", {
      ...validTask,
      title: "a".repeat(100),
      description: "a".repeat(500)
    }],
    ["omitted description", {
      title: "No description",
      priority: "LOW",
      status: "PENDING"
    }]
  ])("accepts %s", async (_description, body) => {
    const response = await createTaskRequest(body);

    expect(response.status).toBe(201);
  });

  it.each([
    ["title shorter than 3 characters", { ...validTask, title: "ab" }],
    ["title longer than 100 characters", { ...validTask, title: "a".repeat(101) }],
    ["description longer than 500 characters", { ...validTask, description: "a".repeat(501) }],
    ["invalid priority", { ...validTask, priority: "URGENT" }],
    ["invalid status", { ...validTask, status: "BLOCKED" }],
    ["missing required title", { ...validTask, title: undefined }]
  ])("returns 400 for %s", async (_description, body) => {
    const response = await createTaskRequest(body);

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "Invalid task data" });
  });

  it("updates a task and preserves its ID and creation timestamp", async () => {
    const createdResponse = await createTaskRequest();
    const createdTask = await createdResponse.json();
    const previousUpdatedAt = new Date("2000-01-01T00:00:00.000Z");
    const storedTask = taskStore.get(createdTask.id);
    if (!storedTask) {
      throw new Error("Created task was not stored");
    }
    storedTask.updatedAt = previousUpdatedAt;

    const response = await updateTaskRequest(createdTask.id, {
      status: "COMPLETED"
    });
    const updatedTask = await response.json();

    expect(response.status).toBe(200);
    expect(updatedTask.id).toBe(createdTask.id);
    expect(updatedTask.createdAt).toBe(createdTask.createdAt);
    expect(Date.parse(updatedTask.updatedAt)).toBeGreaterThan(previousUpdatedAt.getTime());
    expect(updatedTask.status).toBe("COMPLETED");
    expect(updatedTask.title).toBe(createdTask.title);
  });

  it("returns 404 when updating a task that does not exist", async () => {
    const response = await updateTaskRequest(missingTaskId, { status: "COMPLETED" });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Task not found" });
  });

  it.each([
    ["an empty body", {}],
    ["a title shorter than 3 characters", { title: "ab" }],
    ["a title longer than 100 characters", { title: "a".repeat(101) }],
    ["a description longer than 500 characters", { description: "a".repeat(501) }],
    ["an invalid priority", { priority: "URGENT" }],
    ["an invalid status", { status: "BLOCKED" }],
    ["an unknown field", { unexpected: true }]
  ])("returns 400 when updating with %s", async (_description, body) => {
    const createdResponse = await createTaskRequest();
    const createdTask = await createdResponse.json();

    const response = await updateTaskRequest(createdTask.id, body);

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "Invalid task data" });
  });

  it("deletes a task and returns no content", async () => {
    const createdResponse = await createTaskRequest();
    const createdTask = await createdResponse.json();

    const response = await fetch(`${baseUrl}/api/tasks/${createdTask.id}`, {
      method: "DELETE"
    });

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(taskStore.has(createdTask.id)).toBe(false);
  });

  it("returns 404 when deleting a task that does not exist", async () => {
    const response = await fetch(`${baseUrl}/api/tasks/${missingTaskId}`, {
      method: "DELETE"
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Task not found" });
  });
});
