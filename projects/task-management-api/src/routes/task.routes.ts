import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask
} from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post("/tasks", createTask);
taskRouter.get("/tasks", listTasks);
taskRouter.get("/tasks/:id", getTask);
taskRouter.put("/tasks/:id", updateTask);
taskRouter.delete("/tasks/:id", deleteTask);

export { taskRouter };
