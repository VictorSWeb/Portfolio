import express from "express";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { app } from "../src/app";
import { errorHandler } from "../src/middlewares/error-handler";

describe("API error handling", () => {
  let server: Server;
  let errorServer: Server;
  let baseUrl: string;
  let errorBaseUrl: string;

  beforeAll(async () => {
    server = app.listen(0);
    errorServer = express()
      .get("/unexpected", () => {
        throw new Error("Internal details at C:\\private\\server.ts");
      })
      .use(errorHandler)
      .listen(0);

    await Promise.all([
      new Promise<void>((resolve) => server.once("listening", resolve)),
      new Promise<void>((resolve) => errorServer.once("listening", resolve))
    ]);

    const address = server.address() as AddressInfo;
    const errorAddress = errorServer.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
    errorBaseUrl = `http://127.0.0.1:${errorAddress.port}`;
  });

  afterAll(async () => {
    await Promise.all(
      [server, errorServer].map((runningServer) =>
        new Promise<void>((resolve, reject) => {
          runningServer.close((error) => (error ? reject(error) : resolve()));
        })
      )
    );
  });

  it("returns a JSON 400 for malformed request JSON", async () => {
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"title":'
    });

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({ error: "Invalid JSON" });
  });

  it("returns a JSON 404 for an unknown route", async () => {
    const response = await fetch(`${baseUrl}/route-that-does-not-exist`);

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({ error: "Route not found" });
  });

  it("returns a generic JSON 500 without exposing unexpected error details", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = await fetch(`${errorBaseUrl}/unexpected`);
      const body = await response.text();

      expect(response.status).toBe(500);
      expect(response.headers.get("content-type")).toContain("application/json");
      expect(body).toBe(JSON.stringify({ error: "Internal server error" }));
      expect(body).not.toContain("C:\\private\\server.ts");
    } finally {
      errorLog.mockRestore();
    }
  });
});
