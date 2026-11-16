import type { ReactNode } from "react";
import AdminSidebar from "./components/admin-sidebar";
import CurrentDate from "./current-date";

export default function AdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#24211e]" lang="pt-BR">
      <AdminSidebar />
      <main className="min-w-0 lg:ml-[250px]">
        <header className="border-b border-[#eae6de] bg-[#fbfaf7]">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-5 sm:px-7 lg:px-10 lg:py-6">
            <div>
              <CurrentDate />
              <h1 className="mt-1 font-display text-3xl font-semibold leading-tight text-[#211f1c] sm:text-4xl">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-[#e4ded2] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#77736c] sm:inline-flex">
                <span className="mr-2 size-1.5 self-center rounded-full bg-[#c18a28]" />
                Dados demonstrativos
              </span>
              <div className="grid size-9 place-items-center rounded-full bg-[#e8dfd3] text-xs font-bold text-[#50473e] lg:hidden">
                AD
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-6 sm:px-7 lg:px-10 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
