import { Elysia } from "elysia";
import { workflowRoutes } from "./routes/workflows";
import { apiError } from "./lib/ApiError";


const app = new Elysia()
  // turns every error into the same JSON shape (must come before the routes)
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 422;
      // Elysia puts the details in error.message as JSON; keep only the readable part
      let message = "Validation failed";
      try {
        message = JSON.parse(error.message).message ?? message;
      } catch {}
      return apiError(message, 422);
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return apiError("Route not found", 404);
    }
    console.error(error);
    set.status = 500;
    return apiError("Internal server error", 500);
  })
  .get('/health', () => ({ status: "ok" }))
  .use(workflowRoutes)
  .listen(Number(process.env.PORT)||3000);
console.log(`Server running on port ${Number(process.env.PORT) || 3000}`)
