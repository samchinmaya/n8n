import { Elysia } from "elysia";
import { type } from "arktype";
import { and,eq,desc } from "drizzle-orm";
import { db } from "../db/index.ts";
import { execution, workflow } from "../db/schema/index.ts";
import { WorkflowNode, WorkflowEdge } from "../types/workflow.ts";
import { apiError } from "../lib/ApiError.ts";
import { startExecution } from "../engine/startExecution.ts";
import { scheduleWorkflow, unscheduleWorkflow } from "../engine/cronManager.ts";
import { authPlugin } from "../auth/plugin.ts";

const CreateWorkFlowBody = type({
  name: "string>0",
  "nodes?": WorkflowNode.array(),
  "edges?": WorkflowEdge.array(),
})


const UpdateWorkFlowBody = type({
  "+":"delete",
  "name?": "string>0",
  "nodes?": WorkflowNode.array(),
  "edges?": WorkflowEdge.array(),
  "active?": "boolean",
})


export const workflowRoutes = new Elysia({ prefix: "/workflows" })
  .use(authPlugin)
  .get("/", async ({user}) => {
    const workflows = await db
      .select()
      .from(workflow)
      .where(eq(workflow.userId, user.id))
    return workflows;
  },{auth:true})
  .get("/:id",
    async ({ params, set ,user}) => {
      const [found] = await db
        .select()
        .from(workflow)
        .where(and(eq(workflow.userId, user.id), eq(workflow.id, params.id)))
      if (!found) {
        set.status = 404;
        return apiError("Workflow not found", 404);
      }
      return found;
    },
    { auth: true, params: type({ id: "string.uuid" },) }
  )
  .patch("/:id",
    async ({ params, body, set ,user}) => {
      const [updated] = await db
        .update(workflow)
        .set({ ...body, updatedAt: new Date() })
        .where(and(eq(workflow.userId, user.id), eq(workflow.id, params.id)))
        .returning();
      if (!updated) {
        set.status = 404;
        return apiError("Workflow not found", 404);
      }
      if (updated.active) {
        scheduleWorkflow(updated)
      } else {
        unscheduleWorkflow(updated.id)
      }
      return updated;
    },
    { auth: true, params: type({ id: "string.uuid" }), body: UpdateWorkFlowBody }

  )
  .delete("/:id",
    async ({ params, set ,user}) => {
      const [deleted] = await db
        .delete(workflow)
        .where(and(eq(workflow.userId, user.id), eq(workflow.id, params.id)))
        .returning();
      if (!deleted) {
        set.status = 404;
        return apiError("Workflow not found", 404);
      }
      unscheduleWorkflow(deleted.id)
      return deleted;
    },
    { auth: true, params: type({ id: "string.uuid" },) }

  )
  .post("/:id/run",
    async ({ params, set,user }) => {
      const [found] = await db
        .select()
        .from(workflow)
        .where(and(eq(workflow.userId, user.id), eq(workflow.id, params.id)))
        .limit(1);
      if (!found) {
        set.status = 404;
        return apiError("Workflow not found", 404);
      }
      const result = await startExecution(found as any, "manual");
      return result;
    },
    { auth: true, params: type({ id: "string.uuid" },) }

  )
  .post("/",
    async ({ body, set ,user}) => {
      const [created] = await db
        .insert(workflow)
        .values({
          userId: user.id,
          name: body.name,
          nodes: body.nodes ?? [],
          edges: body.edges ?? [],
        })
        .returning();
      set.status = 201;
      return created;
    },
    { auth: true, body: CreateWorkFlowBody }
  )
  .get('/:id/executions', async ({ params, set,user }) => {
    const [found] = await db
      .select()
      .from(workflow)
      .where(and(eq(workflow.userId, user.id), eq(workflow.id, params.id)))
      .limit(1)
    if (!found) {
      set.status = 404;
      return apiError("Workflow not found", 404)
    }
    const executions = await db
      .select()
      .from(execution)
      .where(eq(execution.workflowId, found.id))
      .orderBy(desc(execution.createdAt))//newest in the top
    return executions;
  },
    { auth: true, params: type({ id: "string.uuid" })
 })
  .post('/:id/webhook', async ({params,set,body}) => {
    const [found] = await db
      .select()
      .from(workflow)
      .where(eq(workflow.id,params.id))
      .limit(1)
    if (!found) {
      set.status = 404;
      return apiError("workflow not found",404)
    }
    if (!found.active) {
      set.status = 403;
      return apiError("workflow is not active",403)

    }
    const result = await startExecution(found as any, "webhook", body)
    if (!result) {
      return apiError("execution not found",404)
    }
    return result;
  },{params:type({id:"string.uuid"}),body:type("object")})
