import { useCallback, useState } from 'react'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types/task'
import { taskPriorities, taskStatuses } from '../types/task'

const storageKey = 'taskflow.tasks.v1'

interface LoadedTasks {
  tasks: Task[]
  error: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.title === 'string' &&
    value.title.trim().length > 0 &&
    typeof value.description === 'string' &&
    taskPriorities.includes(value.priority as TaskPriority) &&
    taskStatuses.includes(value.status as TaskStatus) &&
    isDate(value.createdAt) &&
    (value.dueDate === null ||
      (typeof value.dueDate === 'string' && isCalendarDate(value.dueDate)))
  )
}

function loadTasks(): LoadedTasks {
  try {
    const storedTasks = window.localStorage.getItem(storageKey)
    if (storedTasks === null) return { tasks: [], error: null }

    const parsed: unknown = JSON.parse(storedTasks)
    if (!Array.isArray(parsed) || !parsed.every(isTask)) {
      return {
        tasks: [],
        error: 'Os dados salvos estavam inválidos. A lista foi iniciada vazia.',
      }
    }

    const ids = parsed.map((task) => task.id)
    if (new Set(ids).size !== ids.length) {
      return {
        tasks: [],
        error: 'Os dados salvos continham tarefas duplicadas e não puderam ser carregados.',
      }
    }

    return { tasks: parsed, error: null }
  } catch {
    return {
      tasks: [],
      error: 'Não foi possível ler as tarefas salvas neste navegador.',
    }
  }
}

function createId(existingIds: ReadonlySet<string>): string {
  let id: string
  do {
    id = globalThis.crypto?.randomUUID?.() ??
      `task-${Date.now()}-${Math.random().toString(36).slice(2)}`
  } while (existingIds.has(id))
  return id
}

export function useTasks() {
  const [loaded] = useState<LoadedTasks>(loadTasks)
  const [tasks, setTasks] = useState<Task[]>(loaded.tasks)
  const [storageError, setStorageError] = useState<string | null>(loaded.error)

  const save = useCallback((nextTasks: Task[]): boolean => {
    setTasks(nextTasks)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextTasks))
      setStorageError(null)
      return true
    } catch {
      setStorageError('Alterações mantidas nesta sessão, mas não foi possível salvar no navegador.')
      return false
    }
  }, [])

  const createTask = useCallback((input: TaskInput): boolean => {
    const task: Task = {
      ...input,
      id: createId(new Set(tasks.map((task) => task.id))),
      title: input.title.trim(),
      description: input.description.trim(),
      createdAt: new Date().toISOString(),
    }
    return save([task, ...tasks])
  }, [save, tasks])

  const updateTask = useCallback((id: string, input: TaskInput): boolean => {
    const existing = tasks.find((task) => task.id === id)
    if (!existing) return false

    return save(tasks.map((task) =>
      task.id === id
        ? { ...task, ...input, title: input.title.trim(), description: input.description.trim() }
        : task,
    ))
  }, [save, tasks])

  const deleteTask = useCallback((id: string): boolean => {
    return save(tasks.filter((task) => task.id !== id))
  }, [save, tasks])

  const changeStatus = useCallback((id: string, status: TaskStatus): boolean => {
    return save(tasks.map((task) => task.id === id ? { ...task, status } : task))
  }, [save, tasks])

  return { tasks, storageError, createTask, updateTask, deleteTask, changeStatus }
}
