import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user.ts";

export const verification = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt:timestamp("expires_at",{withTimezone:true}).notNull(),
  createdAt: timestamp("created_at",{withTimezone:true}).notNull().defaultNow(),
  updatedAt: timestamp("updated_at",{withTimezone:true}).notNull().defaultNow(),
})
