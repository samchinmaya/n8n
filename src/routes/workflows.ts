import { Elysia } from "elysia";
import { type } from "arktype";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { workflow } from "../db/schema/index.ts";
import { WorkflowNode, WorkflowEdge } from "../types/workflow.ts";
import { ApiResponse } from "../lib/ApiResponse.ts";

const TEST_USER_ID = "test-user"; // until real login on Day 5

const CreateWorkFlowBody = type({
  name: "string",
  "nodes?": WorkflowNode.array(),
  "edges?": WorkflowEdge.array(),
})
export const workflowRoutes = new Elysia()
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
      return new ApiResponse(201, created, "Workflow created successfully");
    },
    { body: CreateWorkFlowBody }
  )
