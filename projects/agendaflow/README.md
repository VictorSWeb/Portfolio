# AgendaFlow

AgendaFlow is a front-end demonstration of an appointment scheduling experience for NorthSide Barber Co., a fictional barbershop. It includes a public-facing site, a sample booking flow, and an administrative panel for exploring appointment, professional, and service management.

## Live Demo

[Open the live demo](https://portfolio-wpbb.vercel.app/)

## Features

### Public landing page

- Presents the fictional barbershop, its services and prices, barbers, opening hours, location, and contact details.
- Provides links to start the appointment booking demonstration.

### Six-step appointment booking demonstration

The sample flow guides visitors through selecting a service, barber, date, and time, entering customer details, and reviewing their selections. The dates, times, services, and barbers are static examples; no real appointment is created or saved.

### Admin dashboard

Shows a sample overview with demonstration metrics, recent and upcoming appointments, and popular services. These dashboard figures and lists are static demonstration data.

### Appointment management

- Browse sample appointments and filter by status or date.
- Search appointments by customer name and view appointment details.
- Change a pending appointment to confirmed, or cancel an appointment.

### Professional management

Create, edit, activate or deactivate, and delete professional records. The form includes a name, specialty, phone number, email address, and optional description.

### Service management

Create, edit, activate or deactivate, and delete services. Search the catalog by service name and filter by active status. Service records include a name, description, duration, and price.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- `next/font` with DM Sans and Barlow Condensed

## Data Persistence

The public booking flow uses static data and does not save reservations. The admin panel stores its editable appointment, professional, and service data in separate LocalStorage entries in the current browser.

LocalStorage data is isolated to the browser and site origin where it was created; it is not shared with other browsers or devices. Changes made in the admin panel do not update the data displayed by the public page or its booking flow. The dashboard overview also uses separate static demonstration data.

## Project Limitations

- This is a front-end demonstration, not a production booking service.
- There is no application backend, database, or authentication.
- The admin panel is publicly accessible and intended only for demonstration.
- Booking dates and times do not represent live availability, and completing the flow does not create or save a reservation.
- Admin data is local to the current browser and is not synchronized with the public page.

## Getting Started

Clone the repository if needed. From the root of the cloned repository, install the project dependencies and start the development server:

```bash
cd projects/agendaflow
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

Run these commands from `projects/agendaflow`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server. Run `npm run build` first. |
| `npm run lint` | Run ESLint. |

## Project Structure

```text
projects/agendaflow/
├── app/
│   ├── admin/
│   │   ├── agendamentos/
│   │   │   ├── appointment-manager.tsx
│   │   │   └── page.tsx
│   │   ├── components/      # Shared admin UI components
│   │   ├── profissionais/
│   │   │   ├── professional-manager.tsx
│   │   │   └── page.tsx
│   │   ├── servicos/
│   │   │   ├── service-manager.tsx
│   │   │   └── page.tsx
│   │   ├── admin-shell.tsx
│   │   ├── data.ts          # Demo data and shared types
│   │   └── page.tsx         # Admin dashboard
│   ├── agendar/
│   │   └── page.tsx         # Six-step booking demonstration
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Public landing page
├── public/                  # Static assets
├── next.config.ts
├── package.json
└── package-lock.json
```

## Repository

[View the AgendaFlow source code](https://github.com/VictorSWeb/Portfolio/tree/main/projects/agendaflow)
