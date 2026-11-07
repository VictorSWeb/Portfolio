import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './components/Icon'
import { TaskFilters } from './components/TaskFilters'
import { TaskFormModal } from './components/TaskFormModal'
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTasks'
import type { Task, TaskInput, TaskPriority, TaskSort, TaskStatus } from './types/task'
import './App.css'

interface Feedback {
  type: 'success' | 'error'
  message: string
}

const priorityRank: Record<TaskPriority, number> = { low: 1, medium: 2, high: 3 }

function App() {
  const { tasks, storageError, createTask, updateTask, deleteTask, changeStatus } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [sort, setSort] = useState<TaskSort>('created-desc')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)

  const notify = useCallback((message: string, type: Feedback['type'] = 'success') => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    setFeedback({ message, type })
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3600)
  }, [])

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
  }, [])

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR')
    const filtered = tasks.filter((task) => {
      const matchesSearch = !query ||
        task.title.toLocaleLowerCase('pt-BR').includes(query) ||
        task.description.toLocaleLowerCase('pt-BR').includes(query)
      return matchesSearch &&
        (statusFilter === 'all' || task.status === statusFilter) &&
        (priorityFilter === 'all' || task.priority === priorityFilter)
    })

    return filtered.sort((first, second) => {
      switch (sort) {
        case 'created-asc':
          return Date.parse(first.createdAt) - Date.parse(second.createdAt)
        case 'due-asc':
        case 'due-desc': {
          if (!first.dueDate) return second.dueDate ? 1 : 0
          if (!second.dueDate) return -1
          const direction = sort === 'due-asc' ? 1 : -1
          return direction * (Date.parse(first.dueDate) - Date.parse(second.dueDate))
        }
        case 'priority-asc':
          return priorityRank[first.priority] - priorityRank[second.priority]
        case 'priority-desc':
          return priorityRank[second.priority] - priorityRank[first.priority]
        case 'created-desc':
        default:
          return Date.parse(second.createdAt) - Date.parse(first.createdAt)
      }
    })
  }, [tasks, search, statusFilter, priorityFilter, sort])

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    inProgress: tasks.filter((task) => task.status === 'in-progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  }), [tasks])

  function openCreateModal() {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  function openEditModal(task: Task) {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  function handleSaveTask(input: TaskInput) {
    if (editingTask) {
      const saved = updateTask(editingTask.id, input)
      notify(
        saved ? 'Tarefa atualizada com sucesso.' : 'Não foi possível atualizar a tarefa.',
        saved ? 'success' : 'error',
      )
    } else {
      const saved = createTask(input)
      notify(
        saved ? 'Tarefa criada com sucesso.' : 'Tarefa criada nesta sessão, mas não foi possível salvá-la.',
        saved ? 'success' : 'error',
      )
    }
    closeModal()
  }

  function handleDeleteTask(task: Task) {
    if (!window.confirm(`Tem certeza de que deseja excluir "${task.title}"? Esta ação não pode ser desfeita.`)) {
      return
    }
    const saved = deleteTask(task.id)
    notify(
      saved ? 'Tarefa excluída com sucesso.' : 'Tarefa removida desta sessão, mas não foi possível salvá-la.',
      saved ? 'success' : 'error',
    )
  }

  function handleStatusChange(id: string, status: TaskStatus) {
    const saved = changeStatus(id, status)
    if (!saved) {
      notify('O status foi alterado nesta sessão, mas não foi possível salvar.', 'error')
    } else {
      notify('Status da tarefa atualizado.')
    }
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setPriorityFilter('all')
  }

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="TaskFlow, página inicial">
          <span className="brand-mark"><Icon name="check" /></span>
          <span>task<span>flow</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Navegação principal">
          <a className="nav-link" href="#overview">
            <Icon name="grid" />
            <span>Visão geral</span>
          </a>
          <a aria-current="page" className="nav-link active" href="#tasks">
            <Icon name="check" />
            <span>Minhas tarefas</span>
            <span className="nav-count">{counts.total}</span>
          </a>
          <a className="nav-link" href="#tasks">
            <Icon name="calendar" />
            <span>Calendário</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-link" href="#settings">
            <Icon name="settings" />
            <span>Configurações</span>
          </a>
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <strong>Faça mais com o Pro</strong>
            <p>Desbloqueie todo o potencial da sua equipe.</p>
            <button type="button" className="upgrade-button">Conhecer planos</button>
          </div>
          <div className="profile">
            <div className="avatar avatar-profile">TF</div>
            <div className="profile-info">
              <strong>Meu espaço</strong>
              <span>Tarefas pessoais</span>
            </div>
            <Icon name="more" className="profile-more" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Tarefas</strong></div>
          <div className="topbar-actions">
            <button
              type="button"
              className="icon-button search-button"
              aria-label="Pesquisar tarefas"
              onClick={() => searchInput.current?.focus()}
            >
              <Icon name="search" />
            </button>
            <span className="icon-button notification-button" aria-label="Notificações">
              <Icon name="bell" />
            </span>
            <div className="avatar avatar-top">TF</div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading" id="overview">
            <div>
              <p className="eyebrow">{today.toLocaleUpperCase('pt-BR')}</p>
              <h1>Minhas tarefas</h1>
              <p className="page-description">Acompanhe e organize tudo o que precisa ser feito.</p>
            </div>
            <button type="button" className="new-task-button" onClick={openCreateModal}>
              <Icon name="plus" />
              Nova tarefa
            </button>
          </section>

          {storageError && <div className="storage-warning" role="alert">{storageError}</div>}

          <section className="stats-grid" aria-label="Resumo das tarefas">
            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon total-icon"><Icon name="grid" /></span>
                <span className="stat-note">No seu espaço</span>
              </div>
              <p>Total de tarefas</p>
              <div className="stat-value">{counts.total} <span>tarefas</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon pending-icon"><Icon name="calendar" /></span>
                <span className="stat-note">Aguardando início</span>
              </div>
              <p>Pendentes</p>
              <div className="stat-value">{counts.pending} <span>tarefas</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon progress-icon"><Icon name="clock" /></span>
                <span className="stat-note">Em progresso</span>
              </div>
              <p>Em andamento</p>
              <div className="stat-value">{counts.inProgress} <span>tarefas</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon completed-icon"><Icon name="check" /></span>
                <span className="stat-note">Finalizadas</span>
              </div>
              <p>Tarefas concluídas</p>
              <div className="stat-value">{counts.completed} <span>tarefas</span></div>
            </article>
          </section>

          <section className="tasks-section" id="tasks">
            <div className="tasks-heading">
              <div>
                <h2>Lista de tarefas</h2>
                <p>{visibleTasks.length} {visibleTasks.length === 1 ? 'tarefa' : 'tarefas'} exibida{visibleTasks.length === 1 ? '' : 's'}</p>
              </div>
              <button type="button" className="new-task-button compact-new-task" onClick={openCreateModal}>
                <Icon name="plus" />
                Nova tarefa
              </button>
            </div>

            <TaskFilters
              onPriorityChange={setPriorityFilter}
              onSearchChange={setSearch}
              onSortChange={setSort}
              onStatusChange={setStatusFilter}
              priority={priorityFilter}
              searchInputRef={searchInput}
              search={search}
              sort={sort}
              status={statusFilter}
            />

            <TaskList
              hasTasks={tasks.length > 0}
              onClearFilters={clearFilters}
              onCreate={openCreateModal}
              onDelete={handleDeleteTask}
              onEdit={openEditModal}
              onStatusChange={handleStatusChange}
              tasks={visibleTasks}
            />
          </section>

          <footer className="page-footer">© {new Date().getFullYear()} TaskFlow <span>•</span> Feito para ajudar você a fazer acontecer.</footer>
        </div>
      </main>

      {isModalOpen && (
        <TaskFormModal task={editingTask} onClose={closeModal} onSave={handleSaveTask} />
      )}
      {feedback && (
        <div className={`toast toast-${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
          <span className="toast-indicator" />
          {feedback.message}
          <button type="button" aria-label="Dispensar mensagem" onClick={() => setFeedback(null)}>
            <Icon name="close" />
          </button>
        </div>
      )}
    </div>
  )
}

export default App
