# Expense Tracker

**GitHub:** https://github.com/steve133188/Nextjs-ExpenseTracker-Ass2

## Problem Statement

Most people have no clear picture of where their money goes. This app solves that by letting individuals record every expense, assign it to a category, and immediately see breakdowns and trends through interactive charts. Filters by date range and category make it easy to answer questions like "how much did I spend on food this month?" Administrators can manage all user accounts and review a full audit log of every action taken in the system.

## Features

Full CRUD on three entities:

| Entity | Operations |
|--------|-----------|
| **Users** | Register, login, logout, change password; admin can create, update role, reset password, delete |
| **Expenses** | Create, read (live search, date/category filters, sorting, pagination), update, delete |
| **Activity Log** | Auto-created on every user action; admin reads with server-side pagination |

Additional: role-based access, spending charts (donut + monthly trend), responsive layout, dark/light theme.

## Security

| Measure | Implementation |
|---------|---------------|
| Password hashing | bcryptjs — passwords never stored in plain text |
| JWT authentication | HS256 via `jose`; stored in HttpOnly cookie, inaccessible to JavaScript (XSS-safe) |
| Server-side enforcement | Edge Middleware verifies JWT on every request before any page or API handler runs |
| Role-based access control | `/admin` page and `/api/admin/*` routes reject non-admin requests with 403 |
| Input validation | Zod schemas on both client and server — API rejects malformed requests before touching the DB |
| No sensitive data in repo | `.env.local` is git-ignored; no hardcoded credentials |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite via Drizzle ORM |
| Auth | JWT (jose) in HttpOnly cookie, bcryptjs |
| UI | shadcn/ui, Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Forms | react-hook-form + Zod |
| Charts | Recharts |

## Technical Design Decisions

| Decision | Rationale |
|----------|-----------|
| TanStack Query over `useState` + `useEffect` | Built-in caching, background refetch, deduplication, and loading/error states — avoids race conditions from manual fetch logic |
| JWT in HttpOnly cookie over `localStorage` | Cookie is inaccessible to JavaScript, eliminating XSS token theft; verified in Edge Middleware before any component renders |
| Next.js Middleware for auth | Centralises auth and role checks; injects user context as request headers so API routes never re-verify the token |
| Drizzle ORM over raw SQL | Type-safe queries catch schema mismatches at compile time; `schema.ts` is the single source of truth for DB and TypeScript types |
| Shared Zod schemas | Same validation rules on client form and server API — no duplication, no divergence |
| SQLite | No external DB server required; Drizzle Kit handles migrations |

## How to Run

**Prerequisites:** Node.js 18+

```bash
npm install                                                  # 1. Install dependencies
echo "JWT_SECRET=replace-with-a-32-char-random-secret" > .env.local  # 2. Create env file
npm run db:push                                              # 3. Push schema to SQLite
npm run dev                                                  # 4. Start dev server
npm run db:seed                                              # 5. (Optional) Seed demo data
```

Open [http://localhost:3000](http://localhost:3000).

Demo accounts (after seeding):
- `root@test.com` / `admin1234` — admin
- `demo1@test.com` / `demo1234` — regular user

| Command | Purpose |
|---------|---------|
| `npm run db:push` | Apply schema changes to SQLite |
| `npm run db:seed` | Populate DB with demo users and expenses |
| `npm run db:export` | Export DB contents to `data/db-export.json` |
| `npm run build` | Production build |

## Folder Structure

```
├── data/                  # SQLite database file and JSON export (git-ignored)
├── scripts/
│   ├── seed-db.js         # Populates DB with demo users and sample expenses
│   └── export-db.js       # Exports DB contents to JSON for submission
├── src/
│   ├── middleware.ts       # JWT verification, role-based access, header injection
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/      # register, login, logout, me (+ change password) endpoints
│   │   │   ├── expenses/  # CRUD endpoints for expense items
│   │   │   └── admin/     # Admin-only: user CRUD, password reset, activity log
│   │   ├── admin/         # /admin page — dedicated admin panel (role-protected)
│   │   ├── login/         # /login page — sign in and register tabs
│   │   ├── page.tsx       # Main dashboard (expenses, charts, filters)
│   │   └── layout.tsx     # Root layout (fonts, providers)
│   ├── components/
│   │   ├── admin/         # User management table, activity log, dialogs
│   │   ├── auth/          # Login form, register form, user menu, change password
│   │   ├── expenses/      # Charts, filters, expense table, summary card
│   │   └── ui/            # shadcn/ui primitives
│   ├── hooks/
│   │   ├── use-auth.ts              # Authentication state and mutations
│   │   ├── use-admin.ts             # Admin queries (users, activities, password reset)
│   │   ├── use-expenses.ts          # Expense CRUD queries and mutations
│   │   ├── use-expense-filter.ts    # Filter state (date range, categories, shortcuts)
│   │   ├── use-expense-table.ts     # Table state (sorting, pagination)
│   │   └── use-trends-chart-data.ts # Monthly trend data derived from expenses
│   ├── lib/
│   │   ├── schema.ts          # Database table definitions — single source of truth
│   │   ├── auth.ts            # JWT sign/verify helpers, cookie builders
│   │   ├── validations.ts     # Zod schemas shared across client and server
│   │   ├── activity.ts        # logActivity() helper for audit log
│   │   ├── db.ts              # Drizzle ORM connection
│   │   └── category-colors.ts # Badge colour mapping per category
│   └── providers/
│       └── query-provider.tsx # TanStack Query client provider
└── WORKLOAD.md            # Workload allocation statement
```

## Workload Allocation

This project was completed individually (group size: 1). All files written by **Steve Chak**.

**Backend**
- `src/middleware.ts` — JWT route protection, role-based access, user context injection
- `src/lib/` — schema, auth helpers, activity logger, DB connection, Zod validations
- `src/app/api/auth/` — register, login, logout, session + password change endpoints
- `src/app/api/expenses/` — expense list, create, read, update, delete endpoints
- `src/app/api/admin/` — user CRUD, password reset, activity log endpoints

**Frontend**
- `src/app/` — root layout, main dashboard, admin panel, login page, error/404 pages
- `src/hooks/` — auth, admin, expenses, filter, table, and chart data hooks
- `src/components/admin/` — user management table, activity log, role/password dialogs
- `src/components/auth/` — login form, register form, user menu, change password dialog
- `src/components/expenses/` — charts, filters, expense table, summary card, dialogs

**Scripts and Config**
- `scripts/seed-db.js`, `scripts/export-db.js`, `drizzle.config.ts`
