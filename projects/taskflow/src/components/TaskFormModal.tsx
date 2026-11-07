import { useEffect, useState, type FormEvent } from 'react'
import { Icon } from './Icon'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types/task'

interface TaskFormModalProps {
  task: Task | null
  onClose: () => void
  onSave: (input: TaskInput) => void
}

const emptyForm: TaskInput = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: null,
}

export function TaskFormModal({ task, onClose, onSave }: TaskFormModalProps) {
  const [form, setForm] = useState<TaskInput>(() => task ? {
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
  } : emptyForm)
  const [titleError, setTitleError] = useState('')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) {
      setTitleError('Informe um título para a tarefa.')
      return
    }

    onSave({ ...form, title, description: form.description.trim() })
  }

  function updateField<Field extends keyof TaskInput>(field: Field, value: TaskInput[Field]) {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'title' && typeof value === 'string' && value.trim()) setTitleError('')
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="task-modal-title"
        aria-modal="true"
        className="task-modal"
        role="dialog"
      >
        <header className="modal-header">
          <div>
            <p className="modal-eyebrow">{task ? 'ATUALIZE OS DETALHES' : 'ORGANIZE SEU DIA'}</p>
            <h2 id="task-modal-title">{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
            <Icon name="close" />
          </button>
        </header>

        <form className="task-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            <span>Título <span className="required-mark">*</span></span>
            <input
              autoFocus
              maxLength={120}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Ex.: Preparar apresentação"
              value={form.title}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'title-error' : undefined}
            />
            {titleError && <small className="field-error" id="title-error">{titleError}</small>}
          </label>

          <label className="form-field">
            <span>Descrição <span className="optional-label">Opcional</span></span>
            <textarea
              maxLength={1000}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Adicione mais detalhes sobre esta tarefa..."
              rows={4}
              value={form.description}
            />
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>Prioridade</span>
              <select
                onChange={(event) => updateField('priority', event.target.value as TaskPriority)}
                value={form.priority}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </label>
            <label className="form-field">
              <span>Status</span>
              <select
                onChange={(event) => updateField('status', event.target.value as TaskStatus)}
                value={form.status}
              >
                <option value="pending">Pendente</option>
                <option value="in-progress">Em andamento</option>
                <option value="completed">Concluída</option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span>Prazo <span className="optional-label">Opcional</span></span>
            <input
              onChange={(event) => updateField('dueDate', event.target.value || null)}
              type="date"
              value={form.dueDate ?? ''}
            />
          </label>

          <footer className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="new-task-button modal-submit">
              {task ? 'Salvar alterações' : 'Criar tarefa'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
