import { Elysia } from "elysia";
import { workflowRoutes } from "./routes/workflows";
import { executionRoutes } from "./routes/executions";
import { openapi } from "@elysia/openapi";
import { loadSchedules } from "./engine/cronManager";


import { auth } from "./auth";
const app = new Elysia()
  .mount(auth.handler)
  .use(openapi())
  .get('/health', () => ({ status: "ok" }))
  .use(executionRoutes)
  .use(workflowRoutes)
  .listen(Number(process.env.PORT)||3000);
console.log(`Server running on port ${Number(process.env.PORT) || 3000}`)

loadSchedules();

export { app };
