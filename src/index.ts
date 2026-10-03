import { Elysia } from "elysia";
import { workflowRoutes } from "./routes/workflows";


const app = new Elysia()
  .get('/health', () => ({ status: "ok" }))
  .use(workflowRoutes)
  .listen(Number(process.env.PORT)||3000);
console.log(`Server running on port ${Number(process.env.PORT) || 3000}`)
