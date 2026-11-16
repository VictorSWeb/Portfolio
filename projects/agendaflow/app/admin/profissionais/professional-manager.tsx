"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { demoProfessionals, type Professional } from "../data";
import AdminIcon from "../components/admin-icon";

const STORAGE_KEY = "agendaflow:admin:professionals:v1";
const STORAGE_EVENT = "agendaflow:admin:professionals-updated";
const SERVER_SNAPSHOT = "__server_snapshot__";
const STORAGE_UNAVAILABLE = "__storage_unavailable__";

type ProfessionalFields = Omit<Professional, "id" | "active">;

const emptyFields: ProfessionalFields = {
  name: "",
  specialty: "",
  phone: "",
  email: "",
  description: "",
};

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

function isProfessional(value: unknown): value is Professional {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const professional = value as Record<string, unknown>;

  return (
    typeof professional.id === "string" &&
    professional.id.trim() !== "" &&
    typeof professional.name === "string" &&
    professional.name.trim() !== "" &&
    typeof professional.specialty === "string" &&
    professional.specialty.trim() !== "" &&
    typeof professional.phone === "string" &&
    professional.phone.trim() !== "" &&
    typeof professional.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(professional.email) &&
    typeof professional.description === "string" &&
    typeof professional.active === "boolean"
  );
}

