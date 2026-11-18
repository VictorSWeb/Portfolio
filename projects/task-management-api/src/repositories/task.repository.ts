export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const taskStore = new Map<string, Task>();

export const taskRepository = {
  create(task: Task): Task {
    taskStore.set(task.id, task);
    return task;
  },

  update(
    id: string,
    changes: Partial<Omit<Task, "id" | "createdAt">>
  ): Task | undefined {
    const task = taskStore.get(id);

    if (!task) {
      return undefined;
    }

    const updatedTask = {
      ...task,
      ...changes,
      id: task.id,
      createdAt: task.createdAt
    };

    taskStore.set(id, updatedTask);
    return updatedTask;
  },

  findAll(): Task[] {
    return Array.from(taskStore.values());
  },

  findById(id: string): Task | undefined {
    return taskStore.get(id);
  },

  deleteById(id: string): boolean {
    return taskStore.delete(id);
  }
};
