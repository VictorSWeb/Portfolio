export type AppointmentStatus = "Pendente" | "Confirmado" | "Cancelado";

export type Appointment = {
  id: string;
  client: string;
  phone: string;
  email: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  price: number;
  status: AppointmentStatus;
};

export type ManagedAppointment = Appointment & { dateISO: string };

export type Professional = {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  description: string;
  active: boolean;
};

export const demoProfessionals: Professional[] = [
  {
    id: "demo-rafael-costa",
    name: "Rafael Costa",
    specialty: "Cortes clássicos e barba",
    phone: "(11) 90000-0101",
    email: "rafael.costa@northside.demo",
    description: "Especialista em cortes clássicos e cuidados tradicionais com a barba.",
    active: true,
  },
  {
    id: "demo-marcos-lima",
    name: "Marcos Lima",
    specialty: "Corte e barba",
    phone: "(11) 90000-0102",
    email: "marcos.lima@northside.demo",
    description: "Atendimento completo com foco em corte e acabamento de barba.",
    active: true,
  },
  {
    id: "demo-joao-pedro",
    name: "João Pedro",
    specialty: "Degradê e cortes modernos",
    phone: "(11) 90000-0103",
    email: "joao.pedro@northside.demo",
    description: "Especialista em degradês e estilos contemporâneos.",
    active: true,
  },
];

export const dashboardMetrics = [
  {
    label: "Agendamentos de hoje",
    value: "12",
    note: "4 horários restantes",
    icon: "calendar",
    accent: "red",
  },
  {
    label: "Agendamentos pendentes",
    value: "03",
    note: "Aguardando confirmação",
    icon: "clock",
    accent: "amber",
  },
  {
    label: "Agendamentos confirmados",
    value: "08",
    note: "Para os próximos dias",
    icon: "check",
    accent: "green",
  },
  {
    label: "Profissionais",
    value: "04",
    note: "Equipe demonstrativa",
    icon: "users",
    accent: "slate",
  },
] as const;

export const recentAppointments: Appointment[] = [
  {
    id: "1",
    client: "Lucas Martins",
    phone: "(11) 99912-3401",
    email: "lucas.martins@email.com",
    service: "Corte clássico",
    professional: "Rafael Costa",
    date: "Hoje",
    time: "09:30",
    price: 65,
    status: "Confirmado",
  },
  {
    id: "2",
    client: "Pedro Henrique",
    phone: "(11) 99876-2210",
    email: "pedro.henrique@email.com",
    service: "Corte + barba",
    professional: "Marcos Lima",
    date: "Hoje",
    time: "10:15",
    price: 105,
    status: "Pendente",
  },
  {
    id: "3",
    client: "André Oliveira",
    phone: "(11) 99745-6123",
    email: "andre.oliveira@email.com",
    service: "Barba tradicional",
    professional: "Rafael Costa",
    date: "Hoje",
    time: "11:00",
    price: 50,
    status: "Confirmado",
  },
  {
    id: "4",
    client: "Thiago Ferreira",
    phone: "(11) 99632-9087",
    email: "thiago.ferreira@email.com",
    service: "Degradê",
    professional: "João Pedro",
    date: "Hoje",
    time: "13:30",
    price: 70,
    status: "Cancelado",
  },
  {
    id: "5",
    client: "Bruno Almeida",
    phone: "(11) 99581-4472",
    email: "bruno.almeida@email.com",
    service: "Corte clássico",
    professional: "Marcos Lima",
    date: "Hoje",
    time: "14:15",
    price: 65,
    status: "Confirmado",
  },
];

export function createDemoAppointments(date = new Date()): ManagedAppointment[] {
  const dateISO = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

  return recentAppointments.map((appointment) => ({ ...appointment, dateISO }));
}

export const upcomingAppointments = [
  { client: "Caio Nascimento", service: "Corte + barba", time: "Hoje, 15:30" },
  { client: "Felipe Rocha", service: "Corte clássico", time: "Hoje, 16:15" },
  { client: "Gustavo Mendes", service: "Barba tradicional", time: "Amanhã, 09:00" },
];

export const popularServices = [
  { name: "Corte clássico", bookings: 38, percentage: 82 },
  { name: "Corte + barba", bookings: 26, percentage: 62 },
  { name: "Degradê", bookings: 19, percentage: 44 },
  { name: "Barba tradicional", bookings: 12, percentage: 30 },
];

export type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
};

const demoServiceDetails: Record<string, { description: string; durationMinutes: number }> = {
  "Corte clássico": {
    description: "Corte tradicional personalizado com acabamento na tesoura ou máquina.",
    durationMinutes: 45,
  },
  "Corte + barba": {
    description: "Corte completo acompanhado de aparo e acabamento de barba.",
    durationMinutes: 75,
  },
  Degradê: {
    description: "Corte com transição gradual e acabamento detalhado.",
    durationMinutes: 45,
  },
  "Barba tradicional": {
    description: "Aparo, alinhamento e acabamento tradicional da barba.",
    durationMinutes: 30,
  },
};

export const demoServices: Service[] = popularServices.map((service, index) => {
  const appointment = recentAppointments.find((item) => item.service === service.name);
  const details = demoServiceDetails[service.name];

  return {
    id: `demo-service-${index + 1}`,
    name: service.name,
    description:
      details?.description ??
      `Atendimento demonstrativo para o serviço ${service.name.toLocaleLowerCase("pt-BR")}.`,
    durationMinutes: details?.durationMinutes ?? 30,
    price: appointment?.price ?? 0,
    active: true,
  };
});
