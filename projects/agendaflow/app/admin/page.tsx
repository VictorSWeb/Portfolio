import AdminShell from "./admin-shell";
import AdminIcon, { type AdminIconName } from "./components/admin-icon";
import {
  dashboardMetrics,
  popularServices,
  recentAppointments,
  upcomingAppointments,
  type Appointment,
} from "./data";

function MetricCard({
  label,
  value,
  note,
  icon,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  icon: AdminIconName;
  accent: "red" | "amber" | "green" | "slate";
}) {
  const accentClasses = {
    red: "bg-[#f8e9e6] text-[#9f2924]",
    amber: "bg-[#fbf1dc] text-[#a46a0c]",
    green: "bg-[#e6f1e9] text-[#427653]",
    slate: "bg-[#eeece7] text-[#625f59]",
  };

  return (
    <article className="rounded-2xl border border-[#eae6de] bg-white p-5 shadow-[0_3px_14px_rgba(40,34,25,0.03)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#77736c]">{label}</p>
          <p className="mt-3 font-display text-4xl font-semibold leading-none text-[#211f1c]">
            {value}
          </p>
        </div>
        <span className={`grid size-10 place-items-center rounded-xl ${accentClasses[accent]}`}>
          <AdminIcon name={icon} />
        </span>
      </div>
      <p className="mt-4 text-xs text-[#8e8981]">{note}</p>
    </article>
  );
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const styles = {
    Pendente: "bg-[#fbf1dc] text-[#94600c]",
    Confirmado: "bg-[#e7f2e9] text-[#39734a]",
    Cancelado: "bg-[#f7e8e6] text-[#a23a34]",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${
          status === "Pendente"
            ? "bg-[#c18a28]"
            : status === "Confirmado"
              ? "bg-[#538561]"
              : "bg-[#ba514a]"
        }`}
      />
      {status}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  id?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9f2924]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold text-[#24211e]" id={id}>{title}</h2>
      </div>
      {action && (
        <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold text-[#9f2924]">
          {action}
          <AdminIcon className="size-4" name="arrow" />
        </span>
      )}
    </div>
  );
}

function AppointmentTable() {
  return (
    <>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[690px] text-left">
          <thead>
            <tr className="border-b border-[#efede8] text-[10px] font-bold uppercase tracking-[0.11em] text-[#969189]">
              <th className="px-5 py-3 font-semibold">Cliente</th>
              <th className="px-3 py-3 font-semibold">Serviço</th>
              <th className="px-3 py-3 font-semibold">Profissional</th>
              <th className="px-3 py-3 font-semibold">Data e horário</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {recentAppointments.map((appointment) => (
              <tr className="border-b border-[#f1efeb] last:border-0" key={appointment.id}>
                <td className="px-5 py-4">
                  <span className="font-semibold text-[#302d29]">{appointment.client}</span>
                  <span className="mt-0.5 block text-[11px] text-[#969189]">Agendamento demonstrativo</span>
                </td>
                <td className="px-3 py-4 text-sm text-[#68645e]">{appointment.service}</td>
                <td className="px-3 py-4 text-sm text-[#68645e]">{appointment.professional}</td>
                <td className="px-3 py-4">
                  <span className="text-sm font-medium text-[#383530]">{appointment.date}</span>
                  <span className="ml-2 text-xs text-[#88837c]">{appointment.time}</span>
                </td>
                <td className="px-3 py-4"><StatusBadge status={appointment.status} /></td>
                <td className="px-4 py-4 text-right text-[#99948c]">
                  <AdminIcon className="ml-auto size-5" name="dots" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-[#efede8] sm:hidden">
        {recentAppointments.map((appointment) => (
          <li className="flex items-start justify-between gap-3 px-4 py-4" key={appointment.id}>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#302d29]">{appointment.client}</p>
              <p className="mt-1 text-xs text-[#77736c]">
                {appointment.service} <span aria-hidden="true">·</span> {appointment.professional}
              </p>
              <p className="mt-1 text-xs text-[#969189]">
                {appointment.date}, {appointment.time}
              </p>
            </div>
            <StatusBadge status={appointment.status} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default function AdminPage() {
  return (
    <AdminShell title="Visão geral">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#292621]">Bom dia, administrador</h2>
              <p className="mt-1 text-sm text-[#89847c]">
                Aqui está um resumo demonstrativo da sua barbearia.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-xl border border-[#e4ded2] bg-white px-3 py-2 text-[11px] font-semibold text-[#77736c] sm:px-4 sm:text-xs">
            <AdminIcon className="size-4 text-[#9f2924]" name="calendar" />
            Agenda demonstrativa
            </span>
          </div>

          <div className="mb-7 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
            {dashboardMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <section aria-labelledby="appointments-title" className="mb-7">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9f2924]">
                  Acompanhe sua agenda
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#24211e]" id="appointments-title">
                  Agendamentos recentes
                </h2>
              </div>
              <span className="hidden pb-1 text-xs font-medium text-[#99948c] sm:inline-flex">
                Lista de demonstração
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#eae6de] bg-white shadow-[0_3px_14px_rgba(40,34,25,0.03)]">
              <AppointmentTable />
              <p className="border-t border-[#efede8] px-5 py-3 text-[10px] text-[#99948c]">
                Lista e horários apenas para demonstração.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <section
              aria-labelledby="upcoming-title"
              className="rounded-2xl border border-[#eae6de] bg-white p-5 shadow-[0_3px_14px_rgba(40,34,25,0.03)] sm:p-6"
            >
              <SectionHeading
                eyebrow="Fique por dentro"
                id="upcoming-title"
                title="Próximos agendamentos"
              />
              <ul className="mt-5 space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <li className="flex items-center gap-3" key={appointment.client}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f4f1eb] font-display text-base font-semibold text-[#8f342e]">
                      {appointment.client.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#302d29]">{appointment.client}</p>
                      <p className="mt-0.5 text-xs text-[#8b867e]">{appointment.service}</p>
                    </div>
                    <span className="shrink-0 text-right text-xs font-semibold text-[#5b564f]">
                      {appointment.time}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-[#efede8] pt-4 text-[10px] text-[#99948c]">
                Horários fictícios para visualização do painel.
              </p>
            </section>

            <section
              aria-labelledby="services-title"
              className="rounded-2xl border border-[#eae6de] bg-white p-5 shadow-[0_3px_14px_rgba(40,34,25,0.03)] sm:p-6"
            >
              <SectionHeading
                eyebrow="Últimos 30 dias · demonstração"
                id="services-title"
                title="Serviços mais procurados"
              />
              <ul className="mt-5 space-y-4">
                {popularServices.map((service) => (
                  <li key={service.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-[#4c4842]">{service.name}</span>
                      <span className="shrink-0 text-xs text-[#8b867e]">
                        <strong className="font-semibold text-[#4c4842]">{service.bookings}</strong> agendamentos
                      </span>
                    </div>
                    <div
                      aria-label={`${service.percentage}% de procura demonstrativa`}
                      className="h-2 overflow-hidden rounded-full bg-[#f0eee9]"
                      role="img"
                    >
                      <div
                        className="h-full rounded-full bg-[#9f2924]"
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-[#efede8] pt-4 text-[10px] text-[#99948c]">
                Dados fictícios, sem relação com atendimentos reais.
              </p>
            </section>
          </div>
          <p className="mt-7 text-center text-[10px] text-[#a09b93]">
            NorthSide Barber · painel administrativo demonstrativo
          </p>
    </AdminShell>
  );
}
