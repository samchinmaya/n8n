import Elysia from "elysia";
import { eq } from "drizzle-orm"
import { type } from "arktype";
import {execution } from "../db/schema/index.ts"
import { apiError } from "../lib/ApiError.ts"
export const executionRoutes = new Elysia()
