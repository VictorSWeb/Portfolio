"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  createDemoAppointments,
  type AppointmentStatus,
  type ManagedAppointment,
} from "../data";

const STORAGE_KEY = "agendaflow:admin:appointments:v1";
const STORAGE_EVENT = "agendaflow:admin:appointments-updated";
const SERVER_SNAPSHOT = "__server_snapshot__";
const STORAGE_UNAVAILABLE = "__storage_unavailable__";

const statuses: Array<AppointmentStatus | "Todos"> = [
  "Todos",
  "Pendente",
  "Confirmado",
  "Cancelado",
];

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return STORAGE_UNAVAILABLE;
  }
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function isAppointmentStatus(value: unknown): value is AppointmentStatus {
  return value === "Pendente" || value === "Confirmado" || value === "Cancelado";
}

function isDateISO(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isManagedAppointment(value: unknown): value is ManagedAppointment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const appointment = value as Record<string, unknown>;

  return (
    typeof appointment.id === "string" &&
    typeof appointment.client === "string" &&
    typeof appointment.phone === "string" &&
    typeof appointment.email === "string" &&
    typeof appointment.service === "string" &&
    typeof appointment.professional === "string" &&
    typeof appointment.date === "string" &&
    isDateISO(appointment.dateISO) &&
    typeof appointment.time === "string" &&
    typeof appointment.price === "number" &&
    Number.isFinite(appointment.price) &&
    isAppointmentStatus(appointment.status)
  );
}

