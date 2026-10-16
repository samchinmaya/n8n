import Elysia from "elysia";
import { eq,and ,desc} from "drizzle-orm"
import { type } from "arktype";
import {execution } from "../db/schema/index.ts"
import { apiError } from "../lib/ApiError.ts"
import { db } from "../db/index.ts";
export const executionRoutes = new Elysia({ prefix: "/executions" })
  .get('/', async () => {
    const Execfound = await db
      .select()
      .from(execution)
      .orderBy(desc(execution.createdAt))
      .limit(20)
    return Execfound
  })
  .get('/:id', async ({params,set}) => {
    const [IdFound] = await db
      .select()
      .from(execution)
      .where(eq(execution.id, params.id))

    if (!IdFound) {
      set.status = 404
      return apiError("Couldn't found the execution",404)
    }
    return IdFound;
  }, { params: type({ id: "string.uuid" }) })
