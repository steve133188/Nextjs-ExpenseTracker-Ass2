# Workload Allocation

This project was completed individually (group size: 1).

## Author: Steve Chak — All files

### Backend
- `src/middleware.ts` — JWT route protection, role-based access control, and user context injection
- `src/lib/schema.ts` — Database schema definitions
- `src/lib/auth.ts` — JWT sign/verify and cookie helpers
- `src/lib/activity.ts` — Activity logging helper
- `src/lib/db.ts` — Database connection
- `src/lib/validations.ts` — Input validation schemas
- `src/app/api/auth/register/route.ts` — User registration
- `src/app/api/auth/login/route.ts` — User login
- `src/app/api/auth/logout/route.ts` — User logout
- `src/app/api/auth/me/route.ts` — Current user session and password change
- `src/app/api/expenses/route.ts` — Expense list and creation
- `src/app/api/expenses/[id]/route.ts` — Expense read, update, delete
- `src/app/api/admin/users/route.ts` — Admin user list and creation
- `src/app/api/admin/users/[id]/route.ts` — Admin role change and user deletion
- `src/app/api/admin/users/[id]/reset-password/route.ts` — Admin password reset (auto-generated)
- `src/app/api/admin/activities/route.ts` — Admin activity log

### Frontend
- `src/app/layout.tsx` — Root layout
- `src/app/page.tsx` — Main dashboard
- `src/app/login/page.tsx` — Authentication page
- `src/app/error.tsx` — Error boundary
- `src/app/not-found.tsx` — 404 page
- `src/hooks/use-auth.ts` — Authentication state and change-password mutation
- `src/hooks/use-admin.ts` — Admin queries and mutations (users, activities, password reset)
- `src/hooks/use-expenses.ts` — Expense data hooks
- `src/hooks/use-expense-filter.ts` — Filter state hook
- `src/hooks/use-expense-table.ts` — Table state hook
- `src/hooks/use-trends-chart-data.ts` — Chart data hook
- `src/components/admin/admin-panel.tsx` — Admin panel layout
- `src/components/admin/user-management-card.tsx` — User table with role/delete actions
- `src/components/admin/activity-log-card.tsx` — Activity log table
- `src/components/admin/create-user-dialog.tsx` — Admin create user dialog
- `src/components/admin/reset-password-dialog.tsx` — Admin password reset dialog
- `src/components/auth/user-menu.tsx` — User dropdown menu (theme, password, logout)
- `src/components/auth/change-password-dialog.tsx` — User change password dialog
- `src/components/expenses/` — All expense UI components
- `src/components/ui/` — shadcn/ui component library

### Scripts and Config
- `scripts/seed-db.js` — Database seeding
- `scripts/export-db.js` — Database export
- `drizzle.config.ts` — Drizzle ORM configuration
