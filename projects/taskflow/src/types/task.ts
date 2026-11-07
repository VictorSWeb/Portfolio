export const taskStatuses = ['pending', 'in-progress', 'completed'] as const
export const taskPriorities = ['low', 'medium', 'high'] as const

export type TaskStatus = (typeof taskStatuses)[number]
export type TaskPriority = (typeof taskPriorities)[number]

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
  dueDate: string | null
}

export interface TaskInput {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string | null
}

export type TaskSort =
  | 'created-desc'
  | 'created-asc'
  | 'due-asc'
  | 'due-desc'
  | 'priority-desc'
  | 'priority-asc'
