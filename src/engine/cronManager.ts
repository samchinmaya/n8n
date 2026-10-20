
import { Cron } from "croner";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { workflow } from "../db/schema/index.ts";
import { startExecution, type WorkflowRow } from "./startExecution.ts";

const jobs = new Map<string, Cron>() //where running jobs are kept workflow id -> its cron job.
function getCronExpression(wf:WorkflowRow): string | undefined{
  const node = wf.nodes.find((n) => n.type === "scheduleTrigger");
  const cron = node?.params.cron;
  return typeof cron === "string" ? cron : undefined;
}
export function unscheduleWorkflow(id:string) {
  const job = jobs.get(id);
  if (job) {
    job.stop();
    jobs.delete(id)
  }
}
export function scheduleWorkflow(wf: WorkflowRow) {
  unscheduleWorkflow(wf.id);
  const expression = getCronExpression(wf)
  if (!expression) {
    return;
  }
  try {
    const job = new Cron(expression, async () => {
      const [found] = await db
        .select()
        .from(workflow)
        .where(eq(workflow.id, wf.id))
      if (!found || !found.active) return;
      await startExecution(found,"cron")
      })

    jobs.set(wf.id, job);

  } catch (err) {

  }
}
export async function loadSchedules(wf:WorkflowRow) {
  const found = await db
    .select()
    .from(workflow)
    .where(eq(workflow.active,true))
  for (const wf of list) scheduleWorkflow(wf);
  console.log("Scheduled",list.length,"active workflows")

}
