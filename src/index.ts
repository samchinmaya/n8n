import { Elysia } from "elysia";
import { workflowRoutes } from "./routes/workflows";
import { openapi } from "@elysia/openapi";


const app = new Elysia()
  .use(openapi())
  .get('/health', () => ({ status: "ok" }))
  .use(workflowRoutes)
  .use(executionsRoutes)
  .listen(Number(process.env.PORT)||3000);
console.log(`Server running on port ${Number(process.env.PORT) || 3000}`)
export { app };
