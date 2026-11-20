import type { ErrorRequestHandler, RequestHandler } from "express";

const isMalformedJsonError = (error: unknown): boolean =>
  typeof error === "object"
  && error !== null
  && "type" in error
  && error.type === "entity.parse.failed";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (isMalformedJsonError(error)) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  console.error("Unhandled API error:", error);
  res.status(500).json({ error: "Internal server error" });
};
