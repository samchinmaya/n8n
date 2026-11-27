import type { NodeDefinition } from "./types.ts";

export const httpRequest: NodeDefinition = {
  type: "httpRequest", // the node's type
  name: "HTTP Request", // the node's name
  isTrigger: false, // whether the node is a trigger
  execute: async (ctx) => { // the node's execution function
    const url = ctx.params.url as string; // the URL to request
    const method = (ctx.params.method as string) ?? "GET"; // the HTTP method to use
    const body = ctx.params.body as string; // the request body
    const headers = ctx.params.headers as Record<string, string>; // the request headers
    const response = await fetch(url, { method, body, headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      throw new Error(`Unexpected content type: ${contentType}`);
    }
    const data = await response.json();
    return data;
  }

}