function isProfessionalList(value: unknown): value is Professional[] {
  return (
    Array.isArray(value) &&
    value.every(isProfessional) &&
    new Set(value.map((professional) => professional.id)).size === value.length
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor={id}>
        {label} <span aria-hidden="true" className="text-[#9f2924]">*</span>
      </label>
      <input
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none placeholder:text-[#aaa49a] focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        value={value}
      />
    </div>
  );
}

function ProfessionalForm({
  initialValues,
  editing,
  onCancel,
  onSave,
}: {
  initialValues: ProfessionalFields;
  editing: boolean;
  onCancel: () => void;
  onSave: (values: ProfessionalFields) => void;
}) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");

  function updateField(field: keyof ProfessionalFields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned: ProfessionalFields = {
      name: values.name.trim(),
      specialty: values.specialty.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      description: values.description.trim(),
    };

    if (!cleaned.name || !cleaned.specialty || !cleaned.phone || !cleaned.email) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
      setError("Informe um endereço de e-mail válido.");
      return;
    }

    onSave(cleaned);
  }

  return (
    <section
      aria-labelledby="professional-form-title"
      className="rounded-2xl border border-[#eae6de] bg-white p-5 shadow-[0_3px_14px_rgba(40,34,25,0.03)] sm:p-6"
    >
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-[#292621]" id="professional-form-title">
          {editing ? "Editar profissional" : "Novo profissional"}
        </h2>
        <p className="mt-1 text-xs text-[#89847c]">
          Os campos marcados com <span className="text-[#9f2924]">*</span> são obrigatórios.
        </p>
      </div>
      <form className="space-y-4" noValidate onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            autoComplete="name"
            id="professional-name"
            label="Nome completo"
            onChange={(value) => updateField("name", value)}
            value={values.name}
          />
          <TextField
            id="professional-specialty"
            label="Especialidade"
            onChange={(value) => updateField("specialty", value)}
            value={values.specialty}
          />
          <TextField
            autoComplete="tel"
            id="professional-phone"
            label="Telefone"
            onChange={(value) => updateField("phone", value)}
            type="tel"
            value={values.phone}
          />
          <TextField
            autoComplete="email"
            id="professional-email"
            label="E-mail"
            onChange={(value) => updateField("email", value)}
            type="email"
            value={values.email}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#625e57]" htmlFor="professional-description">
            Descrição profissional <span className="font-normal text-[#969189]">(opcional)</span>
          </label>
          <textarea
            className="min-h-24 w-full resize-y rounded-xl border border-[#e5e0d7] bg-[#fbfaf7] px-3.5 py-2.5 text-sm text-[#302d29] outline-none placeholder:text-[#aaa49a] focus:border-[#9f2924] focus:ring-2 focus:ring-[#9f2924]/10"
            id="professional-description"
            onChange={(event) => updateField("description", event.target.value)}
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
            {editing ? "Salvar alterações" : "Cadastrar profissional"}
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

function ProfessionalCard({
  professional,
  canUpdate,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  professional: Professional;
  canUpdate: boolean;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  return (
    <li>
      <article
        className={`h-full rounded-2xl border bg-white p-5 shadow-[0_3px_14px_rgba(40,34,25,0.03)] ${
          professional.active ? "border-[#eae6de]" : "border-[#e1ddd5] bg-[#fdfcf9]"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`grid size-11 shrink-0 place-items-center rounded-xl font-display text-lg font-semibold ${
              professional.active
                ? "bg-[#f4f1eb] text-[#8f342e]"
                : "bg-[#eeece7] text-[#77736c]"
            }`}
          >
            {professional.name
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toLocaleUpperCase("pt-BR")}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="break-words font-semibold text-[#302d29]">{professional.name}</h2>
            <p className="mt-1 break-words text-sm text-[#77736c]">{professional.specialty}</p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              professional.active
                ? "border-[#cfe2d2] bg-[#e7f2e9] text-[#39734a]"
                : "border-[#e3dfd8] bg-[#f0eee9] text-[#716c64]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${professional.active ? "bg-[#538561]" : "bg-[#969189]"}`}
            />
            {professional.active ? "Ativo" : "Inativo"}
          </span>
        </div>
        <dl className="mt-5 space-y-3 border-t border-[#f0eee9] pt-4 text-sm">
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
            <dt className="text-xs text-[#969189]">Telefone</dt>
            <dd className="break-words text-[#4c4842]">{professional.phone}</dd>
          </div>
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
            <dt className="text-xs text-[#969189]">E-mail</dt>
            <dd className="break-all text-[#4c4842]">{professional.email}</dd>
          </div>
          {professional.description && (
            <div className="pt-1">
              <dt className="text-xs text-[#969189]">Sobre</dt>
              <dd className="mt-1 break-words text-xs leading-relaxed text-[#77736c]">
                {professional.description}
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#f0eee9] pt-4">
          <button
            aria-label={`Editar ${professional.name}`}
            className="rounded-lg border border-[#e5ded4] px-3 py-2 text-xs font-semibold text-[#716a61] transition-colors hover:bg-[#f7f5f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canUpdate}
            onClick={onEdit}
            type="button"
          >
            Editar
          </button>
          <button
            aria-label={`${professional.active ? "Desativar" : "Ativar"} ${professional.name}`}
            className="rounded-lg border border-[#e5ded4] px-3 py-2 text-xs font-semibold text-[#716a61] transition-colors hover:bg-[#f7f5f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canUpdate}
            onClick={onToggleActive}
            type="button"
          >
            {professional.active ? "Desativar" : "Ativar"}
          </button>
          <button
            aria-label={`Excluir ${professional.name}`}
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

export default function ProfessionalManager() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState("");

  const data = useMemo(() => {
    if (snapshot === SERVER_SNAPSHOT) {
      return { professionals: [], loading: true, error: "" };
    }

    if (snapshot === STORAGE_UNAVAILABLE) {
      return {
        professionals: demoProfessionals,
        loading: false,
        error: "O navegador não permitiu acessar o LocalStorage. As alterações não poderão ser salvas.",
      };
    }

    if (snapshot === null) {
      return { professionals: demoProfessionals, loading: false, error: "" };
    }

    try {
      const saved: unknown = JSON.parse(snapshot);
      if (!isProfessionalList(saved)) {
        throw new Error("Os profissionais salvos têm um formato inválido.");
      }
      return { professionals: saved, loading: false, error: "" };
    } catch {
      return {
        professionals: demoProfessionals,
        loading: false,
        error: "Não foi possível ler os profissionais salvos. As alterações estão desativadas.",
      };
    }
  }, [snapshot]);

  const canUpdate = !data.loading && !data.error;
  const editingProfessional = data.professionals.find((professional) => professional.id === editingId);

  function saveProfessionals(updated: Professional[], successMessage: string) {
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

  function saveProfessional(values: ProfessionalFields) {
    if (editingProfessional) {
      const updated = data.professionals.map((professional) =>
        professional.id === editingProfessional.id ? { ...professional, ...values } : professional,
      );
      saveProfessionals(updated, "Profissional atualizado e salvo neste dispositivo.");
      return;
    }

    const professional: Professional = {
      ...values,
      id: crypto.randomUUID(),
      active: true,
    };
    saveProfessionals(
      [...data.professionals, professional],
      "Profissional cadastrado e salvo neste dispositivo.",
    );
  }

  function toggleActive(professional: Professional) {
    const updated = data.professionals.map((item) =>
      item.id === professional.id ? { ...item, active: !item.active } : item,
    );
    saveProfessionals(
      updated,
      `${professional.name} ${professional.active ? "desativado" : "ativado"} e salvo neste dispositivo.`,
    );
  }

  function deleteProfessional(professional: Professional) {
    if (!window.confirm(`Deseja excluir o cadastro de ${professional.name}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    saveProfessionals(
      data.professionals.filter((item) => item.id !== professional.id),
      `${professional.name} foi excluído.`,
    );
  }

  function startCreate() {
    setEditingId(null);
    setShowForm(true);
    setFeedback("");
  }

  function startEdit(professional: Professional) {
    setEditingId(professional.id);
    setShowForm(true);
    setFeedback("");
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold text-[#292621]">Equipe da barbearia</p>
          <p className="mt-1 text-sm text-[#89847c]">
            Cadastre e gerencie os profissionais da NorthSide Barber.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-[#9f2924] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#84221e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canUpdate}
          onClick={startCreate}
          type="button"
        >
          <AdminIcon className="size-4" name="plus" />
          Novo profissional
        </button>
      </div>

      {data.error && (
        <p className="rounded-xl border border-[#eccdca] bg-[#f7e8e6] px-4 py-3 text-sm text-[#8f342e]" role="alert">
          {data.error}
        </p>
      )}
      <p aria-live="polite" className="min-h-5 text-xs font-medium text-[#39734a]" role="status">
        {feedback}
      </p>

      {showForm && canUpdate && (
        <ProfessionalForm
          editing={Boolean(editingProfessional)}
          initialValues={editingProfessional ?? emptyFields}
          key={editingProfessional?.id ?? "new-professional"}
          onCancel={cancelForm}
          onSave={saveProfessional}
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-[#292621]">Profissionais</h2>
        <span className="rounded-full border border-[#e4ded2] bg-white px-3 py-1.5 text-[11px] font-medium text-[#77736c]">
          {data.loading ? "Carregando..." : `${data.professionals.length} profissionais`}
        </span>
      </div>

      {data.loading ? (
        <div
          aria-label="Carregando profissionais"
          className="rounded-2xl border border-[#eae6de] bg-white px-5 py-12 text-center text-sm text-[#89847c]"
          role="status"
        >
          Carregando profissionais...
        </div>
      ) : data.professionals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9d3c9] bg-white px-5 py-12 text-center">
          <p className="font-display text-xl font-semibold text-[#383530]">
            Nenhum profissional cadastrado
          </p>
          <p className="mt-2 text-sm text-[#89847c]">
            Cadastre um profissional para começar a montar sua equipe.
          </p>
          {canUpdate && (
            <button
              className="mt-4 rounded-lg bg-[#9f2924] px-4 py-2 text-xs font-semibold text-white hover:bg-[#84221e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9f2924]"
              onClick={startCreate}
              type="button"
            >
              Cadastrar profissional
            </button>
          )}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.professionals.map((professional) => (
            <ProfessionalCard
              canUpdate={canUpdate}
              key={professional.id}
              onDelete={() => deleteProfessional(professional)}
              onEdit={() => startEdit(professional)}
              onToggleActive={() => toggleActive(professional)}
              professional={professional}
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
