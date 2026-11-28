import type { NodeDefinition } from "./types";
export const manualTrigger: NodeDefinition = {
  type: "manualTrigger",
  name: "Manual Trigger",
  isTrigger: true,
  execute: async (ctx) => {
    const data = (ctx.input ?? {}) as Record<string, unknown>;
    return { ...data , startedAt: new Date().toISOString() };
  },
}
