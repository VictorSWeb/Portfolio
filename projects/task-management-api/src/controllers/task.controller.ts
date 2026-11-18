import type { Request, Response } from "express";
import { taskService } from "../services/task.service";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema
} from "../validators/task.validator";

export const createTask = (req: Request, res: Response): void => {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid task data",
      details: result.error.issues
    });
    return;
  }

  res.status(201).json(taskService.create(result.data));
};

export const listTasks = (req: Request, res: Response): void => {
  const result = listTasksQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid query parameters",
      details: result.error.issues
    });
    return;
  }

  res.status(200).json(taskService.findAll(result.data));
};

export const getTask = (req: Request, res: Response): void => {
  const result = taskIdSchema.safeParse(req.params.id);

  if (!result.success) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  const task = taskService.findById(result.data);

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(200).json(task);
};

export const updateTask = (req: Request, res: Response): void => {
  const idResult = taskIdSchema.safeParse(req.params.id);

  if (!idResult.success) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid task data",
      details: result.error.issues
    });
    return;
  }

  const task = taskService.update(idResult.data, result.data);

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(200).json(task);
};

export const deleteTask = (req: Request, res: Response): void => {
  const result = taskIdSchema.safeParse(req.params.id);

  if (!result.success) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  if (!taskService.delete(result.data)) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(204).send();
};
