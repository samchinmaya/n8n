import { Queue } from "bullmq";
export const connection = {
  host: String(process.env.REDIS_HOST ?? "localhost"),
  port: Number(process.env.REDIS_PORT ?? 6379),
};
export type RunJob = {
  executionId: string;
  workflowId: string;
}
export const workflowQueue = new Queue<RunJob>("workflow-runs", { connection });
