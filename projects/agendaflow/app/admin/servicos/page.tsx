import AdminShell from "../admin-shell";
import ServiceManager from "./service-manager";

export default function ServicesPage() {
  return (
    <AdminShell title="Serviços">
      <ServiceManager />
    </AdminShell>
  );
}
