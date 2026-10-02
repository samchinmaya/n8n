import { pgTable, text, timestamp, uuid, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { workflow } from "./workflow.ts";

export const executionStatus = pgEnum("execution_status", ["pending", "running", "completed", "failed"]);
//pending: when the execution is pending.
//running: when the execution is running.
//completed: when the execution is completed.
//failed: when the execution fails.
//
export const triggerMode = pgEnum("trigger_mode", ["manual", "webhook", "cron"]);
//manual: when triggered manually.
//webhook: when triggered by a webhook.
//cron: when triggered by a cron job.
//
export const execution = pgTable("executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workflowId: uuid("workflow_id").references(() => workflow.id, { onDelete: "cascade" }),
  status: executionStatus("status").notNull().default("pending"),
  mode: triggerMode("mode").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  finishedAt: timestamp('finished_at').notNull(),
})
