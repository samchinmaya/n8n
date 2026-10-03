import type { NodeDefinition } from "./types.ts";
export const setNode: NodeDefinition = {
  type: "set",
  name: "Set",
  isTrigger: false,
  execute: async (ctx) => {
    const field = ctx.params.field as string;
    const value = ctx.params.value;
    const data = (ctx.input ?? {}) as Record<string, unknown>;
    return { ...data, [field]: value };
  }
}
