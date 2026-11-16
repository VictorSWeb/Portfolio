"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { demoServices, type Service } from "../data";
import AdminIcon from "../components/admin-icon";

const STORAGE_KEY = "agendaflow:admin:services:v1";
const STORAGE_EVENT = "agendaflow:admin:services-updated";
const SERVER_SNAPSHOT = "__server_snapshot__";
const STORAGE_UNAVAILABLE = "__storage_unavailable__";

type ServiceFields = Omit<Service, "id">;
type ServiceFilter = "Todos" | "Ativos" | "Inativos";
type ServiceFormValues = {
  name: string;
  description: string;
  durationMinutes: string;
  price: string;
  active: string;
};

const emptyFormValues: ServiceFormValues = {
  name: "",
  description: "",
  durationMinutes: "",
  price: "",
  active: "true",
};

const filters: ServiceFilter[] = ["Todos", "Ativos", "Inativos"];

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

function isService(value: unknown): value is Service {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const service = value as Record<string, unknown>;

  return (
    typeof service.id === "string" &&
    service.id.trim() !== "" &&
    typeof service.name === "string" &&
    service.name.trim() !== "" &&
    typeof service.description === "string" &&
    service.description.trim() !== "" &&
    typeof service.durationMinutes === "number" &&
    Number.isInteger(service.durationMinutes) &&
    service.durationMinutes > 0 &&
    typeof service.price === "number" &&
    Number.isFinite(service.price) &&
    service.price >= 0 &&
    typeof service.active === "boolean"
  );
}

