import { Elysia } from "elysia";
import { auth } from "./index.ts";
import { apiError } from "../lib/ApiError";


export const authPlugin = new Elysia({name:"auth"})
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const result = await auth.api.getSession({ headers });
        if (!result) {
          return status(401,apiError("Not Logged in",401))
        }
        return {user:result.user}
    },
  }})
