import { randomUUID } from "node:crypto";
import { taskRepository, type Task } from "../repositories/task.repository";
import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput
} from "../validators/task.validator";

interface PaginatedTasks {
  data: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const compareByDate = (
  left: Task,
  right: Task,
  sortBy: ListTasksQuery["sortBy"],
  sortOrder: ListTasksQuery["sortOrder"]
): number => {
  const leftDate = left[sortBy];
  const rightDate = right[sortBy];

  if (!leftDate && !rightDate) {
    return 0;
  }
  if (!leftDate) {
    return 1;
  }
  if (!rightDate) {
    return -1;
  }

  const difference = leftDate.getTime() - rightDate.getTime();
  return sortOrder === "asc" ? difference : -difference;
};

export const taskService = {
  create(input: CreateTaskInput): Task {
    const now = new Date();

    return taskRepository.create({
      id: randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now
    });
  },

  findAll(query: ListTasksQuery): PaginatedTasks {
    const filteredTasks = taskRepository.findAll().filter((task) => {
      const matchesStatus = !query.status || task.status === query.status;
      const matchesPriority = !query.priority || task.priority === query.priority;
      const matchesSearch = !query.search
        || task.title.toLowerCase().includes(query.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });

    filteredTasks.sort((left, right) =>
      compareByDate(left, right, query.sortBy, query.sortOrder)
    );

    const total = filteredTasks.length;
    const start = (query.page - 1) * query.limit;
    const data = filteredTasks.slice(start, start + query.limit);
    const totalPages = Math.ceil(total / query.limit);

    return {
      data,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages
      }
    };
  },

  findById(id: string): Task | undefined {
    return taskRepository.findById(id);
  },

  update(id: string, input: UpdateTaskInput): Task | undefined {
    return taskRepository.update(id, {
      ...input,
      updatedAt: new Date()
    });
  },

  delete(id: string): boolean {
    return taskRepository.deleteById(id);
  }
};
