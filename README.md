# Shivdhara — Frontend (React 19 SPA)

Single-page application for Shivdhara, built with **React 19 + TypeScript +
Vite**, styled with **Tailwind CSS v4**, and wired with React Router, Axios,
TanStack Query and Zustand.

> **Phase 1 — Foundation only.** No business features. The landing page exists
> to demonstrate that the full toolchain and the API connection work.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm 10+

## Setup

```bash
npm install
cp .env.example .env   # present after scaffolding
npm run dev            # http://localhost:5173
```

The dev server runs on a fixed port (`5173`) so it matches the backend's CORS
and Sanctum `stateful` origins out of the box.

## Scripts

| Script                 | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server (HMR).                     |
| `npm run build`        | Type-check (`tsc -b`) and build for production.      |
| `npm run preview`      | Preview the production build locally.                |
| `npm run lint`         | Run ESLint (flat config, type-checked rules).        |
| `npm run lint:fix`     | ESLint with autofix.                                 |
| `npm run typecheck`    | Type-check without emitting.                         |
| `npm run format`       | Format the codebase with Prettier.                   |
| `npm run format:check` | Verify formatting in CI.                             |

## Directory structure (`src/`)

```
src/
├── app/
│   ├── providers/AppProviders.tsx   Global providers (Query + Router)
│   └── router/index.tsx             Route table (React Router v7)
├── pages/                           Route-level screens
├── components/ (ui/)                Reusable presentational components
├── features/                        Business feature modules (later phases)
├── api/                             Typed API request modules
├── lib/
│   ├── axios.ts                     Single configured Axios client
│   └── queryClient.ts               TanStack Query client
├── store/ui.store.ts                Zustand global UI state
├── hooks/                           Shared hooks
├── config/env.ts                    Typed environment access
├── routes/paths.ts                  Route path constants
├── types/                           Shared TypeScript types
├── main.tsx                         Entry point
└── index.css                        Tailwind v4 entry + theme tokens
```

See [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for the rationale,
including the server-state vs UI-state vs form-state split.

## Conventions

- Import from `@/...` (alias to `src/`), never `../../..`.
- **Server state** → TanStack Query. **Global UI state** → Zustand.
  **Form state** → React Hook Form + Zod. Don't mix them.
- All HTTP goes through `lib/axios.ts`.
- Tailwind v4 is CSS-first — configure tokens in `index.css` (`@theme`), there
  is no `tailwind.config.js`.

## Environment variables

| Variable        | Default                     | Purpose                  |
| --------------- | --------------------------- | ------------------------ |
| `VITE_API_URL`  | `http://localhost:8000/api` | Base URL of the Laravel API |
| `VITE_APP_NAME` | `Shivdhara`                 | Display name             |
