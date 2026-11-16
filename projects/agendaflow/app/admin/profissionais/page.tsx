import AdminShell from "../admin-shell";
import ProfessionalManager from "./professional-manager";

export default function ProfessionalsPage() {
  return (
    <AdminShell title="Profissionais">
      <ProfessionalManager />
    </AdminShell>
  );
}
