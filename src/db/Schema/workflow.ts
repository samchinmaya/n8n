import { jsonb, pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { user } from "./user.ts";
import type { WorkflowNode, WorkflowEdge } from "../../types/workflow.ts";

export const workflow = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  nodes: jsonb("nodes").$type<WorkflowNode[]>().notNull().default([]),
  edges: jsonb("edges").$type<WorkflowEdge[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  active: boolean("active").notNull().default(false),
});
