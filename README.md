# Ledger — Personal Expense Tracker

A full-stack web application that helps individuals track and manage their personal expenses. Users can record spending across nine categories, visualise their spending patterns with interactive charts, and filter by date range or category. Administrators can manage user accounts and review a complete audit log of all activity.

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
- `admin@ledger.local` / `admin1234` — admin role
- `demo@ledger.local` / `demo1234` — regular user

### Other scripts

| Command | Purpose |
|---------|---------|
| `npm run db:push` | Apply schema changes to SQLite |
| `npm run db:seed` | Populate DB with demo users and expenses |
| `npm run db:export` | Export DB contents to `data/expenses-export.json` |
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
│   │   │   └── admin/       # Admin-only user management and activity log endpoints
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
├── middleware.ts             # JWT verification and route protection
├── .env.local               # Environment variables (not committed)
└── WORKLOAD.md              # Workload allocation statement
```

## Database Entities

| Entity | Description |
|--------|-------------|
| `users` | Registered accounts with hashed passwords and roles (`user`/`admin`) |
| `expenses` | Individual expense records belonging to a user |
| `user_activities` | Audit log of login, logout, register, and expense CRUD events |
