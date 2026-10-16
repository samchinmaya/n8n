import { db } from "../db/index.ts";
import { execution } from "../db/schema/index.ts";
import { eq } from "drizzle-orm";
import { runWorkFlow } from "./runWorkFlow.ts";
import type { WorkflowNode, WorkflowEdge } from "../types/workflow.ts";

type TriggerMode = "manual" | "webhook" | "cron";

export interface WorkflowRow {
  id: string;
  userId: string;
  name: string;
  active: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export async function startExecution(
  workflow: WorkflowRow,
  mode: TriggerMode,
  triggerInput?: unknown,
) {
  const [created] = await db
    .insert(execution)
    .values({
      workflowId: workflow.id,
      mode,
    })
    .returning();
  if (!created) {
    throw new Error("Could not create execution");
  }

  await db
    .update(execution)
    .set({ status: "running" })
    .where(eq(execution.id, created.id));

  try {
    const value = await runWorkFlow(workflow.nodes, workflow.edges, triggerInput);
    const [done] = await db
      .update(execution)
      .set({
        status: "completed",
        data: value,
        finishedAt: new Date(),
      })
      .where(eq(execution.id, created.id))
      .returning();
    return done;
  } catch (err) {
    const [failed] = await db
      .update(execution)
      .set({
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
        finishedAt: new Date(),
      })
      .where(eq(execution.id, created.id))
      .returning();
    return failed;
  }
}
