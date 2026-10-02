import { jsonb, pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { user } from "./user.ts";
export const credential = pgTable("credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
