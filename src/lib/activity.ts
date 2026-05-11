import { db } from "./db"
import { userActivities } from "./schema"

export type ActivityAction =
  | "register"
  | "login"
  | "logout"
  | "create_expense"
  | "update_expense"
  | "delete_expense"
  | "create_user"
  | "change_password"
  | "reset_password"

export function logActivity(userId: string, action: ActivityAction, detail = ""): void {
  db.insert(userActivities).values({
    id:        crypto.randomUUID(),
    userId,
    action,
    detail,
    createdAt: Date.now(),
  }).run()
}
