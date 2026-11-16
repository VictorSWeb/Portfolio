import AdminShell from "../admin-shell";
import AppointmentManager from "./appointment-manager";

export default function AppointmentsPage() {
  return (
    <AdminShell title="Agendamentos">
      <AppointmentManager />
    </AdminShell>
  );
}