function isServiceList(value: unknown): value is Service[] {
  return (
    Array.isArray(value) &&
    value.every(isService) &&
    new Set(value.map((service) => service.id)).size === value.length
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function getFormValues(service?: Service): ServiceFormValues {
  if (!service) {
    return emptyFormValues;
  }

  return {
    name: service.name,
    description: service.description,
    durationMinutes: String(service.durationMinutes),
    price: String(service.price),
    active: String(service.active),
  };
}

function ServiceForm({
  initialValues,
  editing,
  onCancel,
  onSave,
}: {
  initialValues: ServiceFormValues;
  editing: boolean;
  onCancel: () => void;
  onSave: (values: ServiceFields) => void;
}) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");

  function updateField(field: keyof ServiceFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = values.name.trim();
    const description = values.description.trim();
    const durationMinutes = Number(values.durationMinutes);
    const price = Number(values.price);

    if (!name || !description || !values.durationMinutes || !values.price) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0 || durationMinutes > 1440) {
      setError("A duração deve ser um número inteiro entre 1 e 1440 minutos.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("O preço deve ser um valor igual ou maior que zero.");
      return;
    }

    onSave({
      name,
      description,
      durationMinutes,
      price: Math.round(price * 100) / 100,
      active: values.active === "true",
    });
  }

  return (
    <section
      aria-labelledby="service-form-title"
      className="rounded-2xl border border-[#eae6de] bg-white p-5 shadow-[0_3px_14px_rgba(40,34,25,0.03)] sm:p-6"
    >
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-[#292621]" id="service-form-title">
          {editing ? "Editar serviço" : "Novo serviço"}
        </h2>
        <p className="mt-1 text-xs text-[#89847c]">
          Os campos marcados com <span className="text-[#9f2924]">*</span> são obrigatórios.
        </p>
      </div>
      <form className="space-y-4" noValidate onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="service-name">
              Nome do serviço <span aria-hidden="true" className="text-[#9f2924]">*</span>
            </label>
            <input
              autoComplete="off"
              className="w-full rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none placeholder:text-[#aaa49a] focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
              id="service-name"
              onChange={(event) => updateField("name", event.target.value)}
              required
              value={values.name}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="service-duration">
              Duração (minutos) <span aria-hidden="true" className="text-[#9f2924]">*</span>
            </label>
            <input
              className="w-full rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
              id="service-duration"
              max="1440"
              min="1"
              onChange={(event) => updateField("durationMinutes", event.target.value)}
              required
              step="1"
              type="number"
              value={values.durationMinutes}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="service-price">
              Preço (R$) <span aria-hidden="true" className="text-[#9f2924]">*</span>
            </label>
            <input
              className="w-full rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
              id="service-price"
              min="0"
              onChange={(event) => updateField("price", event.target.value)}
              required
              step="0.01"
              type="number"
              value={values.price}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="service-active">
              Status inicial <span aria-hidden="true" className="text-[#9f2924]">*</span>
            </label>
            <select
              className="w-full rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
              id="service-active"
              onChange={(event) => updateField("active", event.target.value)}
              value={values.active}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="service-description">
            Descrição <span aria-hidden="true" className="text-[#9f2924]">*</span>
          </label>
          <textarea
            className="min-h-24 w-full resize-y rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none placeholder:text-[#aaa49a] focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
            id="service-description"
            onChange={(event) => updateField("description", event.target.value)}
            required
            rows={3}
            value={values.description}
          />
        </div>
        {error && (
          <p className="text-sm text-[#a23a34]" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            className="rounded-xl bg-[#9f2924] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#84221e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924]"
            type="submit"
          >
            {editing ? "Salvar alterações" : "Cadastrar serviço"}
          </button>
          <button
            className="rounded-xl border border-[#e5ded4] px-4 py-2.5 text-xs font-semibold text-[#716a61] transition-colors hover:bg-[#f7f5f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924]"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

function ServiceCard({
  service,
  canUpdate,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  service: Service;
  canUpdate: boolean;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  return (
    <li>
      <article
        className={`h-full rounded-2xl border bg-white p-5 shadow-[0_3px_14px_rgba(40,34,25,0.03)] ${
          service.active ? "border-[#eae6de]" : "border-[#e1ddd5] bg-[#fdfcf9]"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-xl ${
              service.active ? "bg-[#f8e9e6] text-[#9f2924]" : "bg-[#eeece7] text-[#77736c]"
            }`}
          >
            <AdminIcon className="size-5" name="scissors" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="break-words font-semibold text-[#302d29]">{service.name}</h3>
            <p className="mt-1 text-xs text-[#77736c]">{service.durationMinutes} minutos</p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              service.active
                ? "border-[#cfe2d2] bg-[#e7f2e9] text-[#39734a]"
                : "border-[#e3dfd8] bg-[#f0eee9] text-[#716c64]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${service.active ? "bg-[#538561]" : "bg-[#969189]"}`}
            />
            {service.active ? "Ativo" : "Inativo"}
          </span>
        </div>
        <p className="mt-4 min-h-10 break-words text-sm leading-relaxed text-[#77736c]">
          {service.description}
        </p>
        <p className="mt-4 font-display text-2xl font-semibold text-[#292621]">
          {formatPrice(service.price)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#f0eee9] pt-4">
          <button
            aria-label={`Editar ${service.name}`}
            className="rounded-lg border border-[#e5ded4] px-3 py-2 text-xs font-semibold text-[#716a61] transition-colors hover:bg-[#f7f5f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canUpdate}
            onClick={onEdit}
            type="button"
          >
            Editar
          </button>
          <button
            aria-label={`${service.active ? "Desativar" : "Ativar"} ${service.name}`}
            className="rounded-lg border border-[#e5ded4] px-3 py-2 text-xs font-semibold text-[#716a61] transition-colors hover:bg-[#f7f5f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canUpdate}
            onClick={onToggleActive}
            type="button"
          >
            {service.active ? "Desativar" : "Ativar"}
          </button>
          <button
            aria-label={`Excluir ${service.name}`}
            className="ml-auto rounded-lg px-3 py-2 text-xs font-semibold text-[#a23a34] transition-colors hover:bg-[#f7e8e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canUpdate}
            onClick={onDelete}
            type="button"
          >
            Excluir
          </button>
        </div>
      </article>
    </li>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "gray";
}) {
  return (
    <article className="rounded-2xl border border-[#eae6de] bg-white p-4 shadow-[0_3px_14px_rgba(40,34,25,0.03)]">
      <p className="text-xs font-medium text-[#77736c]">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${tone === "green" ? "text-[#39734a]" : "text-[#716c64]"}`}>
        {value}
      </p>
    </article>
  );
}

export default function ServiceManager() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceFilter>("Todos");
  const [feedback, setFeedback] = useState("");

  const data = useMemo(() => {
    if (snapshot === SERVER_SNAPSHOT) {
      return { services: [], loading: true, error: "" };
    }

    if (snapshot === STORAGE_UNAVAILABLE) {
      return {
        services: demoServices,
        loading: false,
        error: "O navegador não permitiu acessar o LocalStorage. As alterações não poderão ser salvas.",
      };
    }

    if (snapshot === null) {
      return { services: demoServices, loading: false, error: "" };
    }

    try {
      const saved: unknown = JSON.parse(snapshot);
      if (!isServiceList(saved)) {
        throw new Error("Os serviços salvos têm um formato inválido.");
      }
      return { services: saved, loading: false, error: "" };
    } catch {
      return {
        services: demoServices,
        loading: false,
        error: "Não foi possível ler os serviços salvos. As alterações estão desativadas.",
      };
    }
  }, [snapshot]);

  const canUpdate = !data.loading && !data.error;
  const editingService = data.services.find((service) => service.id === editingId);
  const activeCount = data.services.filter((service) => service.active).length;
  const inactiveCount = data.services.length - activeCount;
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const visibleServices = data.services.filter((service) => {
    const matchesSearch = service.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    const matchesStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Ativos" ? service.active : !service.active);
    return matchesSearch && matchesStatus;
  });
  const hasFilters = normalizedSearch !== "" || statusFilter !== "Todos";

  function saveServices(updated: Service[], successMessage: string) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(STORAGE_EVENT));
      setFeedback(successMessage);
      setShowForm(false);
      setEditingId(null);
    } catch {
      setFeedback("Não foi possível salvar. Verifique o espaço e as permissões do navegador.");
    }
  }

  function saveService(values: ServiceFields) {
    if (editingService) {
      const updated = data.services.map((service) =>
        service.id === editingService.id ? { ...service, ...values } : service,
      );
      saveServices(updated, "Serviço atualizado e salvo neste dispositivo.");
      return;
    }

    const service: Service = {
      ...values,
      id: crypto.randomUUID(),
    };
    saveServices([...data.services, service], "Serviço cadastrado e salvo neste dispositivo.");
  }

  function toggleActive(service: Service) {
    const updated = data.services.map((item) =>
      item.id === service.id ? { ...item, active: !item.active } : item,
    );
    saveServices(
      updated,
      `Serviço ${service.name} ${service.active ? "desativado" : "ativado"} e salvo neste dispositivo.`,
    );
  }

  function deleteService(service: Service) {
    if (!window.confirm(`Deseja excluir o serviço "${service.name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    saveServices(
      data.services.filter((item) => item.id !== service.id),
      `O serviço ${service.name} foi excluído.`,
    );
  }

  function startCreate() {
    setEditingId(null);
    setShowForm(true);
    setFeedback("");
  }

  function startEdit(service: Service) {
    setEditingId(service.id);
    setShowForm(true);
    setFeedback("");
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold text-[#292621]">Catálogo da barbearia</p>
          <p className="mt-1 text-sm text-[#89847c]">
            Gerencie serviços, preços e duração dos atendimentos.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-[#9f2924] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#84221e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canUpdate}
          onClick={startCreate}
          type="button"
        >
          <AdminIcon className="size-4" name="plus" />
          Novo serviço
        </button>
      </div>

      <p className="rounded-xl border border-[#e4ded2] bg-[#fbfaf7] px-4 py-3 text-xs text-[#77736c]">
        Catálogo demonstrativo armazenado neste navegador. Não representa dados reais nem está conectado a um banco de dados.
      </p>

      {data.error && (
        <p className="rounded-xl border border-[#eccdca] bg-[#f7e8e6] px-4 py-3 text-sm text-[#8f342e]" role="alert">
          {data.error}
        </p>
      )}
      <p aria-live="polite" className="min-h-5 text-xs font-medium text-[#39734a]" role="status">
        {feedback}
      </p>

      <div className="grid gap-3 min-[480px]:grid-cols-2">
        <Metric label="Serviços ativos" tone="green" value={activeCount} />
        <Metric label="Serviços inativos" tone="gray" value={inactiveCount} />
      </div>

      {showForm && canUpdate && (
        <ServiceForm
          editing={Boolean(editingService)}
          initialValues={getFormValues(editingService)}
          key={editingService?.id ?? "new-service"}
          onCancel={cancelForm}
          onSave={saveService}
        />
      )}

      <section
        aria-label="Buscar e filtrar serviços"
        className="rounded-2xl border border-[#eae6de] bg-white p-4 shadow-[0_3px_14px_rgba(40,34,25,0.03)] sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="service-search">
              Buscar serviço
            </label>
            <input
              autoComplete="off"
              className="w-full rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none placeholder:text-[#aaa49a] focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
              id="service-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite o nome do serviço"
              type="search"
              value={search}
            />
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filtrar por status" role="group">
            {filters.map((filter) => (
              <button
                aria-pressed={statusFilter === filter}
                className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] ${
                  statusFilter === filter
                    ? "border-[#9f2924] bg-[#9f2924] text-white"
                    : "border-[#e8e4dc] bg-white text-[#716c64] hover:bg-[#f7f5f0]"
                }`}
                key={filter}
                onClick={() => setStatusFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-[#292621]">Serviços</h2>
        <div className="flex items-center gap-3">
          <p className="text-xs text-[#89847c]">
            {data.loading ? "" : `${visibleServices.length} de ${data.services.length} resultados`}
          </p>
          {hasFilters && (
            <button
              className="text-xs font-semibold text-[#8a463f] underline underline-offset-4 hover:text-[#76201c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924]"
              onClick={clearFilters}
              type="button"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {data.loading ? (
        <div
          aria-label="Carregando serviços"
          className="rounded-2xl border border-[#eae6de] bg-white px-5 py-12 text-center text-sm text-[#89847c]"
          role="status"
        >
          Carregando serviços...
        </div>
      ) : visibleServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9d3c9] bg-white px-5 py-12 text-center">
          <p className="font-display text-xl font-semibold text-[#383530]">
            {hasFilters ? "Nenhum serviço encontrado" : "Nenhum serviço cadastrado"}
          </p>
          <p className="mt-2 text-sm text-[#89847c]">
            {hasFilters
              ? "Tente ajustar a busca ou o filtro de status."
              : "Cadastre um serviço para começar a montar seu catálogo."}
          </p>
          {hasFilters ? (
            <button
              className="mt-4 rounded-lg bg-[#9f2924] px-4 py-2 text-xs font-semibold text-white hover:bg-[#84221e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924]"
              onClick={clearFilters}
              type="button"
            >
              Limpar filtros
            </button>
          ) : canUpdate ? (
            <button
              className="mt-4 rounded-lg bg-[#9f2924] px-4 py-2 text-xs font-semibold text-white hover:bg-[#84221e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924]"
              onClick={startCreate}
              type="button"
            >
              Cadastrar serviço
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleServices.map((service) => (
            <ServiceCard
              canUpdate={canUpdate}
              key={service.id}
              onDelete={() => deleteService(service)}
              onEdit={() => startEdit(service)}
              onToggleActive={() => toggleActive(service)}
              service={service}
            />
          ))}
        </ul>
      )}

      <p className="text-center text-[10px] text-[#a09b93]">
        Os serviços e valores exibidos são demonstrativos e ficam salvos somente neste navegador.
      </p>
    </div>
  );
}
