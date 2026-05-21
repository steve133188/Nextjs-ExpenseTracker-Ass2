# Expense Tracker

**GitHub:** https://github.com/steve133188/Nextjs-ExpenseTracker-Ass2

## Problem Statement

Most people have no clear picture of where their money goes. This app solves that by letting individuals record every expense, assign it to a category, and immediately see breakdowns and trends through interactive charts. Filters by date range and category make it easy to answer questions like "how much did I spend on food this month?" Administrators can manage all user accounts and review a full audit log of every action taken in the system.

## Features

The app performs full CRUD operations on three entities as required:

| Entity | Operations |
|--------|-----------|
| **Users** (`users`) | Register, login, logout, change password; admin can create, update role, reset password, delete |
| **Expenses** (`expenses`) | Create, read (with live search, date/category filters, sorting, pagination), update, delete |
| **Activity Log** (`user_activities`) | Automatically created on every user action; admin can read with server-side pagination |

Additional features:
- Role-based access: regular users see only their own expenses; admin has a dedicated `/admin` panel
- Interactive charts: spending by category (donut) and monthly trend (bar)
- Responsive layout across desktop and mobile
- Dark/light theme toggle

## Security

| Measure | Implementation |
|---------|---------------|
| Password hashing | bcryptjs with salt rounds — passwords are never stored in plain text |
| JWT authentication | Signed with a secret key (HS256 via `jose`); stored in an HttpOnly cookie inaccessible to JavaScript, preventing XSS-based token theft |
| Server-side auth enforcement | Next.js Edge Middleware verifies the JWT on every request and rejects or redirects unauthenticated/unauthorised access before any page or API handler runs |
| Role-based access control | Middleware checks the `role` claim in the JWT; `/admin` page and all `/api/admin/*` routes reject non-admin requests with 403 |
| Input validation | Zod schemas validate all inputs on both client and server; API routes reject malformed requests before touching the database |
| No sensitive data in repo | `.env.local` (JWT secret) is git-ignored; no credentials are hardcoded |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite via Drizzle ORM |
| Auth | JWT (jose) in HttpOnly cookie, bcryptjs for password hashing |
| UI | shadcn/ui, Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Forms | react-hook-form + Zod |
| Charts | Recharts |

## Technical Design Decisions

| Decision | Rationale |
|----------|-----------|
| TanStack Query over `useState` + `useEffect` | Built-in caching, background refetch, deduplication, and loading/error states — avoids race conditions from manual fetch logic |
| JWT in HttpOnly cookie over `localStorage` | Cookie is inaccessible to JavaScript, eliminating XSS token theft; token is verified in Edge Middleware before any component renders |
| Next.js Middleware for auth | Centralises auth and role checks in one place; injects user context as request headers so API routes never re-verify the token |
| Drizzle ORM over raw SQL | Type-safe queries catch schema mismatches at compile time; `schema.ts` is the single source of truth for DB structure and TypeScript types |
| Shared Zod schemas | Same validation rules run on both the client form and the server API — no duplication, no divergence |
| SQLite | No external DB server required; appropriate for single-user deployment; Drizzle Kit handles migrations |

## How to Run

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "JWT_SECRET=replace-with-a-32-char-random-secret" > .env.local

# 3. Push schema to SQLite
npm run db:push

# 4. Start the dev server
npm run dev

