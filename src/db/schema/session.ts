import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";

export const session = pgTable("sessions", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  ipAddress: text('ip_address'),
  userAgent:text("user_agent"),
  createdAt: timestamp("created_at",{withTimezone:true}).notNull().defaultNow(),
  updatedAt: timestamp("updated_at",{withTimezone:true}).notNull().defaultNow(),
})
