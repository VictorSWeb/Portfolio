import type { RefObject } from 'react'
import type { TaskPriority, TaskSort, TaskStatus } from '../types/task'

interface TaskFiltersProps {
  search: string
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  sort: TaskSort
  searchInputRef: RefObject<HTMLInputElement | null>
  onSearchChange: (value: string) => void
  onStatusChange: (value: TaskStatus | 'all') => void
  onPriorityChange: (value: TaskPriority | 'all') => void
  onSortChange: (value: TaskSort) => void
}

export function TaskFilters({
  search,
  status,
  priority,
  sort,
  searchInputRef,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="task-filters" aria-label="Pesquisar, filtrar e ordenar tarefas">
      <label className="search-field">
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          aria-label="Pesquisar por título ou descrição"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar tarefas..."
          ref={searchInputRef}
          type="search"
          value={search}
        />
      </label>
      <label className="filter-control">
        <span>Status</span>
        <select aria-label="Filtrar por status" onChange={(event) => onStatusChange(event.target.value as TaskStatus | 'all')} value={status}>
          <option value="all">Todos</option>
          <option value="pending">Pendente</option>
          <option value="in-progress">Em andamento</option>
          <option value="completed">Concluída</option>
        </select>
      </label>
      <label className="filter-control">
        <span>Prioridade</span>
        <select aria-label="Filtrar por prioridade" onChange={(event) => onPriorityChange(event.target.value as TaskPriority | 'all')} value={priority}>
          <option value="all">Todas</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </label>
      <label className="filter-control sort-control">
        <span>Ordenar</span>
        <select aria-label="Ordenar tarefas" onChange={(event) => onSortChange(event.target.value as TaskSort)} value={sort}>
          <option value="created-desc">Mais recentes</option>
          <option value="created-asc">Mais antigas</option>
          <option value="due-asc">Prazo: mais próximo</option>
          <option value="due-desc">Prazo: mais distante</option>
          <option value="priority-desc">Prioridade: alta primeiro</option>
          <option value="priority-asc">Prioridade: baixa primeiro</option>
        </select>
      </label>
    </div>
  )
}
