import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user.ts";
export const workflow = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  nodes: text("nodes").notNull(),
  edges: text("edges").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
