import { Elysia } from "elysia";
import { type } from "arktype";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { workflow } from "../db/schema/index.ts";
import { WorkflowNode, WorkflowEdge } from "../types/workflow.ts";
import { apiError } from "../lib/ApiError.ts";

const TEST_USER_ID = "test-user"; // until real login on Day 5

const CreateWorkFlowBody = type({
  name: "string>0",
  "nodes?": WorkflowNode.array(),
  "edges?": WorkflowEdge.array(),
})
export const workflowRoutes = new Elysia({ prefix: "/workflows" })
  .get("/", async () => {
    const workflows = await db
      .select()
      .from(workflow)
      .where(eq(workflow.userId, TEST_USER_ID))
    return workflows;
  })
  .post("/",
    async ({ body, set }) => {
      const [created] = await db
        .insert(workflow)
        .values({
          userId: TEST_USER_ID,
          name: body.name,
          nodes: body.nodes ?? [],
          edges: body.edges ?? [],
        })
        .returning();
      set.status = 201;
      return created;
    },
    { body: CreateWorkFlowBody }
  )
