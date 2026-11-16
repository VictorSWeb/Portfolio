"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminIcon from "./admin-icon";

const navigation = [
  { label: "Visão geral", icon: "grid", href: "/admin" },
  { label: "Agendamentos", icon: "calendar", href: "/admin/agendamentos" },
  { label: "Profissionais", icon: "users", href: "/admin/profissionais" },
  { label: "Serviços", icon: "scissors", href: "/admin/servicos" },
  { label: "Configurações", icon: "settings" },
] as const;

function Navigation({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação administrativa" className={compact ? "flex gap-2" : "space-y-1"}>
      {navigation.map((item) => {
        const active = "href" in item && pathname === item.href;
        const className = [
          "flex shrink-0 items-center gap-3 rounded-xl text-sm font-medium transition-colors",
          compact ? "px-3 py-2.5" : "px-3 py-3",
          active ? "bg-[#9f2924] text-white shadow-sm shadow-black/10" : "text-[#aaa69f]",
        ].join(" ");
        const content = (
          <>
            <AdminIcon className="size-[18px] shrink-0" name={item.icon} />
            <span>{item.label}</span>
            {!("href" in item) && (
              <span
                className={[
                  "rounded-full border border-white/10 font-medium text-[#817d77]",
                  compact ? "ml-1 px-1.5 py-0.5 text-[8px]" : "ml-auto px-2 py-0.5 text-[10px]",
                ].join(" ")}
              >
                Em breve
              </span>
            )}
          </>
        );

        return "href" in item ? (
          <Link
            aria-current={active ? "page" : undefined}
            className={className}
            href={item.href}
            key={item.label}
          >
            {content}
          </Link>
        ) : (
          <div
            aria-disabled="true"
            className={className}
            key={item.label}
            title={`${item.label} — disponível em breve`}
          >
            {content}
          </div>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#171716] px-4 pb-3 pt-4 text-white lg:fixed lg:inset-y-0 lg:w-[250px] lg:px-5 lg:pb-6 lg:pt-7">
      <div className="flex items-center justify-between lg:block">
        <Link aria-label="NorthSide Barber — visão geral" className="flex items-center gap-3 px-1" href="/admin">
          <span className="grid size-10 place-items-center rounded-xl bg-[#9f2924] font-display text-xl font-bold text-white">
            N
          </span>
          <span>
            <span className="block font-display text-xl font-semibold leading-none tracking-wide">
              NORTHSIDE
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a8a39b]">
              Barber shop
            </span>
          </span>
        </Link>
        <span className="rounded-full border border-[#383734] px-2.5 py-1 text-[10px] font-medium text-[#b8b2a8] lg:hidden">
          Painel demo
        </span>
      </div>
      <div className="mt-6 overflow-x-auto pb-1 lg:mt-12 lg:overflow-visible">
        <p className="mb-3 hidden px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#77736c] lg:block">
          Menu
        </p>
        <div className="lg:hidden">
          <Navigation compact />
        </div>
        <div className="hidden lg:block">
          <Navigation />
        </div>
      </div>
      <div className="mt-auto hidden rounded-2xl border border-[#343330] bg-[#201f1d] p-4 lg:block">
        <p className="text-xs font-semibold text-[#eee9df]">Primeiros passos</p>
        <p className="mt-2 text-xs leading-relaxed text-[#a8a39b]">
          Seu painel está em modo de demonstração. Os dados não são reais.
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#393733]">
          <div className="h-full w-1/3 rounded-full bg-[#9f2924]" />
        </div>
        <p className="mt-2 text-[10px] text-[#858078]">1 de 3 etapas</p>
      </div>
      <div className="mt-5 hidden items-center gap-3 border-t border-[#343330] px-1 pt-5 lg:flex">
        <span className="grid size-9 place-items-center rounded-full bg-[#3a302d] text-xs font-bold text-[#e7c7bf]">
          AD
        </span>
        <div>
          <p className="text-xs font-semibold">Admin demonstrativo</p>
          <p className="mt-0.5 text-[10px] text-[#8d8982]">northside.demo</p>
        </div>
        <AdminIcon className="ml-auto size-4 text-[#858078]" name="dots" />
      </div>
    </aside>
  );
}
