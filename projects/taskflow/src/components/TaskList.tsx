import { Icon } from './Icon'
import type { Task, TaskStatus } from '../types/task'

interface TaskListProps {
  tasks: Task[]
  hasTasks: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (id: string, status: TaskStatus) => void
  onCreate: () => void
  onClearFilters: () => void
}

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendente',
  'in-progress': 'Em andamento',
  completed: 'Concluída',
}

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

function formatDate(value: string | null): string {
  if (!value) return 'Sem prazo'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(new Date(`${value}T12:00:00`))
    .replace('.', '')
}

export function TaskList({
  tasks,
  hasTasks,
  onEdit,
  onDelete,
  onStatusChange,
  onCreate,
  onClearFilters,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon"><Icon name={hasTasks ? 'search' : 'check'} /></span>
        <h3>{hasTasks ? 'Nenhuma tarefa encontrada' : 'Seu espaço está pronto'}</h3>
        <p>
          {hasTasks
            ? 'Ajuste a pesquisa ou os filtros para encontrar suas tarefas.'
            : 'Adicione sua primeira tarefa para começar a organizar seu dia.'}
        </p>
        {hasTasks ? (
          <button className="secondary-button" onClick={onClearFilters} type="button">Limpar filtros</button>
        ) : (
          <button className="new-task-button" onClick={onCreate} type="button">
            <Icon name="plus" /> Criar primeira tarefa
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article className="task-row" key={task.id}>
          <button
            aria-label={`Marcar como ${task.status === 'completed' ? 'pendente' : 'concluída'}: ${task.title}`}
            aria-pressed={task.status === 'completed'}
            className={`task-checkbox${task.status === 'completed' ? ' checked' : ''}`}
            onClick={() => onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')}
            type="button"
          >
            {task.status === 'completed' && <Icon name="check" />}
          </button>
          <div className="task-copy">
            <h3 className={task.status === 'completed' ? 'task-completed' : ''}>{task.title}</h3>
            <p>{task.description || 'Sem descrição'}</p>
          </div>
          <span className={`priority priority-${task.priority}`}>{priorityLabels[task.priority]}</span>
          <label className={`status-select status-${task.status}`}>
            <span className="visually-hidden">Status de {task.title}</span>
            <select
              aria-label={`Alterar status de ${task.title}`}
              onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
              value={task.status}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <span className="task-due">
            <Icon name="calendar" />
            {formatDate(task.dueDate)}
          </span>
          <span className="task-created">
            Criada {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(task.createdAt))}
          </span>
          <div className="task-actions">
            <button type="button" className="row-action" aria-label={`Editar ${task.title}`} onClick={() => onEdit(task)}>
              <Icon name="edit" />
            </button>
            <button type="button" className="row-action delete-action" aria-label={`Excluir ${task.title}`} onClick={() => onDelete(task)}>
              <Icon name="trash" />
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
