import { Elysia } from "elysia";
import { workflowRoutes } from "./routes/workflows";
import { executionRoutes } from "./routes/executions";
import { openapi } from "@elysia/openapi";
import { loadSchedules } from "./engine/cronManager";
import { authPlugin } from "./auth/plugin";
import { apiError } from "./lib/ApiError.ts";

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return apiError("Route not found", 404);
    }
    if (code === "VALIDATION") {
      set.status = 400;
      return apiError(error.valueError?.message ?? "Invalid request", 400);
    }
    console.error(error);
    set.status = 500;
    return apiError("Something went wrong", 500);
  })
  .use(authPlugin)
  .use(openapi())
  .get('/health', () => ({ status: "ok" }))
  .use(executionRoutes)
  .use(workflowRoutes)
  .listen(Number(process.env.PORT)||3000);
console.log(`Server running on port ${Number(process.env.PORT) || 3000}`)

loadSchedules();

export { app };
