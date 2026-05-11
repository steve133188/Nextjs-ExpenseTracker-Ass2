# Ledger — Personal Expense Tracker

A full-stack web application that helps individuals track and manage their personal expenses. Users can record spending across nine categories, visualise their spending patterns with interactive charts, and filter by date range or category. Administrators can create, delete, and manage all user accounts (including role assignment) and review a complete audit log of all activity.

## Technical Design Decisions

**TanStack Query over plain `useState` + `useEffect`** — Provides automatic caching, background refetch, deduplication, and loading/error states out of the box. A manual fetch-in-useEffect approach would require reimplementing all of this and is prone to race conditions.

**JWT in HttpOnly cookie over `localStorage`** — HttpOnly cookies are inaccessible to JavaScript, eliminating XSS-based token theft. The token is verified in Next.js Edge Middleware on every request, so protected routes are enforced server-side before any component renders.

**Next.js Middleware for auth + role-based access** — Centralises authentication logic in one place instead of duplicating guards in every API route handler. The middleware injects verified user context as request headers, so route handlers never need to re-verify the token.

**Drizzle ORM over raw SQL** — Type-safe queries catch schema mismatches at compile time. The schema file (`src/lib/schema.ts`) serves as the single source of truth for both the database structure and TypeScript types.

**`react-hook-form` + Zod** — Zod schemas are shared between client-side form validation and server-side API validation (`expenseSchema`), preventing duplication and ensuring the same rules apply at both layers.

**SQLite for persistence** — Appropriate for a single-user or small-group deployment; no external database server required. Drizzle Kit handles schema migrations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite via Drizzle ORM |
| Auth | JWT (jose) stored in HttpOnly cookie, bcryptjs for password hashing |
| UI | shadcn/ui, Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Forms | react-hook-form + zod |
| Charts | Recharts |

## How to Run

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local
# Edit .env.local and set JWT_SECRET to any 32+ character random string

# 3. Push schema to SQLite and start the dev server
npm run dev

# 4. (Optional) Seed the database with demo data and users
npm run db:seed
```

Open [http://localhost:3000](http://localhost:3000).

Demo accounts (after seeding):
- `alice.wong92@gmail.com` / `admin1234` — admin role
- `james.hl.lee@gmail.com` / `demo1234` — regular user

### Other scripts

| Command | Purpose |
|---------|---------|
| `npm run db:push` | Apply schema changes to SQLite |
| `npm run db:seed` | Populate DB with demo users and expenses |
| `npm run db:export` | Export DB contents to `data/db-export.json` |
| `npm run build` | Production build |

## Folder Structure

```
├── data/                    # SQLite database file and JSON export (git-ignored)
├── docs/                    # Project documentation
├── public/                  # Static assets
├── scripts/
│   ├── seed-db.js           # Populates DB with demo users and sample expenses
│   └── export-db.js         # Exports DB contents to JSON for submission
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/        # register, login, logout, me endpoints
│   │   │   ├── expenses/    # CRUD endpoints for expense items
│   │   │   └── admin/       # Admin-only endpoints: user CRUD (create/list/role/delete) and activity log
│   │   ├── login/           # /login page (authentication)
│   │   ├── globals.css      # Global styles and Tailwind theme
│   │   ├── layout.tsx       # Root layout (fonts, providers)
│   │   └── page.tsx         # Main dashboard (expenses + admin panel)
│   ├── components/
│   │   ├── admin/           # Admin panel (user table, activity log)
│   │   ├── expenses/        # Expense table, form, dialog, filters, charts
│   │   └── ui/              # shadcn/ui primitives
│   ├── hooks/
│   │   ├── use-auth.ts      # Authentication state (current user, logout)
│   │   ├── use-expenses.ts  # Expense CRUD mutations and queries
│   │   ├── use-expense-filter.ts  # Filter state (date range, categories)
│   │   └── use-expense-table.ts   # Table state (sorting, pagination)
│   ├── lib/
│   │   ├── auth.ts          # JWT sign/verify helpers, cookie header builders
│   │   ├── activity.ts      # logActivity() helper for user_activities table
│   │   ├── db.ts            # Drizzle ORM database connection
│   │   ├── schema.ts        # Database table definitions (users, expenses, user_activities)
│   │   ├── validations.ts   # Zod schemas for all forms and API inputs
│   │   └── utils.ts         # Shared utility functions
│   └── providers/
│       └── query-provider.tsx  # TanStack Query client provider
├── src/middleware.ts         # JWT verification and route protection
├── .env.local               # Environment variables (not committed)
└── WORKLOAD.md              # Workload allocation statement
```

## Database Entities

| Entity | Description |
|--------|-------------|
| `users` | Registered accounts with hashed passwords and roles (`user`/`admin`) |
| `expenses` | Individual expense records belonging to a user |
| `user_activities` | Audit log of login, logout, register, expense CRUD, and admin user creation events |
