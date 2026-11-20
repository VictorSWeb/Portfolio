import express from "express";
import { healthRouter } from "./routes/health.routes";
import { taskRouter } from "./routes/task.routes";
import { docsRouter } from "./routes/docs.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";

const app = express();

app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", taskRouter);
app.use("/api", docsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
