import { Elysia } from "elysia";
import { type } from "arktype";
import { and,eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { workflow } from "../db/schema/index.ts";
import { WorkflowNode, WorkflowEdge } from "../types/workflow.ts";
import { apiError } from "../lib/ApiError.ts";
import { runWorkFlow } from "../engine/runWorkFlow.ts";

const TEST_USER_ID = "test-user"; // until real login on Day 5

const CreateWorkFlowBody = type({
  name: "string>0",
  "nodes?": WorkflowNode.array(),
  "edges?": WorkflowEdge.array(),
})

const UpdateWorkFlowBody = type({
  "name?": "string>0",
  "nodes?": WorkflowNode.array(),
  "edges?": WorkflowEdge.array(),
  "active?": "boolean",
})
export const workflowRoutes = new Elysia({ prefix: "/workflows" })
  .get("/", async () => {
    const workflows = await db
      .select()
      .from(workflow)
      .where(eq(workflow.userId, TEST_USER_ID))
    return workflows;
  })
  .get("/:id",
    async ({ params, set }) => {
      const [found] = await db
        .select()
        .from(workflow)
        .where(and(eq(workflow.userId, TEST_USER_ID), eq(workflow.id, params.id)))
      if (!found) {
        set.status = 404;
        return apiError("Workflow not found", 404);
      }
      return found;
    },
    { params: type({ id: "string.uuid" }) }
  )
  .patch("/:id",
    async ({ params, body, set }) => {
      const [updated] = await db
        .update(workflow)
        .set({ ...body, updatedAt: new Date() })
        .where(and(eq(workflow.userId, TEST_USER_ID), eq(workflow.id, params.id)))
        .returning();
      if (!updated) {
        set.status = 404;
        return apiError("Workflow not found", 404);
      }
      return updated;
    },
    { params: type({ id: "string.uuid" }), body: UpdateWorkFlowBody }

  )
  .delete("/:id",
    async ({ params, set }) => {
      const [deleted] = await db
        .delete(workflow)
        .where(and(eq(workflow.userId, TEST_USER_ID), eq(workflow.id, params.id)))
        .returning();
      if (!deleted) {
        set.status = 404;
        return apiError("Workflow not found", 404);
      }
      return deleted;
    },
    { params: type({ id: "string.uuid" }) }
  )
  .post("/:id/run",
    async ({ params, set }) => {
      const [found] = await db
        .select()
        .from(workflow)
        .where(eq(workflow.id, params.id))
        .limit(1);
      if (!found) {
        set.status = 404;
        return apiError("Workflow not found", 404);
      }

    },
    { params: type({ id: "string.uuid" }) }
  )
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
