import { Elysia } from "elysia";


const app = new Elysia()
  .get('/health', () => ({ status: "ok" }))
  .listen(Number(process.env.PORT)||3000);
console.log(`Server running on port ${Number(process.env.PORT) || 3000}`)
