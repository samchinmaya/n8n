import { Elysia } from "elysia";
import { eq,and ,desc, getTableColumns} from "drizzle-orm"
import { type } from "arktype";
import {execution, workflow } from "../db/schema/index.ts"
import { apiError } from "../lib/ApiError.ts"
import { db } from "../db/index.ts";
import { authPlugin } from "../auth/plugin.ts";

export const executionRoutes = new Elysia({ prefix: "/executions" })
  .use(authPlugin)
  .get('/', async ({user}) => {
    const Execfound = await db
      .select({...getTableColumns(execution)})
      .from(execution)
      .innerJoin(workflow,eq(execution.workflowId,workflow.id))
      .where(eq(workflow.userId,user.id))
      .orderBy(desc(execution.createdAt))
      .limit(20)
    return Execfound
  },{auth:true})
  .get('/:id', async ({params,set,user}) => {
    const [IdFound] = await db
      .select({...getTableColumns(execution)})
      .from(execution)
      .where(and(eq(execution.id, params.id),eq(workflow.userId,user.id)))
      .limit(1)
    if (!IdFound) {
      set.status = 404
      return apiError("Execution not found",404)
    }
    return IdFound;
  }, { auth:true,params: type({ id: "string.uuid" }) })
