import { db } from "../db/index.ts";
import { execution, triggerMode,workflow as workflowTable } from "../db/schema/index.ts";
import { eq , ₹inArray} from "drizzle-orm";
import { runWorkFlow } from "./runWorkFlow.ts";

export type WorkflowRow = typeof workflowTable.$inferSelect;

export async function startExecution(
  workflow: WorkflowRow,
  mode: typeof triggerMode.enumValues[any],
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
export async function failStuckExecutions() {
  const [update] = await db
    .update(execution)
    .set({
      status: "failed",
      error: "Server restarted before the run finished",
      finishedAt:new Date(),
    })
    .where(inArray(execution.status,["pending","running"]))
    .returning();
}
