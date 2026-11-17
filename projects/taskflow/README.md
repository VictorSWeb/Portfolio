# TaskFlow

TaskFlow is a browser-based task management application for creating, organizing, and tracking personal tasks by status and priority.

## Live Demo

[Open the TaskFlow live demo](https://portfolio-victor-sw-eb.vercel.app/)

## Features

- Create, edit, and delete tasks.
- Set task statuses to **Pending**, **In Progress**, or **Completed**.
- Assign **Low**, **Medium**, or **High** priority levels.
- Add optional due dates.
- Search tasks by title and description.
- Filter tasks by status and priority.
- Sort tasks by creation date, due date, or priority.
- View dashboard statistics for all tasks and individual statuses.
- Persist tasks using browser LocalStorage.

## Tech Stack

- **React 19.3.1** — User interface.
- **TypeScript 6.0.3** — Static typing.
- **Vite 8.3.6** — Development server and build tool.
- **CSS** — Styling and responsive layouts.
- **LocalStorage** — Client-side data persistence.

## Project Structure

```text
taskflow/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── Icon.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskFormModal.tsx
│   │   └── TaskList.tsx
│   ├── hooks/
│   │   └── useTasks.ts
│   ├── types/
│   │   └── task.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js `^20.19.0`, `^22.13.0`, or `>=24.0.0`
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/VictorSWeb/Portfolio.git
```

2. Navigate to the TaskFlow directory:

```bash
cd Portfolio/projects/taskflow
```

3. Install dependencies:

```bash
npm ci
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at the local URL provided by Vite.

## Available Scripts

Run these commands from the TaskFlow directory:

| Command | Description |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run build` | Run TypeScript checks and create a production build. |
| `npm run lint` | Check the code using ESLint. |
| `npm run preview` | Preview the production build locally. |

## Data Persistence

TaskFlow uses browser LocalStorage to persist tasks under the `taskflow.tasks.v1` key.

Tasks are stored locally in the user's browser and remain available across page reloads in that browser. They are not uploaded to a server or synchronized across devices.

If saved data cannot be read or written, the application displays a warning. Changes that cannot be saved remain available only for the current session.

## Author

**Victor Saraiva**

- GitHub: [VictorSWeb](https://github.com/VictorSWeb)
- Portfolio: [Victor Saraiva — Portfolio](https://victorsweb.github.io/Portfolio/)

## License

No license has been specified for this project.
