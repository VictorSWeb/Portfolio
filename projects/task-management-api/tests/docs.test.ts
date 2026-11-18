import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { app } from "../src/app";

describe("API documentation", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("serves the OpenAPI specification with all API endpoints", async () => {
    const response = await fetch(`${baseUrl}/api/docs.json`);
    const spec = await response.json();

    expect(response.status).toBe(200);
    expect(spec.openapi).toBe("3.0.3");
    expect(Object.keys(spec.paths)).toEqual(
      expect.arrayContaining(["/api/health", "/api/tasks", "/api/tasks/{id}"])
    );
    expect(spec.paths["/api/tasks/{id}"]).toHaveProperty("put");
    expect(spec.paths["/api/tasks/{id}"]).toHaveProperty("delete");
    expect(spec.components.parameters.TaskId.schema.format).toBe("uuid");
    expect(spec.components.responses.InvalidTaskId.description).toContain("valid UUID");
    expect(spec.paths["/api/tasks/{id}"].get.responses).toHaveProperty("400");
    expect(spec.paths["/api/tasks/{id}"].put.responses).toHaveProperty("400");
    expect(spec.paths["/api/tasks/{id}"].delete.responses).toHaveProperty("400");
    expect(spec.paths["/api/tasks"].get.parameters).toHaveLength(7);
    expect(spec.components.schemas.Task.properties.dueDate.format).toBe("date-time");
  });

  it("serves the Swagger UI", async () => {
    const response = await fetch(`${baseUrl}/api/docs`);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("swagger-ui");
  });
});