function isManagedAppointmentList(value: unknown): value is ManagedAppointment[] {
  if (!Array.isArray(value) || !value.every(isManagedAppointment)) {
    return false;
  }

  return new Set(value.map((appointment) => appointment.id)).size === value.length;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function formatDate(dateISO: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateISO}T12:00:00`));
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const styles = {
    Pendente: "border-[#ead8ad] bg-[#fbf1dc] text-[#94600c]",
    Confirmado: "border-[#cfe2d2] bg-[#e7f2e9] text-[#39734a]",
    Cancelado: "border-[#eccdca] bg-[#f7e8e6] text-[#a23a34]",
  };
  const dots = {
    Pendente: "bg-[#c18a28]",
    Confirmado: "bg-[#538561]",
    Cancelado: "bg-[#ba514a]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969189]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-[#383530]">{value}</dd>
    </div>
  );
}

function AppointmentCard({
  appointment,
  canUpdate,
  expanded,
  onToggleDetails,
  onUpdateStatus,
}: {
  appointment: ManagedAppointment;
  canUpdate: boolean;
  expanded: boolean;
  onToggleDetails: () => void;
  onUpdateStatus: (status: AppointmentStatus) => void;
}) {
  const borderColor = {
    Pendente: "border-l-[#c18a28]",
    Confirmado: "border-l-[#538561]",
    Cancelado: "border-l-[#ba514a]",
  }[appointment.status];
  const detailsId = `appointment-details-${appointment.id}`;

  return (
    <li>
      <article
        className={`rounded-2xl border border-l-[3px] ${borderColor} border-[#eae6de] bg-white p-4 shadow-[0_3px_14px_rgba(40,34,25,0.03)] sm:p-5`}
      >
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_0.85fr_0.65fr_auto] lg:items-center">
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#302d29]">{appointment.client}</p>
            <p className="mt-1 text-xs text-[#77736c]">{appointment.phone}</p>
            <p className="mt-0.5 truncate text-xs text-[#77736c]">{appointment.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#4c4842]">{appointment.service}</p>
            <p className="mt-1 text-xs text-[#89847c]">{appointment.professional}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#383530]">{formatDate(appointment.dateISO)}</p>
            <p className="mt-1 text-xs text-[#89847c]">{appointment.time}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#383530]">{formatPrice(appointment.price)}</p>
            <div className="mt-2 lg:hidden">
              <StatusBadge status={appointment.status} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <span className="hidden lg:inline-flex">
              <StatusBadge status={appointment.status} />
            </span>
            {appointment.status === "Pendente" && (
              <button
                className="rounded-lg bg-[#9f2924] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#84221e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canUpdate}
                onClick={() => onUpdateStatus("Confirmado")}
                type="button"
              >
                Confirmar
              </button>
            )}
            {appointment.status !== "Cancelado" && (
              <button
                className="rounded-lg border border-[#e5ded4] px-3 py-2 text-xs font-semibold text-[#716a61] transition-colors hover:bg-[#f7f5f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canUpdate}
                onClick={() => onUpdateStatus("Cancelado")}
                type="button"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 border-t border-[#f0eee9] pt-3">
          <button
            aria-controls={detailsId}
            aria-expanded={expanded}
            className="text-xs font-semibold text-[#9f2924] underline decoration-[#9f2924]/30 underline-offset-4 hover:decoration-[#9f2924] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9f2924]"
            onClick={onToggleDetails}
            type="button"
          >
            {expanded ? "Ocultar detalhes" : "Visualizar detalhes"}
          </button>
          {expanded && (
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl bg-[#faf9f6] p-4 sm:grid-cols-3 lg:grid-cols-5" id={detailsId}>
              <Detail label="Cliente" value={appointment.client} />
              <Detail label="Telefone" value={appointment.phone} />
              <Detail label="E-mail" value={appointment.email} />
              <Detail label="Serviço" value={appointment.service} />
              <Detail label="Profissional" value={appointment.professional} />
              <Detail label="Data" value={formatDate(appointment.dateISO)} />
              <Detail label="Horário" value={appointment.time} />
              <Detail label="Preço" value={formatPrice(appointment.price)} />
              <Detail label="Status" value={appointment.status} />
            </dl>
          )}
        </div>
      </article>
    </li>
  );
}

export default function AppointmentManager() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "Todos">("Todos");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const data = useMemo(() => {
    if (snapshot === SERVER_SNAPSHOT) {
      return { appointments: [], loading: true, error: "" };
    }

    if (snapshot === STORAGE_UNAVAILABLE) {
      return {
        appointments: createDemoAppointments(),
        loading: false,
        error: "O navegador não permitiu acessar o LocalStorage. As alterações não poderão ser salvas.",
      };
    }

    if (snapshot === null) {
      return { appointments: createDemoAppointments(), loading: false, error: "" };
    }

    try {
      const saved: unknown = JSON.parse(snapshot);
      if (!isManagedAppointmentList(saved)) {
        throw new Error("Os agendamentos salvos têm um formato inválido.");
      }
      return { appointments: saved, loading: false, error: "" };
    } catch {
      return {
        appointments: createDemoAppointments(),
        loading: false,
        error: "Não foi possível ler os agendamentos salvos. As alterações estão desativadas.",
      };
    }
  }, [snapshot]);

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return data.appointments.filter((appointment) => {
      const matchesStatus = statusFilter === "Todos" || appointment.status === statusFilter;
      const matchesDate = !dateFilter || appointment.dateISO === dateFilter;
      const matchesClient =
        !normalizedSearch || appointment.client.toLocaleLowerCase("pt-BR").includes(normalizedSearch);

      return matchesStatus && matchesDate && matchesClient;
    });
  }, [data.appointments, dateFilter, search, statusFilter]);

  function updateStatus(id: string, status: AppointmentStatus) {
    const updatedAppointments = data.appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment,
    );

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAppointments));
      window.dispatchEvent(new Event(STORAGE_EVENT));
      setFeedback(`Agendamento ${status.toLocaleLowerCase("pt-BR")} e salvo neste dispositivo.`);
    } catch {
      setFeedback("Não foi possível salvar a alteração. Verifique o espaço e as permissões do navegador.");
    }
  }

  const hasFilters = statusFilter !== "Todos" || dateFilter !== "" || search.trim() !== "";
  const canUpdate = !data.loading && !data.error;

  function clearFilters() {
    setStatusFilter("Todos");
    setDateFilter("");
    setSearch("");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold text-[#292621]">Agenda da equipe</p>
          <p className="mt-1 text-sm text-[#89847c]">
            Consulte e atualize os agendamentos demonstrativos.
          </p>
        </div>
        <span className="rounded-full border border-[#e4ded2] bg-white px-3 py-1.5 text-[11px] font-medium text-[#77736c]">
          {data.loading ? "Carregando..." : `${data.appointments.length} agendamentos demonstrativos`}
        </span>
      </div>

      {data.error && (
        <p className="rounded-xl border border-[#eccdca] bg-[#f7e8e6] px-4 py-3 text-sm text-[#8f342e]" role="alert">
          {data.error}
        </p>
      )}
      <p aria-live="polite" className="min-h-5 text-xs font-medium text-[#39734a]" role="status">
        {feedback}
      </p>

      <section
        aria-label="Filtros de agendamentos"
        className="rounded-2xl border border-[#eae6de] bg-white p-4 shadow-[0_3px_14px_rgba(40,34,25,0.03)] sm:p-5"
      >
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por status">
          {statuses.map((status) => {
            const count =
              status === "Todos"
                ? data.appointments.length
                : data.appointments.filter((appointment) => appointment.status === status).length;
            const selected = statusFilter === status;

            return (
              <button
                aria-pressed={selected}
                className={[
                  "shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924]",
                  selected
                    ? "border-[#9f2924] bg-[#9f2924] text-white"
                    : "border-[#e8e4dc] bg-white text-[#716c64] hover:bg-[#f7f5f0]",
                ].join(" ")}
                key={status}
                onClick={() => setStatusFilter(status)}
                type="button"
              >
                {status} <span className={selected ? "text-white/75" : "text-[#99948c]"}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_auto] sm:items-end">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="client-search">
              Buscar cliente
            </label>
            <input
              autoComplete="off"
              className="w-full rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none placeholder:text-[#aaa49a] focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
              id="client-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite o nome do cliente"
              type="search"
              value={search}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="appointment-date">
              Filtrar por data
            </label>
            <input
              className="w-full rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
              id="appointment-date"
              onChange={(event) => setDateFilter(event.target.value)}
              type="date"
              value={dateFilter}
            />
          </div>
          <button
            className="rounded-xl px-3 py-2.5 text-xs font-semibold text-[#8a463f] underline underline-offset-4 hover:text-[#76201c] disabled:cursor-not-allowed disabled:text-[#b4aea5] disabled:no-underline sm:mb-0.5"
            disabled={!hasFilters}
            onClick={clearFilters}
            type="button"
          >
            Limpar filtros
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-[#292621]">Agendamentos</h2>
        <p className="text-xs text-[#89847c]">
          {data.loading ? "" : `${filteredAppointments.length} de ${data.appointments.length} resultados`}
        </p>
      </div>

      {data.loading ? (
        <div
          aria-label="Carregando agendamentos demonstrativos"
          className="rounded-2xl border border-[#eae6de] bg-white px-5 py-12 text-center text-sm text-[#89847c]"
          role="status"
        >
          Carregando agendamentos...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9d3c9] bg-white px-5 py-12 text-center">
          <p className="font-display text-xl font-semibold text-[#383530]">Nenhum agendamento encontrado</p>
          <p className="mt-2 text-sm text-[#89847c]">
            {hasFilters
              ? "Tente ajustar os filtros ou a busca para ver outros resultados."
              : "Os agendamentos demonstrativos aparecerão aqui."}
          </p>
          {hasFilters && (
            <button
              className="mt-4 rounded-lg bg-[#9f2924] px-4 py-2 text-xs font-semibold text-white hover:bg-[#84221e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924]"
              onClick={clearFilters}
              type="button"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              appointment={appointment}
              canUpdate={canUpdate}
              expanded={expandedId === appointment.id}
              key={appointment.id}
              onToggleDetails={() =>
                setExpandedId(expandedId === appointment.id ? null : appointment.id)
              }
              onUpdateStatus={(status) => updateStatus(appointment.id, status)}
            />
          ))}
        </ul>
      )}

      <p className="text-center text-[10px] text-[#a09b93]">
        As alterações são armazenadas localmente neste navegador. Dados demonstrativos.
      </p>
    </div>
  );
}
