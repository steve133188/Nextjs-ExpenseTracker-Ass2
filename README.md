# Expense Tracker

**GitHub:** https://github.com/steve133188/Nextjs-ExpenseTracker-Ass2

## Problem Statement

Most people have no clear picture of where their money goes. This app solves that by letting individuals record every expense, assign it to a category, and immediately see breakdowns and trends through interactive charts. Filters by date range and category make it easy to answer questions like "how much did I spend on food this month?" Administrators can manage all user accounts and review a full audit log of every action taken in the system.

## Features

Full CRUD on three entities:

| Entity | Operations |
|--------|-----------|
| **Users** | Register, login, logout, change username, change password; admin can create, change username, update role, reset password, delete |
| **Expenses** | Create, read (live search, date/category filters, sorting, pagination), update, delete |
| **Activity Log** | Auto-created on every user action; admin reads with server-side pagination |

Additional: role-based access, spending charts (donut + monthly trend), responsive layout, dark/light theme.

## API Endpoints

### Users (`/api/auth/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account — hashes password with bcrypt, issues JWT cookie |
| `POST` | `/api/auth/login` | Authenticate — verifies bcrypt hash, issues JWT cookie |
| `POST` | `/api/auth/logout` | Clear JWT cookie, log activity |
| `GET` | `/api/auth/me` | Read own profile from JWT payload |
| `PATCH` | `/api/auth/me` | Update own username (re-issues JWT) or change password (bcrypt verify + hash) |

### Expenses (`/api/expenses/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/expenses` | List own expenses — supports `category`, `from`, `to` query filters via Drizzle `where` clauses |
| `POST` | `/api/expenses` | Create expense — validates with Zod, associates with authenticated user |
| `GET` | `/api/expenses/[id]` | Read single expense — enforces ownership (returns 404 if not owner) |
| `PUT` | `/api/expenses/[id]` | Update expense — validates full body, enforces ownership |
| `DELETE` | `/api/expenses/[id]` | Delete expense — enforces ownership, logs activity |

### Admin — Users (`/api/admin/users/*`) — requires admin role
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | List all users (excludes password hashes) |
| `POST` | `/api/admin/users` | Create user — hashes password, assigns role |
| `GET` | `/api/admin/users/[id]` | Read single user |
| `PATCH` | `/api/admin/users/[id]` | Update username or role — discriminated by request body shape |
| `DELETE` | `/api/admin/users/[id]` | Delete user and all their expenses (cascaded in query) |
| `POST` | `/api/admin/users/[id]/reset-password` | Generate random password via `crypto.randomBytes`, hash with bcrypt, return plaintext once |

### Admin — Activity Log (`/api/admin/activities/*`) — requires admin role
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/activities` | Paginated log — accepts `page` and `pageSize` query params, returns rows + total count |

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
│   ├── proxy.ts            # JWT verification, role-based access, header injection
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/      # register, login, logout, me (+ change password) endpoints
│   │   │   ├── expenses/  # CRUD endpoints for expense items
│   │   │   └── admin/     # Admin-only: user CRUD, password reset, activity log
│   │   ├── admin/         # Admin panel (role-protected): users list, user detail, activity log sub-routes
│   │   ├── login/         # /login page — sign in and register tabs
│   │   ├── page.tsx       # Main dashboard (expenses, charts, filters)
│   │   └── layout.tsx     # Root layout (fonts, providers)
│   ├── components/
│   │   ├── admin/         # User management table, activity log, dialogs
│   │   ├── auth/          # Login/register forms, user menu, change username/password dialogs
│   │   ├── expenses/      # Charts, filters, expense table, summary card
│   │   └── ui/            # shadcn/ui primitives
│   ├── hooks/
│   │   ├── use-auth.ts              # Authentication state and mutations
│   │   ├── use-admin.ts             # Admin queries (users, activities, password reset)
│   │   ├── use-expenses.ts          # Expense CRUD queries and mutations
│   │   ├── use-expense-filter.ts    # Filter state (date range, categories, shortcuts)
│   │   ├── use-expense-table.ts     # Table state (sorting, pagination)
│   │   ├── use-inline-edit.ts       # Reusable inline edit state (editing, value, start, cancel)
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

| | |
|---|---|
| **Group size** | 1 (individual submission) |
| **Student** | Chi Yui Steve Chak |
| **Student ID** | 25952906 |

All code written solely by Chi Yui Steve Chak.

### Backend API Routes

| Route | Methods | Responsibility |
|-------|---------|----------------|
| `/api/auth/register` | `POST` | Create account, hash password, issue JWT |
| `/api/auth/login` | `POST` | Verify credentials, issue JWT cookie |
| `/api/auth/logout` | `POST` | Clear JWT cookie |
| `/api/auth/me` | `GET` `PATCH` | Read profile; update username (re-issues JWT) or password |
| `/api/expenses` | `GET` `POST` | List own expenses with filters; create expense |
| `/api/expenses/[id]` | `GET` `PUT` `DELETE` | Read, update, delete own expense (ownership enforced) |
| `/api/admin/users` | `GET` `POST` | List all users; admin create user |
| `/api/admin/users/[id]` | `GET` `PATCH` `DELETE` | Read, update username/role, delete user |
| `/api/admin/users/[id]/reset-password` | `POST` | Generate random password, hash, return plaintext once |
| `/api/admin/activities` | `GET` | Paginated activity log |

Supporting backend files:
- `src/proxy.ts` — JWT verification, role-based access control, user context injection into headers
- `src/lib/schema.ts` — Drizzle ORM schema (single source of truth for DB + TypeScript types)
- `src/lib/auth.ts` — JWT sign/verify helpers, cookie builder
- `src/lib/validations.ts` — Zod schemas shared between client and server
- `src/lib/activity.ts` — `logActivity()` helper called by API routes

### Frontend Routes

| Route | Description |
|-------|-------------|
| `/login` | Sign in and register tabs with inline form validation |
| `/` | Main dashboard — expense table, live search, filters, charts, summary |
| `/admin` | Redirects to `/admin/users` |
| `/admin/users` | User management — list all users, create user |
| `/admin/users/[id]` | User detail — inline edit username/role, reset password, delete |
| `/admin/activities` | Paginated activity log with refresh |

Supporting frontend files:
- `src/hooks/` — TanStack Query hooks for auth, admin, expenses, filter state, table state, chart data
- `src/components/admin/` — User management card, activity log card, info card, danger zone card, dialogs
- `src/components/auth/` — Login/register forms, user menu, change username/password dialogs
- `src/components/expenses/` — Charts, filters, expense table, summary card, expense dialogs

### Scripts and Config
- `scripts/seed-db.js` — Seed demo users and expenses
- `scripts/export-db.js` — Export DB to JSON for submission
- `drizzle.config.ts` — Drizzle Kit configuration