# 5. (Optional) Seed the database with demo data
npm run db:seed
```

Open [http://localhost:3000](http://localhost:3000).

Demo accounts (after seeding):
- `root@test.com` / `admin1234` — admin role
- `demo1@test.com` / `demo1234` — regular user

### Scripts

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

## Database Entities

| Entity | Description |
|--------|-------------|
| `users` | Registered accounts with hashed passwords and roles (`user`/`admin`) |
| `expenses` | Individual expense records belonging to a user |
| `user_activities` | Audit log of login, logout, register, expense CRUD, and admin actions |

## Workload Allocation

This project was completed individually (group size: 1).

**Author: Steve Chak — All files**

### Backend

| File | Responsibility |
|------|---------------|
| `src/middleware.ts` | JWT route protection, role-based access control, user context injection |
| `src/lib/schema.ts` | Database schema definitions |
| `src/lib/auth.ts` | JWT sign/verify and cookie helpers |
| `src/lib/activity.ts` | Activity logging helper |
| `src/lib/db.ts` | Database connection |
| `src/lib/validations.ts` | Input validation schemas |
| `src/app/api/auth/register/route.ts` | User registration |
| `src/app/api/auth/login/route.ts` | User login |
| `src/app/api/auth/logout/route.ts` | User logout |
| `src/app/api/auth/me/route.ts` | Current user session and password change |
| `src/app/api/expenses/route.ts` | Expense list and creation |
| `src/app/api/expenses/[id]/route.ts` | Expense read, update, delete |
| `src/app/api/admin/users/route.ts` | Admin user list and creation |
| `src/app/api/admin/users/[id]/route.ts` | Admin role change and user deletion |
| `src/app/api/admin/users/[id]/reset-password/route.ts` | Admin password reset (auto-generated) |
| `src/app/api/admin/activities/route.ts` | Admin activity log with server-side pagination |

### Frontend

| File | Responsibility |
|------|---------------|
| `src/app/layout.tsx` | Root layout |
| `src/app/page.tsx` | Main dashboard with live search |
| `src/app/admin/page.tsx` | Dedicated admin panel page (role-protected) |
| `src/app/login/page.tsx` | Authentication page |
| `src/app/error.tsx` | Error boundary |
| `src/app/not-found.tsx` | 404 page |
| `src/hooks/use-auth.ts` | Authentication state and change-password mutation |
| `src/hooks/use-admin.ts` | Admin queries and mutations |
| `src/hooks/use-expenses.ts` | Expense data hooks |
| `src/hooks/use-expense-filter.ts` | Filter state hook |
| `src/hooks/use-expense-table.ts` | Table state hook |
| `src/hooks/use-trends-chart-data.ts` | Chart data hook |
| `src/components/admin/user-management-card.tsx` | User table with role select and delete |
| `src/components/admin/activity-log-card.tsx` | Activity log table with pagination |
| `src/components/admin/create-user-dialog.tsx` | Admin create user dialog |
| `src/components/admin/reset-password-dialog.tsx` | Admin password reset dialog |
| `src/components/admin/role-confirm-dialog.tsx` | Role change confirmation dialog |
| `src/components/auth/login-form.tsx` | Sign in form |
| `src/components/auth/register-form.tsx` | Registration form |
| `src/components/auth/user-menu.tsx` | User dropdown menu |
| `src/components/auth/change-password-dialog.tsx` | User change password dialog |
| `src/components/expenses/chart-card.tsx` | Reusable chart wrapper card |
| `src/components/expenses/expense-dialog.tsx` | Add/edit expense modal |
| `src/components/expenses/expense-form.tsx` | Expense form with validation |
| `src/components/expenses/summary-card.tsx` | Spending summary card |
| `src/components/expenses/charts/` | Spending by category and monthly trend charts |
| `src/components/expenses/filters/` | Date range, period, and category filter controls |
| `src/components/expenses/table/expense-table.tsx` | Sortable expense table |
| `src/components/expenses/table/expense-delete-dialog.tsx` | Delete confirmation dialog |
| `src/components/expenses/table/expense-list-skeleton.tsx` | Loading skeleton |
| `src/components/expenses/table/expense-table-pagination.tsx` | Pagination controls |
| `src/components/ui/` | shadcn/ui component library |

### Scripts and Config

| File | Responsibility |
|------|---------------|
| `scripts/seed-db.js` | Database seeding |
| `scripts/export-db.js` | Database export |
| `drizzle.config.ts` | Drizzle ORM configuration |
