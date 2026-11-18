import express from "express";
import { healthRouter } from "./routes/health.routes";
import { taskRouter } from "./routes/task.routes";
import { docsRouter } from "./routes/docs.routes";

const app = express();

app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", taskRouter);
app.use("/api", docsRouter);

export { app };
